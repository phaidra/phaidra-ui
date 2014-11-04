package PhaidraUI::Controller::Massedit;

use strict;
use warnings;
use v5.10;
use Mango 0.24;
use Mojo::JSON qw(encode_json);
use Mojo::JSON qw(decode_json);
use base 'Mojolicious::Controller';



##################333

sub mass_edit {
        
        my $self = shift;

        my $username = $self->current_user->{username};
        my $template = $self->param('template');
        $self->app->log->info("template55: ".$self->app->dumper($template))  if defined $template;
        
        my $templates = $self->getTemplates();
        my $init_data;
        # not loading from saved template
        if(not defined $template){
        
              
              #$self->app->log->info("templates33: ".$self->app->dumper($templates));
        
              my $query = $self->session->{'MEquery'};  # delete it?
    
              my $csvFile = $self->param('scv');
             
              my $csvContent = $csvFile->{'asset'}->{'content'} if defined $csvFile->{'asset'}->{'content'};
              $csvContent = 'empty' if not defined $csvContent;
              $csvContent =~ s/\n/#mycsvseparator/g;

        
                 $init_data = { 
                            current_user => $self->current_user, 
                            mf_test_data => 'bli bla61', 
                            query => $query, 
                            csv => $csvContent, 
                            templates => $templates 
                            };

        }else{
            # initialize datastructure from saved template
                
                my $datasetTemplate = $self->mango->db->collection('masstemplate')->find({owner => $username, template_name => $template});
                my $tmpl_selection;
                my $tmpl_datastructure;
                while (my $temp = $datasetTemplate->next) {
                   $tmpl_datastructure = $temp->{'items'};
                   $tmpl_selection = $temp->{'selections'};
                }
                $self->app->log->info("load_template selections99: ".$self->app->dumper($tmpl_selection));
                $init_data = { 
                            current_user => $self->current_user, 
                            mf_test_data => 'bli bla65', 
                            templates => $templates,
                            tmpl_selection => $tmpl_selection,
                            tmpl_datastructure => $tmpl_datastructure,
                            tmpl_name => $template
                            };
                $self->app->log->info("template77: ".$self->app->dumper($template)) ;              
        
        }
        $self->stash(init_data => encode_json($init_data));  
   
        #$self->app->log->info("Authentication failed for user $username. Error code: $code, Error: $err");
        
        $self->app->log->info("Init data44: ".$self->app->dumper(encode_json($init_data)));
        my $datastructure= $self->param('datastructure'); # delete it
        $self->app->log->info("Datastructure data44: ".$self->app->dumper(encode_json($datastructure)));
        
        
        $self->stash(title => 'Mass edit');
        $self->render('massedit');
}

sub save_csv{

        my $self = shift;
        
        
        my $datastructure = $self->param('data');
        $datastructure = decode_json($datastructure);
        my $csv = 'pid';
        
        my $index = 1;
        foreach my $record (@{$datastructure}){
            if($index ==1){
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



###################










=head1 comment


sub mass_edit {
        
        my $self = shift;
        
        #$self->stash(init_data => 'dummy init data');
        my $query = $self->session->{'MEquery'};
        my $init_data = { current_user => $self->current_user, mf_test_data => 'bli bla5', query => $query };
        $self->stash(init_data => encode_json($init_data));  
        
        #, query => $self->stash->querymf
        #$self->app->log->info("querymf: ".$self->flash('qmf'));
        #$self->app->log->info("Flash67: ".$self->app->dumper($self->session->{'MEquery'}));
        #$self->app->log->info("Init data: ".$self->app->dumper(encode_json($init_data)));
    
        $self->stash(title => 'dummy title');
        $self->render('massedit');
}

=cut

sub save_as_template{
            
        my $self = shift;
        
        my $username = $self->current_user->{username};
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
	
	my $payload = $self->req->json;
	$self->app->log->info("templatename : $payload->{templatename} ");
	
	my @existingTemplates = $self->getTemplates();
	$self->app->log->info("existingTemplates: ".$self->app->dumper(@existingTemplates));
	#if element is in array
	$self->app->log->info("save_as_template selections99: ".$self->app->dumper($payload->{selections}));
	
	if(  $payload->{templatename} ~~ @existingTemplates  ){
	       $self->app->log->info("save_as_template : true ");
	       $self->mango->db->collection('masstemplate')->update({"template_name" => $payload->{'templatename'}}, {'$set' => { 
                                                        'owner'      => $username,
                                                        'instance'   => $self->app->config->{phaidra}->{baseurl},
                                                        'saved_at'   => time,
                                                        'items'      => $payload->{datastructure},
                                                        'selections' => $payload->{selections},
                                                                                                                              }});	     
	}else{
	      $self->app->log->info("save_as_template : false ");
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

sub delete_template{

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
      $self->render(json => { alerts => [] }, status => 200);
      
}

# ????????? delete it?
sub load_template{
    
    my $self = shift;
    my $username = $self->current_user->{username};
    unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
    }
    my $payload = $self->req->json;
    $self->app->log->info("load payload: ".$self->app->dumper($payload));
    $self->app->log->info("load template name: ".$payload->{'template'});
    $self->app->log->info("load_template selections99: ".$self->app->dumper($payload->{selections}));
    
    my $datasetTemplates = $self->mango->db->collection('masstemplate')->find({owner => $username, template_name => $payload->{'template'}});
    $self->app->log->info("load: ".$self->app->dumper($datasetTemplates));
    
    my $templateSelections;
    while (my $template = $datasetTemplates->next) {
         #$self->app->log->info("load2: ".$template->{'selections'});
         #### $self->app->log->info("load3: ".$self->app->dumper($template->{'selections'}));
         #### $self->stash(loaded_template => encode_json($template->{'selections'}));
         $templateSelections = $template->{'selections'}
    }
    my $templates = $self->getTemplates();
    my $init_data = { 
                            current_user => $self->current_user, 
                            mf_test_data => 'bli bla63',
                            templates => $templates,
                            template_selections => $templateSelections
                       };
    $self->stash(init_data => encode_json($init_data));  
    
    #$self->stash(loaded_template => encode_json($datasetTemplates));
    
    $self->stash(title => 'Mass edit');
    $self->render('massedit');
    
 
}



sub save_template{
            
        my $self = shift;
        
        my $username = $self->current_user->{username};
        my $res = { alerts => [], status => 200 };

	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
	
	my $payload = $self->req->json;
	
	$self->mango->db->collection('masstemplate')->update({"template_name" => $payload->{templatename}}, {'$set' => { 
                                                        'owner'      => $username,
                                                        'instance'   => $self->app->config->{phaidra}->{baseurl},
                                                        'saved_at'   => time,
                                                        'items'      => $payload->{datastructure},
                                                        'selections' => $payload->{selections},
                                                                                                                      }});
	
	$self->render('massedit');
	#$self->render(json => { alerts => [] }, status => 200);
}



# save data structure in 'massedit' collection, ready for processing by worker
sub save_changes{
        my $self = shift;
        
        my $username = $self->current_user->{username};
        my $res = { alerts => [], status => 200 };

	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save selection, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
	
	my $payload = $self->req->json;
        
	$self->mango->db->collection('massedit')->insert({ owner    => $payload->{owner},
	                                                   instance => $self->app->config->{phaidra}->{baseurl},
	                                                   start_at => time,
	                                                   items    => $payload->{items}
	                                                 });
	
	$self->render(json => { alerts => [] }, status => 200);

}




1;