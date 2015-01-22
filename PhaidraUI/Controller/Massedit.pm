package PhaidraUI::Controller::Massedit;

use strict;
use warnings;
use v5.10;
use Mango 0.24;
use Mojo::JSON qw(encode_json);
use Mojo::JSON qw(decode_json);
use base 'Mojolicious::Controller';

use Mojo::IOLoop::ProcBackground;

use FindBin::libs;
use FindBin '$Bin';
use lib "$Bin/../lib";

use Data::Dumper;
$Data::Dumper::Indent= 1;



=head2 jobs
 
  Display mass edit

=cut 

sub mass_edit {
        
        my $self = shift;

        my $username = $self->current_user->{username};
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
        #my $template = $self->param('template');
        ###my $payload = $self->req->json;
        ###my $template = $payload->{'template'};
        ###$self->app->log->debug("template5551: ".$self->app->dumper($template));
        my $templates = $self->getTemplates();
        my $init_data;
        # initialize datastructure from scv or initial load
        ###if(not defined $template){
              my $csvFile = $self->param('scv');
              my $csvContent = $csvFile->{'asset'}->{'content'} if defined $csvFile->{'asset'}->{'content'};
              $csvContent = 'empty' if not defined $csvContent;
              $csvContent =~ s/\n/#mycsvseparator/g;
              $init_data = { 
                             current_user => $self->current_user, 
                             csv => $csvContent, 
                             templates => $templates 
                           };
        ###}else{
        ###    $self->app->log->debug("from saved template5551 ");
        ###    # initialize datastructure from saved template
        ###        my $datasetTemplate = $self->mango->db->collection('masstemplate')->find({owner => $username, template_name => $template});
        ###        my $tmpl_selection;
        ###        my $tmpl_datastructure;
        ###        while (my $temp = $datasetTemplate->next) {
        ###           $tmpl_datastructure = $temp->{'items'};
        ###           $tmpl_selection = $temp->{'selections'};
        ###       }
        ###        $init_data = { 
        ###                       current_user => $self->current_user, 
        ###                       templates => $templates,
        ###                       tmpl_selection => $tmpl_selection,
        ###                       tmpl_datastructure => $tmpl_datastructure,
        ###                       tmpl_name => $template
        ###                    };
        ###}
        $self->stash(init_data => encode_json($init_data));       
        $self->stash(title => 'Mass edit');
        $self->render('massedit');
}

sub save_csv{

        my $self = shift;
        
        my $username = $self->current_user->{username};
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
        
        my $datastructure = $self->param('data');
        $datastructure = decode_json($datastructure);
        my $csv = 'pid';
        
        my $index = 1;
        foreach my $record (@{$datastructure}){
            if($index == 1){
                   foreach my $change (@{$record->{'changes'}}){
                           $csv .= ','.$change->{'field'}
                   }
                   $csv .= "\n";
            }
            $csv .= $record->{'PID'};
            foreach my $change (@{$record->{'changes'}}){
                   $csv .= ','.$change->{'value'}
            }
            $csv .= "\n";
            $index++;
        }
                
        $self->render(data => $csv, format => 'dwn'); 
}

sub getTemplates{
  
    my $self = shift;
    my $username = $self->current_user->{username};
    
    my @templatesArr;
    my $datasetTemplates = $self->mango->db->collection('masstemplate')->find({owner => $username});
    while (my $template = $datasetTemplates->next) {
         push(@templatesArr, $template->{'template_name'});
    }
    return \@templatesArr;
}

sub template_load{
                
        my $self = shift;
        my $username = $self->current_user->{username};
        unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
        }
        my $payload = $self->req->json;
        my $template = $payload->{'template'};
        
        my $datasetTemplate = $self->mango->db->collection('masstemplate')->find({owner => $username, template_name => $template});
        my $tmpl_selection;
        my $tmpl_datastructure;
        my $templates = $self->getTemplates();
        while (my $temp = $datasetTemplate->next) {
               $tmpl_datastructure = $temp->{'items'};
               $tmpl_selection = $temp->{'selections'};
        }
        my $loaded_template = { 
                       current_user => $self->current_user, 
                       templates => $templates,
                       tmpl_selection => $tmpl_selection,
                       tmpl_datastructure => $tmpl_datastructure,
                       tmpl_name => $template
                             };
        
        $self->stash(title => 'Mass edit'); 
        $self->render(json => { loaded_template => $loaded_template }, status => 200);
        

}

sub template_save_as{
            
        my $self = shift;
        
        my $username = $self->current_user->{username};
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
	
	my $payload = $self->req->json;
	
	my @existingTemplates = $self->getTemplates();
	
	if(  $payload->{templatename} ~~ @existingTemplates  ){
	       $self->mango->db->collection('masstemplate')->update({"template_name" => $payload->{'templatename'}}, {'$set' => { 
                                                        'owner'      => $username,
                                                        'instance'   => $self->app->config->{phaidra}->{baseurl},
                                                        'saved_at'   => time,
                                                        'items'      => $payload->{datastructure},
                                                        'selections' => $payload->{selections},
                                                                                                                                }});	     
	}else{
              $self->mango->db->collection('masstemplate')->insert({ owner         => $username,
	                                                       instance      => $self->app->config->{phaidra}->{baseurl},
	                                                       saved_at      => time,
	                                                       items         => $payload->{datastructure},
	                                                       template_name => $payload->{templatename},
	                                                       selections    => $payload->{selections}
	                                                           });		
	
	}

	$self->render('massedit');
}

