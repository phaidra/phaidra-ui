#!/usr/bin/perl -w

package PhaidraMasseditAgent;

use v5.10;

use strict;
use warnings;
use Data::Dumper;
$Data::Dumper::Indent= 1;

use Mojo::Util qw(slurp);
use Mojo::JSON qw(encode_json decode_json);
use Mojo::Log;
use Mojo::UserAgent;
use Mojo::URL;
use MongoDB;
use FindBin;
use lib $FindBin::Bin;
use MongoDB::MongoClient;
use MongoDB::OID;


sub new {
	my $class = shift;
	my $configpath = shift;
	my $userName = shift;
        my $ingest_instance = shift;
        
        my $self = {};
        bless($self, $class);
	
	my $log;
	my $config;
	my $mongo;
	
	unless(defined($configpath)){
		$configpath = $FindBin::Bin.'/PhaidraMasseditAgent.json'
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
	my $json = Mojo::JSON->new;
	$config = $json->decode($bytes);
	
	my $err  = $json->error;
         
	if($err){
		say "Error: $err";
		return undef;
	}
       
	$self->{config} = $config;
        
        $self->{ingest_instance} = $ingest_instance;
        $self->{user_name} = $userName;
	my $password = $self->getPassword($userName);
	if(defined $password){
	    $self->{password} = $password;
	}else{
	    say "Error: cannot find user: $userName in massedit config file.";
	    return undef;
	}
        
	
	$log = Mojo::Log->new(path => $config->{'log'}->{path}, level => $config->{'log'}->{level});
        $self->{'log'} = $log;
              
	my $mongoHost = $config->{ingest_instances}->{$ingest_instance}->{paf_mongodb}->{host};
	my $mongoPort = $config->{ingest_instances}->{$ingest_instance}->{paf_mongodb}->{port}; 
	my $mongoUser = $config->{ingest_instances}->{$ingest_instance}->{paf_mongodb}->{username}; 
	my $mongoPass = $config->{ingest_instances}->{$ingest_instance}->{paf_mongodb}->{password};
	my $mongoDb   = $config->{ingest_instances}->{$ingest_instance}->{paf_mongodb}->{database};
	
	$mongo = MongoDB::MongoClient->new(host => "$mongoHost:$mongoPort", username => "$mongoUser", password => "$mongoPass", db_name => "$mongoDb");

	$self->{mongo} = $mongo;
	$self->{massedit_agent_db} = $mongo->get_database($mongoDb);
	$self->{collection_massedit} = $self->{massedit_agent_db}->get_collection('massedit');
	$self->{ua} = Mojo::UserAgent->new;

	return $self;
}

sub process_job {

             my($self, $masseditJobId) = @_;
        
             $self->{collection_massedit}->update({"_id" => MongoDB::OID->new(value => "$masseditJobId")}, {'$set' => { 'job_status' =>'processing'}});
             my $datasetMassedit =  $self->{collection_massedit}->find({ _id => MongoDB::OID->new(value => "$masseditJobId") });
             while (my $docMassedit = $datasetMassedit->next){
                    my $items = $docMassedit->{'items'};
                    foreach my $item (@$items){
                         my $currentJobStatus = $self->get_job_status($masseditJobId);
                         if( $currentJobStatus ne 'aborted' ){
                               if( (not defined $item->{'status'})  || ( (defined $item->{'status'}) && ($item->{'status'} ne 'processed') ) ){
                                           my $pid = $item->{'PID'};
                                           my $uwm = $self->getUwmetadata($pid);
                                           my $changes = $item->{'changes'};
                                           my $result;
                                           $result = $self->applyChanges($uwm, $changes, $pid) if  defined $uwm->{uwmetadata};
                                           if(defined $result){
                                                   $self->writeAlertsAndStatus($pid, $result, $masseditJobId);
                                           }else{
                                                   say "Not getting any result from apllaychanges!";
                                           }
                              }
                        }else{
                             last;
                        }
                  }
                  
             }
             # mark Job as processed
             my $job_status = $self->get_job_status($masseditJobId);
             if(defined $job_status){
                  if($job_status ne 'aborted'){
                        $self->{collection_massedit}->update({"_id" => MongoDB::OID->new(value => "$masseditJobId")}, {'$set' => { 'job_status' =>'processed'}});
                  }
             }
}

sub get_job_status{
 
      my($self, $masseditJobId) = @_;
      
      my $datasetMassedit =  $self->{collection_massedit}->find({ _id => MongoDB::OID->new(value => "$masseditJobId") });
      my $job_status;
      while (my $docMassedit = $datasetMassedit->next){
             $job_status = $docMassedit->{'job_status'};
      }
      return $job_status;
}


sub writeAlertsAndStatus{

      my($self, $pid, $result, $masseditJobId) = @_;
     
      my $datasetMassedit =  $self->{collection_massedit}->find({ _id => MongoDB::OID->new(value => "$masseditJobId") });
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
      my $jobProgress; 
      $jobProgress = $processedItemsCount/$itemsCount if $itemsCount ne 0;
      $jobProgress = sprintf "%.2f", $jobProgress;
      $jobProgress = $jobProgress*100;
      $self->{collection_massedit}->update({"_id" => MongoDB::OID->new(value => "$masseditJobId")}, {'$set' => {'items' => \@myItems, 'job_progress' => $jobProgress}});
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

     my($self, $userName) = @_;
     
     my $password;
     foreach my $key (keys %{$self->{config}->{accounts}}){
             if($self->{config}->{accounts}->{$key}->{username} eq $userName){
                 $password = $self->{config}->{accounts}->{$key}->{password};
             }
     }
     return $password;
}

1;