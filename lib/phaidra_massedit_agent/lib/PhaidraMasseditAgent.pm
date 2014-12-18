#!/usr/bin/perl -w

package PhaidraMasseditAgent;

use v5.10;
use strict;
use warnings;
use Data::Dumper;
$Data::Dumper::Indent= 1;
use File::Find;
use Mojo::Util qw(slurp);
use Mojo::JSON qw(encode_json decode_json);
use Mojo::Log;
use Mojo::UserAgent;
use Mojo::URL;
use MongoDB;
use Carp;
use FindBin;
use lib $FindBin::Bin;
use MongoDB::MongoClient;
use MongoDB::OID;
use Sys::Hostname;


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
	#$self->{jobs_coll} = $self->{bagger_massedit_agent_db}->get_collection('jobs');
	$self->{collection_massedit} = $self->{massedit_agent_db}->get_collection('massedit');
	$self->{ua} = Mojo::UserAgent->new;

	return $self;
}

sub process_job {

       my($self, $masseditJobId) = @_;
        
        # mark Job as processing
       print "processing...";
       $self->{collection_massedit}->update({"_id" => MongoDB::OID->new(value => "$masseditJobId")}, {'$set' => { 'job_status' =>'processing'}});
       my $datasetMassedit =  $self->{collection_massedit}->find({ _id => MongoDB::OID->new(value => "$masseditJobId") });
       print "\n\n\n";
       print "jobId:", $masseditJobId;
       print "\n\n\n";
       while (my $docMassedit = $datasetMassedit->next) 
       {
             print "\n---------massedit---------------------------\n";
             print "owner:  ".$docMassedit->{'owner'}."\n";
             my $items = $docMassedit->{'items'};
             foreach my $item (@$items){
                 print "\n-----item-------------------------------\n";
                 my $pid = $item->{'PID'};
                 print "pid:  ".$pid."\n";
                 $self->markPidUpdateStarted($masseditJobId, $pid);
                 my $uwm = $self->getUwmetadata($pid);
                 
                 print $item->{'PID'},"\n\n\n";
                 my $changes = $item->{'changes'};
                 if($pid eq 'o:61858'){
                     #say "================uwmXml====================================";
                     #print Dumper($uwm);
                     open (MYFILE, '>>uwmXml.json');
                     print MYFILE "uwmXml: \n";
                     print MYFILE Dumper($uwm);
                     close MYFILE;
                     #say "====================================================---";
                 }
                 #print Dumper($uwm); #if $pid eq 'o:61858';
                 #exit if $pid eq 'o:61858';
                 my $result;
                 $result = $self->applyChanges($uwm, $changes, $pid) if  defined $uwm->{uwmetadata};
                 
                 if(defined $result->{alerts}){
                       #foreach my $alert (@{$result->{alerts}}){
                              #if($alert->{type} ne 'success'){
                                     $self->write_result_alerts($pid, $result, $masseditJobId);
                                     #last;
                              #}
                       #}
                 }
                 
                 print 'Result: ',Dumper($result)."\n\n";
                 #exit;
            }
       }
       # mark Job as processed
       print "processed";
       $self->{collection_massedit}->update({"_id" => MongoDB::OID->new(value => "$masseditJobId")}, {'$set' => { 'job_status' =>'processed'}});
       print Dumper($self->{alerts});
}


#     $r->route('object/:pid/uwmetadata')         ->via('get')      ->to('uwmetadata#get');
#     $apiauth->route('object/:pid/uwmetadata')   ->via('post')     ->to('uwmetadata#post');

#  5489a0a106b2af2a61010000
#  548ffd1f06b2af4ddd030000
#  548ffd1f06b2af4ddd030000

sub markPidUpdateStarted{
 
      my($self, $masseditJobId, $pid) = @_;

      my $datasetMassedit =  $self->{collection_massedit}->find({ _id => MongoDB::OID->new(value => "$masseditJobId") });
      my @myItems;
      while (my $docMassedit = $datasetMassedit->next) {
             foreach my $item (values @{$docMassedit->{items}}){
                   if(defined $item->{PID}){
                         if($item->{PID} eq $pid){
                               $item->{status} = 'processing'
                         }
                   }
                   push(@myItems,$item);
             }
      }
      #$self->{collection_massedit}->update({"_id" => MongoDB::OID->new(value => "$masseditJobId")}, {'$set' => {'items' => \@myItems , 'job_status' =>'processing'}});
}