sub template_delete{

      my $self = shift;
     
      my $username = $self->current_user->{username};
      unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
      }
      
      my $payload = $self->req->json;
      my $forDeletion = $payload->{'fordeletion'};
      foreach my $template (@{$forDeletion}){
           $self->mango->db->collection('masstemplate')->remove({template_name => "$template" });
      }
      
      $self->render('massedit');
}

=head2 save_changes
 
  Save data structure in 'massedit' collection, ready for processing by worker

=cut  

sub save_changes{
        
        my $self = shift;
        
        my $username = $self->current_user->{username};
        my $res = { alerts => [], status => 200 };
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save selection, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
	
	my $payload = $self->req->json;
        
	$self->mango->db->collection('massedit')->insert({ owner       => $payload->{owner},
	                                                   instance    => $self->app->config->{phaidra}->{baseurl},
	                                                   start_at    => time,
	                                                   items       => $payload->{items},
	                                                   job_status  => 'not processed'
	                                                 });
	
	$self->render(json => { alerts => [] }, status => 200);
}

=head2 jobs
 
  Display jobs

=cut 

sub jobs{ 
    
       my $self = shift;
       
       
       my $username = $self->current_user->{username};
       unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot display jobs, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
       }
       
       my $datasetJobs = $self->mango->db->collection('massedit')->find();
       my $jobsHash;
       my @jobsArray;
       while (my $jobs = $datasetJobs->next) {
                   
                   my $job = $jobs->{'_id'};
                   
                   $jobsHash->{owner}      = $jobs->{owner};
                   $jobsHash->{instance}   = $jobs->{instance};
                   $jobsHash->{start_at}   = $jobs->{start_at};
                   $jobsHash->{job_status} = $jobs->{job_status};
                   $jobsHash->{id}         = $jobs->{_id};
                   push(@jobsArray, $jobsHash);
                   $jobsHash = {};       
       }
       
       my $init_data;
       $init_data->{jobsArray} = \@jobsArray;
       $init_data->{currPageInPaginator} =  $self->cookie('currPageInPaginator');
     
       $self->stash(init_data => encode_json($init_data)); 
       $self->stash(title => 'Mass edit Jobs');

       $self->render('agents/massedit/jobs');

}

=head2 jobs_action
 
  Display jobs details

=cut  

sub jobs_details{

       my($self) = @_;
       
       my $username = $self->current_user->{username};
       unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot display jobs details, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
       }
       my $id = {oid => $self->stash('jobid')};
       no strict 'subs';
       bless($id, Mango::BSON::ObjectID);
       use strict 'subs';
       my $datasetJobs = $self->mango->db->collection('massedit')->find({_id => $id});
  
       # /n and ' issues
       my $myItems;
       while (my $job = $datasetJobs->next) { 
              my @parsedItems;
              foreach my $item (@{$job->{'items'}}){
                    my @parsedAlerts;
                    foreach my $alert (@{$item->{alerts}}) {
                                  $alert->{msg} =~ s/'/myQuotePhaiDra123/g if defined $alert->{msg};
                                  $alert->{msg} =~ s/\n//g if defined $alert->{msg};
                                  push(@parsedAlerts, $alert);
                    } 
                    my @parsedChanges;
                    foreach my $change (@{$item->{changes}}) {
                                  $change->{msg} =~ s/'/myQuotePhaiDra123/g if defined $change->{msg};
                                  $change->{msg} =~ s/\n//g if defined $change->{msg};
                                  push(@parsedChanges, $change);
                    } 
                    $item->{alerts}  = \@parsedAlerts;
                    $item->{changes} = \@parsedChanges;
                    $item->{title}   =~ s/'/myQuotePhaiDra123/g if defined $item->{title};
                    $item->{title}   =~ s/\n//g if defined $item->{title};
                    push(@parsedItems, $item);
              }
              my $jobId->{jobId} = $self->stash('jobid');
              push(@parsedItems, $jobId);
              $myItems = \@parsedItems;
       }
         
       $self->stash(init_data => encode_json($myItems));
       $self->stash(title => 'Mass edit Jobs detail view');
       
       $self->render('agents/massedit/jobs/details');
       
}

=head2 jobs_action
 
 Process Job actions.
 
 Status               Action              Color
 
 Not processed         Start processing   white
 Processed             Done               green
 Processing            Abort              chartreuse
 Aborted               Resume             orange
 Failed                Resume             red
 Status not available  Resume             gray

=cut  
  
