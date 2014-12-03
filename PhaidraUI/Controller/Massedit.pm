package PhaidraUI::Controller::Massedit;

use strict;
use warnings;
use v5.10;
use Mango 0.24;
use Mojo::JSON qw(encode_json);
use Mojo::JSON qw(decode_json);
use base 'Mojolicious::Controller';


sub get_object_tripl{
   
        my $self = shift;
        #die('ended!!!!');
        my $res = { alerts => [], status => 200 };
        my $q;
        my $limit;
     
        if(defined($self->param('q'))){
		$q = $self->param('q');
        } 
        if(defined($self->param('limit'))){
		$limit = $self->param('limit');
        }
        
        $q = '%3Cinfo:fedora/o:13681%3E%20%3Chttp://purl.org/dc/elements/1.1/title%3E%20*';
        $q = '<info:fedora/o:67146> <http://purl.org/dc/elements/1.1/title> *';
        #$q = '<info:fedora/o:67144> * *';
        $self->app->log->info("get_object_tripl pram $limit $q ") ;
     
     	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/search/triples");
		$self->app->log->info("get_object_tripl path".$base[1]."/search/triples ") ;
	}else{
		# $url->path("/collection/$pid/members/$itempid/order/$position");
		$self->app->log->info("get_object_tripl2 path /search/triples ") ;
		$url->path("/search/triples");
	}
        
        #$url->query({'q' => $q, 'limit' => $limit});
        $url->query({'q' => $q});
      	my $token = $self->load_token;
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub { 	
  		my ($ua, $tx) = @_;
                #$self->app->log->debug("get_object_tripl ua".$self->app->dumper($ua));
                #$self->app->log->debug("get_object_tripl tx".$self->app->dumper($tx));
	  	if (my $res = $tx->success) {
	  		#$self->app->log->info("get_object_tripl success") ;
	  		$self->app->log->debug("get_object_tripl success".$self->app->dumper($res->json));
	  		#$self->app->log->debug("get_object_tripl success".$self->app->dumper($res));
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;
		 	$self->app->log->info("get_object_tripl error") ;
		 	if($tx->res->json){	  
			  	if(exists($tx->res->json->{alerts})) {
				 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
				 }else{
				  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
				 }
		        }
		}	
  	});
        
        #$self->render(json => { alerts => [] }, status => 200);
       	
  	
}




#
sub mass_edit {
        
        my $self = shift;

        my $username = $self->current_user->{username};
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
        my $template = $self->param('template');
        
        my $templates = $self->getTemplates();
        my $init_data;
        # initialize datastructure from scv or initial load
        if(not defined $template){
              my $csvFile = $self->param('scv');
              my $csvContent = $csvFile->{'asset'}->{'content'} if defined $csvFile->{'asset'}->{'content'};
              $csvContent = 'empty' if not defined $csvContent;
              $csvContent =~ s/\n/#mycsvseparator/g;
              $init_data = { 
                             current_user => $self->current_user, 
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
                $init_data = { 
                               current_user => $self->current_user, 
                               templates => $templates,
                               tmpl_selection => $tmpl_selection,
                               tmpl_datastructure => $tmpl_datastructure,
                               tmpl_name => $template
                            };
        }
        $self->stash(init_data => encode_json($init_data));       
        $self->stash(title => 'Mass edit');
        $self->render('massedit');
}
#
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

#
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



#
sub save_as_template{
            
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
#
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

#
sub load_template{
    
    my $self = shift;
    my $username = $self->current_user->{username};
    unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
    }
    my $payload = $self->req->json;
    
    my $datasetTemplates = $self->mango->db->collection('masstemplate')->find({owner => $username, template_name => $payload->{'template'}});
    
    my $templateSelections;
    while (my $template = $datasetTemplates->next) {
         $templateSelections = $template->{'selections'}
    }
    my $templates = $self->getTemplates();
    my $init_data = { 
                            current_user => $self->current_user, 
                            templates => $templates,
                            template_selections => $templateSelections
                       };
    $self->stash(init_data => encode_json($init_data));  
    
    $self->stash(title => 'Mass edit');
    $self->render('massedit');
}



# save data structure in 'massedit' collection, ready for processing by worker
#
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