sub write_result_alerts{

      my($self, $pid, $result, $masseditJobId) = @_;
     
      my $datasetMassedit =  $self->{collection_massedit}->find({ _id => MongoDB::OID->new(value => "$masseditJobId") });
      my @myItems;
      while (my $docMassedit = $datasetMassedit->next) {
             foreach my $item (values @{$docMassedit->{items}}){
                    if($item->{PID} eq $pid){
                            foreach my $alert (@{$result->{alerts}}){
                                  print Dumper($alert);
                                  if($alert->{type} ne 'success'){
                                        $item->{alerts} =  $result->{alerts};                           
                                  }
                                  $item->{status} = 'processed';
                            }
                    }
                    push(@myItems,$item);
             }
             
      }
      #print Dumper($masseditJobId);
      #exit;
      $self->{collection_massedit}->update({"_id" => MongoDB::OID->new(value => "$masseditJobId")}, {'$set' => {'items' => \@myItems}});
}


sub applyChanges {
  
    my($self, $uwm, $changes, $pid) = @_;
     
    foreach my $change (@$changes){
           print "\n-----changes-------------------------------\n";
           print $change->{'value'}, "\n";
           print $change->{'field'}, "\n";
           my $i = 0;
           foreach my $metadataField (values @{$uwm->{uwmetadata}}){
                       my $xmlname = $metadataField->{xmlname};
                       my $j = 0;
                       foreach my $children (values @{$metadataField->{children}}){
                            if( $children->{xmlname} eq $change->{'field'}){
                                   #$uwm->{uwmetadata}[$i]->{children}[$j]->{loaded_ui_value} = $change->{'value'};
                                   #$uwm->{uwmetadata}[$i]->{children}[$j]->{loaded_value}    = $change->{'value'};
                                   $uwm->{uwmetadata}[$i]->{children}[$j]->{ui_value}        = $change->{'value'};
                                   say 'value22:', $uwm->{uwmetadata}[$i]->{children}[$j]->{ui_value};
                                   print "\n\n";
                            }
                            $j++;
                      } 
                      $i++;
           }  
               
    } 
    if($pid eq 'o:62069'){
                     open (MYFILE, '>>uwmXmlResult62069.json');
                     print MYFILE "uwmXml: \n";
                     print MYFILE Dumper($uwm);
                     close MYFILE;
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
    
    #print Dumper($uwm);
    my $alerts;
    my $tx = $self->{ua}->post($url => json => $uwm);
	  	
    if (my $res = $tx->success) {
	  say 'successfull';
	  return $res->json;
    }else{
	  if($tx->res->json){
		if($tx->res->json->{alerts}){
		        print 'error json: ', Dumper($tx->res->json->{alerts});
		        $alerts = { pid => $pid, alerts => $tx->res->json->{alerts} };
		        push(@{$self->{alerts}}, $alerts);
		        return $alerts;
		}
	  }
	  my @msgs;
	  my $err = $tx->error;
	  if ($err->{code}){
		say 'error code: ', $err->{message} ;
		push(@msgs, $err->{code}." response: ".$err->{message});
		$alerts = {pid => $pid, alerts => { type => 'danger',  msg => $err->{code}." response: ".$err->{message} } };
		push(@{$self->{alerts}}, $alerts);
	  }else{
		say 'error Connection: ', $err->{message} ;
		push(@msgs, "Connection error: ".$err->{message});
		$alerts = { pid => $pid, alerts => {type => 'danger',  msg=> "Connection error: ".$err->{message} } };
		push(@{$self->{alerts}}, $alerts);
	  }
	  return $alerts;
   }	
}



sub getUwmetadata {

    my($self, $pid) = @_;
    
    
    my $alerts;
    if($pid eq 'o:61858'){
        my @msgs;
        push(@msgs, "Connection error2: "."Dummy error.");
        $alerts = { pid => $pid, alerts => { type => 'danger4',  msg => "Connection error2: "."Dummy error." } };
        push(@{$self->{alerts}}, $alerts);
        return $alerts;
    }
   
    my $url = Mojo::URL->new;
    $url->scheme('https');
    
    my $username = $self->{user_name};
    my $password = $self->{password};
    my $ingest_instance = $self->{ingest_instance};
    
    say "pid",$pid;
    say 'username',$username;
    
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
	  my @msgs;
	  if($tx->res->json){
		if($tx->res->json->{alerts}){
		        say 'error (json exists): ', $tx->res->json->{alerts} ;
		        $alerts = { pid => $pid, alerts => $tx->res->json->{alerts} };
		        push(@{$self->{alerts}}, $alerts);
		        return $alerts;
		}
	  }
	  my $err = $tx->error;
	  if($err->{code}){
		say 'error (code exists): ', $tx->res->json->{alerts};
		push(@msgs, $err->{code}."response: ".$err->{message});
		$alerts = { pid => $pid, alerts =>{ type => 'danger', msg => $err->{code}."response: ".$err->{message} } };
		push(@{$self->{alerts}}, $alerts);
	  }else{
		say 'error (code not exists): ', $tx->res->json->{alerts};
		push(@msgs, "Connection error: ".$err->{message});
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