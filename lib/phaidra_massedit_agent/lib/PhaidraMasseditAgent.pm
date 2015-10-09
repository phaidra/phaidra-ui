#!/usr/bin/perl -w

package PhaidraMasseditAgent;

use v5.10;

use strict;
use warnings;
use Data::Dumper;
$Data::Dumper::Indent= 1;

use Mojo::Util qw(slurp);
use Mojo::JSON qw(decode_json);
use Mojo::Log;
use Mojo::UserAgent;
use Mojo::URL;
use MongoDB;
# use FindBin;
# use lib $FindBin::Bin;
use MongoDB::MongoClient;
use MongoDB::OID;


sub new {
	my $class = shift;
	my $configpath = shift;
	my $userName = shift;
        my $ingest_instance = shift;

        my %par= @_;

	unless(defined($configpath)){
		# $configpath = $FindBin::Bin.'/PhaidraMasseditAgent.json'
		# NOTE: the module should not decide where the config file should
		say "ERROR: config path not defined";
	  return undef;
	}

	unless(-f $configpath){
		say "Error: config path $configpath is not a file";
		return undef;
	}

	unless(-r $configpath){
		say "Error: cannot access config: $configpath";
		return undef;
	}

	my $bytes = slurp $configpath;
	my $config = decode_json ($bytes);

=begin comment

DEPRECATED!
Object-Oriented Mojo::JSON API is DEPRECATED at .../lib/PhaidraMasseditAgent.pm ...

my $json = Mojo::JSON->new;
my $err= $json->error;

	if($err){
		say "Error: $err";
		return undef;
	}

=end comment
=cut

	my $password= getPassword($config->{'accounts'}, $userName);
	unless (defined $password)
	{
	    say "Error: cannot find user: $userName in massedit config file.";
	    return undef;
	}

	my $log = Mojo::Log->new(%{$config->{'log'}}); # TODO: check if this is really used

	my $paf= $config->{ingest_instances}->{$ingest_instance}->{paf_mongodb};

	my ($mongoHost, $mongoPort, $mongoUser, $mongoPass, $mongoDb)=
	    map { $paf->{$_} } qw(host port username password database);
	
	my $mongo = MongoDB::MongoClient->new(host => (defined ($mongoPort)) ? "$mongoHost:$mongoPort" : $mongoHost,
	              username => $mongoUser, password => $mongoPass, db_name => $mongoDb);
        my $mdb= $mongo->get_database($mongoDb);

        my $self=
        {
	  config          => $config,
          ingest_instance => $ingest_instance,
          user_name       => $userName,
	  password        => $password,
	  mongo           => $mongo,
          log             => $log,
	  massedit_agent_db   => $mdb,
	  collection_massedit => $mdb->get_collection('massedit'),
	  ua => Mojo::UserAgent->new,
        };

        bless($self, $class);

        foreach my $par (keys %par)
        {
          $self->{$par}= $par{$par};
        }

	return $self;
}

sub process_job
{
             my $self= shift;
             my $criterion= shift;

             if (ref ($criterion) eq '')
             {
               $criterion= { _id => MongoDB::OID->new(value => $criterion) };
             }
             elsif (ref($criterion) eq 'MongoDB::OID')
             {
               $criterion= { _id => $criterion };
             }
             elsif (ref($criterion) eq 'HASH') { } # that's cool
             else { return undef; } # no idea how the jobs should be selected

             my @datasetMassedit =  $self->{collection_massedit}->find( $criterion )->all();
             return undef unless (@datasetMassedit);

             my $uwm_proc;
             $uwm_proc= $self->{uwmetadata_processor} if (exists $self->{uwmetadata_processor});

             JOB: while (my $docMassedit= shift (@datasetMassedit))
             {
               my $current_job_id= $docMassedit->{_id};

               $self->{collection_massedit}->update({_id => $current_job_id}, {'$set' => { 'job_status' => 'processing' }});

                    my $items = $docMassedit->{'items'};
                    ITEM: foreach my $item (@$items)
                    {
                         my $currentJobStatus = $self->get_job_status($current_job_id);
                         last ITEM if( $currentJobStatus eq 'aborted' );

                               if( (!defined $item->{'status'}) || $item->{'status'} ne 'processed' ) {
                                           my $pid = $item->{'PID'};
                                           my $uwm = $self->getUwmetadata($pid);

                                           unless (defined $uwm->{uwmetadata})
                                           {
                                             say "Not getting any result from applyChanges!";
                                             next ITEM;
                                           }

                                           my $result1= $self->applyChanges($uwm, $item->{'changes'}, $pid);

                                           # TODO: callback for special cases
                                           if (defined ($uwm_proc))
                                           {
                                             my ($result_uwm_proc, $message_uwm_proc)= &$uwm_proc($uwm);
                                             # TODO: check for error information
                                             # put message into jobs result or whatever...
                                           }

                                           my $result2= $self->uploadUwmetadata($uwm, $pid);
                                           # TODO: now there are three results

                                           if(defined $result2){
                                                   $self->writeAlertsAndStatus($pid, $result2, $current_job_id);
                                           }else{
                                             # TODO: think about what needs to be done now
                                           }
                              }
                    }

               my $job_status = $self->get_job_status($current_job_id);
               if(defined $job_status && $job_status ne 'aborted')
               {
                 $self->{collection_massedit}->update({_id => $current_job_id}, {'$set' => { 'job_status' =>'processed'}});
               }
             }
}

sub get_job_status{

      my($self, $masseditJobId) = @_;

      my $datasetMassedit =  $self->{collection_massedit}->find({ _id => MongoDB::OID->new(value => $masseditJobId) });
      my $job_status;
      while (my $docMassedit = $datasetMassedit->next){
             $job_status = $docMassedit->{'job_status'};
      }
      return $job_status;
}