sub jobs_action{
  
       my($self) = @_;
       
      
       
       my $payload = $self->req->json;
       my $jobId               = $payload->{'jobId'};
       my $currPageInPaginator = $payload->{'currPageInPaginator'};
       my $jobAction           = $payload->{'jobAction'};       
        
       $self->cookie(currPageInPaginator => $payload->{'currPageInPaginator'});
       
       my $config_path     = $self->app->config->{massedit_agent}->{config_path};
       my $agent_location  = $self->app->config->{massedit_agent}->{agent_file_path}.'/'.$self->app->config->{massedit_agent}->{agent_file_name};
       my $instance        = $self->app->config->{phaidra}->{name};
       my $username        = $self->current_user->{username};
       my $jobid           = $payload->{'jobId'};
       
       my $proc = Mojo::IOLoop::ProcBackground->new;

       $proc->on(alive => sub {
              my ($proc) = @_;
              my $pid = $proc->proc->pid;
              unless($self->stash->{'_proc_'.$pid}){
                     $self->stash->{'_proc_'.$pid} = 0;
              }
              $self->stash->{'_proc_'.$pid}++;
              if($self->stash->{'_proc_'.$pid} == 1 || $self->stash->{'_proc_'.$pid} % 100 == 0){
                     $self->app->log->info("[".$self->current_user->{username}."] Ingest job $pid still running");
              }
      });
      $proc->on(dead => sub {
              my ($proc) = @_;
              my $pid = $proc->proc->pid;
              $self->app->log->info("[".$self->current_user->{username}."] Ingest job $pid terminated");
              undef $self->stash->{'_proc_'.$pid};
      });
 
      if($jobAction eq 'Start processing'){
                 $proc->run( $agent_location." '".$config_path."' '".$username."' '".$instance."' '".$jobid."'" );
      }
      if($jobAction eq 'Abort'){
                my $id = {oid => $jobid};
                no strict 'subs';
                bless($id, Mango::BSON::ObjectID);
                use strict 'subs';
                $self->mango->db->collection('massedit')->update({"_id" => $id}, {'$set' => { 'job_status' => 'aborted' }});
      }
      if($jobAction eq 'Resume'){
                my $id = {oid => $jobid};
                no strict 'subs';
                bless($id, Mango::BSON::ObjectID);
                use strict 'subs';
                $self->mango->db->collection('massedit')->update({"_id" => $id}, {'$set' => { 'job_status' => 'resumig' }});
                $proc->run( $agent_location." '".$config_path."' '".$username."' '".$instance."' '".$jobid."'" );
      }
      if($jobAction eq 'Force resume'){
                my $id = {oid => $jobid};
                no strict 'subs';
                bless($id, Mango::BSON::ObjectID);
                use strict 'subs';
                $self->mango->db->collection('massedit')->update({"_id" => $id}, {'$set' => { 'job_status' => 'resumig' }});
                $proc->run( $agent_location." '".$config_path."' '".$username."' '".$instance."' '".$jobid."'" );
      }

    
      $self->render(json => { alerts => [] }, status => 200);
             
}

sub jobs_delete{
  
       my($self) = @_;
       
       my $payload = $self->req->json;
       $self->cookie(currPageInPaginator => $payload->{'currPageInPaginator'});
       
       my $id = {oid => $payload->{'jobId'}};
       no strict 'subs';
       bless($id, Mango::BSON::ObjectID);
       use strict 'subs';
       my $res = $self->mango->db->collection('massedit')->remove({_id => $id }) if defined $payload->{'jobId'};
       
       $self->render('agents/massedit/jobs');
}


sub jobs_delete_all {
    
       my($self) = @_;
       
       my $res = $self->mango->db->collection('massedit')->drop;
       
       $self->render('agents/massedit/jobs');

}

sub jobs_refresh_action_button {

     my($self) = @_; 
     
     my $datasetJobs = $self->mango->db->collection('massedit')->find(); 
     my @jobsArray;
     while (my $job = $datasetJobs->next) { 
           my $jobHash = {};
           $jobHash->{id}           = $job->{_id};
           $jobHash->{job_status}   = $job->{job_status};
           $jobHash->{job_progress} = $job->{job_progress};
           push(@jobsArray, $jobHash);
     }
     
     $self->render(json => { jobsArray => \@jobsArray }, status => 200);
}

sub jobs_details_refresh_alerts {

     my($self) = @_; 
     
     my $payload = $self->req->json;
     my $id = {oid => $payload->{'jobId'}};
     no strict 'subs';
     bless($id, Mango::BSON::ObjectID);
     use strict 'subs';
     my $datasetJobs = $self->mango->db->collection('massedit')->find({_id => $id});
     my @newItems;
     while (my $job = $datasetJobs->next) { 
           foreach my $item (@{$job->{items}}){
                  my $itemHash = {};
                  $itemHash->{PID}    = $item->{PID};
                  $itemHash->{alerts} = $item->{alerts};
                  push(@newItems, $itemHash);
          }
     }
     $self->render(json => { refreshedItems => \@newItems }, status => 200);
}

1;