sub writeAlertsAndStatus{

      my($self, $pid, $result, $masseditJobId) = @_;

      my $datasetMassedit =  $self->{collection_massedit}->find({ _id => MongoDB::OID->new(value => $masseditJobId) });
      my @myItems;
      my $itemsCount = 0;
      my $processedItemsCount = 0;
      while (my $docMassedit = $datasetMassedit->next) {
             foreach my $item (values @{$docMassedit->{items}}){
                    $itemsCount++;
                    if($item->{PID} eq $pid){
                           foreach my $alert (@{$result->{alerts}}){
                                  if( ( defined $alert ) && ( defined $alert->{type} ) ){
                                       #if($alert->{type} ne 'success'){
                                             push(@{$item->{alerts}}, $alert) ;
                                       #}
                                       # either success or with errors but it is processed!
                                       $item->{status} = 'processed';
                                  }
                          }
                    }
                    push(@myItems,$item);
                    if(( defined $item->{status} ) && ($item->{status} eq 'processed') ){
                           $processedItemsCount++;
                    }
             }
      }

      my $jobProgress= ($itemsCount > 0) ? int($processedItemsCount/$itemsCount*100) : 100;

      $self->{collection_massedit}->update({"_id" => MongoDB::OID->new(value => $masseditJobId)}, {'$set' => {'items' => \@myItems, 'job_progress' => $jobProgress}});
}


sub applyChanges {

    my($self, $uwm, $changes, $pid) = @_;

    foreach my $change (@$changes){
           my $i = 0;
           foreach my $metadataField (values @{$uwm->{uwmetadata}}){
                       my $xmlname = $metadataField->{xmlname};
                       my $j = 0;
                       foreach my $children (values @{$metadataField->{children}}){
                            if( $children->{xmlname} eq $change->{'field'}){
                                   $uwm->{uwmetadata}[$i]->{children}[$j]->{ui_value} = $change->{'value'};
                            }
                            $j++;
                      }
                      $i++;
           }
    }

    # TODO: return number of changed and optional message..
}

sub uploadUwmetadata
{
  my $self= shift;
  my $uwm= shift;
  my $pid= shift;

    my $username = $self->{user_name};
    my $password = $self->{password};
    my $ingest_instance = $self->{ingest_instance};

    my $url = Mojo::URL->new;
    $url->scheme('https');
    $url->userinfo("$username:$password");
    my @base = split('/',$self->{config}->{ingest_instances}->{$ingest_instance}->{apibaseurl});
    $url->host($base[0]);
    if(exists($base[1])){
	 $url->path($base[1]."/object/$pid/uwmetadata");
    }else{
	 $url->path("object/$pid/uwmetadata");
    }

    my $alerts;
    my $tx = $self->{ua}->post($url => json => $uwm);
	  	
    if (my $res = $tx->success) {
	  return $res->json;
    }else{
	  if($tx->res->json){
		if($tx->res->json->{alerts}){
		        foreach my $alert (@{$tx->res->json->{alerts}}){
		            if(ref($alert) eq 'ARRAY') {
		                  foreach my $alert2 (@{$alert}){
		                        push(@{$alerts->{alerts}}, $alert2);
		                  }
		            }else{
		                  push(@{$alerts->{alerts}}, $alert);
		            }
		        }
		        return $alerts;
		}
	  }
	  my $err = $tx->error;
	  if ($err->{code}){
		$alerts = {pid => $pid, alerts => { type => 'danger',  msg => $err->{code}." response: ".$err->{message} } };
		push(@{$self->{alerts}}, $alerts);
	  }else{
		$alerts = { pid => $pid, alerts => {type => 'danger',  msg=> "Connection error: ".$err->{message} } };
		push(@{$self->{alerts}}, $alerts);
	  }

	  return $alerts;
   }	
}

sub getUwmetadata {

    my($self, $pid) = @_;

    my $alerts;

    my $url = Mojo::URL->new;
    $url->scheme('https');

    my $username = $self->{user_name};
    my $password = $self->{password};
    my $ingest_instance = $self->{ingest_instance};

    $url->userinfo("$username:$password");
    my @base = split('/',$self->{config}->{ingest_instances}->{$ingest_instance}->{apibaseurl});
    $url->host($base[0]);
    if(exists($base[1])){
	 $url->path($base[1]."/object/$pid/uwmetadata");
    }else{
	 $url->path("object/$pid/uwmetadata");
    }

    my $tx = $self->{ua}->get($url);

    if(my $res = $tx->success){
	  return $res->json;		  		
    }else{
	  if($tx->res->json){
		if($tx->res->json->{alerts}){
		        $alerts = { pid => $pid, alerts => $tx->res->json->{alerts} };
		        push(@{$self->{alerts}}, $alerts);
		        return $alerts;
		}
	  }
	  my $err = $tx->error;
	  if($err->{code}){
		$alerts = { pid => $pid, alerts =>{ type => 'danger', msg => $err->{code}."response: ".$err->{message} } };
		push(@{$self->{alerts}}, $alerts);
	  }else{
		$alerts = { pid => $pid, alerts => { type => 'danger', msg => "Connection error: ".$err->{message} } };
		push(@{$self->{alerts}}, $alerts);
	  }
	  return $alerts;
   }	
}

sub getPassword {

     my ($accounts, $userName) = @_;

     my $password;
     foreach my $key (keys %$accounts){
             if($accounts->{$key}->{username} eq $userName){
                 $password = $accounts->{$key}->{password};
             }
     }
     return $password;
}

1;
