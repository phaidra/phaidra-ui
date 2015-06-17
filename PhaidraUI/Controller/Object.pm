package PhaidraUI::Controller::Object;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json decode_json);
use base 'Mojolicious::Controller';
use PhaidraUI::Model::Object;
use PhaidraUI::Model::Cache;
use PhaidraUI;
use URI::Encode;

use Data::Dumper;



sub uwmetadataeditor {
    my $self = shift;  	
    $self->stash(uwmetadataeditor_mode => 'object');
    
    my $object_model = PhaidraUI::Model::Object->new;	
    my $owner = $object_model->get_owner($self, $self->stash('pid'));
    
    my $init_data = { pid => $self->stash('pid'), current_user => $self->current_user, owner => $owner, uwmetadataeditor_mode => 'object' };
    $self->stash(init_data => encode_json($init_data));
    $self->stash(init_data_perl => $init_data);
    #$self->app->log->info("uwmetadata_template_editor: ".$self->app->dumper($init_data));
    $self->render('templates/uwmetadata/uwmetadataeditor');
    #$self->render('templates/uwmetadata/uwmetadataeditor_experiment');
    #$self->render('uwmetadataeditor');
}

sub uwmetadata_template_editor {
    my $self = shift;
    
    $self->stash(uwmetadataeditor_mode => 'template');
    my $init_data = { tid => $self->stash('tid'), current_user => $self->current_user, uwmetadataeditor_mode => 'template' };
    $self->stash(init_data => encode_json($init_data));  	 
    #$self->render('uwmetadataeditor');
    $self->render('templates/uwmetadata/uwmetadataeditor');	
}
sub modseditor {
     my $self = shift;
     $self->stash(mods_mode => 'object');
     
     my $object_model = PhaidraUI::Model::Object->new;	
     my $owner = $object_model->get_owner($self, $self->stash('pid'));
   
     
     
     my $init_data = { pid => $self->stash('pid'), current_user => $self->current_user, mods_mode => 'object' };
     $self->stash(init_data => encode_json($init_data)); 
     
     $self->render('templates/mods/modseditor');
}


sub mods_template_editor {
    
    my $self = shift;
    $self->stash(mods_mode => 'template');
    
    #my $init_data = { tid => $self->stash('tid'), current_user => $self->current_user };
    #$self->stash(init_data => encode_json($init_data));  	 
    
    ###my $cache_model = PhaidraUI::Model::Cache->new;
    ###my $res = $cache_model->get_mods_tree($self);
    #$self->app->log->info("mods_template_editor: ".$self->app->dumper($res));
    #my $resJson = decode_json($res) if defined $res;
    my $init_data = { tid => $self->stash('tid'), current_user => $self->current_user, mods_mode => 'template' };
    $self->stash(init_data => encode_json($init_data)); 
    
    ###$self->stash(init_data => encode_json($res));
    
    $self->render('templates/mods/modseditor');	
}

sub search {
        
        my $self = shift;  	 
	my $query = $self->param('q');

	my $init_data = { current_user => $self->current_user};
	
	if($query){
		$init_data->{query} = $query;	
	}
	
        $self->stash(init_data => encode_json($init_data));
    
	$self->render('objects/list');
}


sub view {
      
      my $self = shift;
      #my $int = {pid => $self->stash('pid')}; #get
      #my $int = {pid => $self->param('pid')};  #post
      
      my $payload = $self->req->json;
      #my $template = $payload->{'pidExtended'};  
      
      
      #my $data = $self->stash('pid');
      my $data = $self->param('pidExtended');
      $self->app->log->info("view stash pid: ".$self->app->dumper($self->stash('pid')));
      $self->app->log->info("view param pid: ".$self->app->dumper($self->param('pid')));
      $self->app->log->info("view payload pidExtended: ".$self->app->dumper($payload->{'pidExtended'}));
      $self->app->log->info("view stash pidExtended: ".$self->app->dumper($self->stash('pidExtended')));
      $self->app->log->info("view param pidExtended: ".$self->app->dumper($self->param('pidExtended')));
      
      
      
      #$data = decode_json($data);
      my $uri = URI::Encode->new( { encode_reserved => 0 } );
      $data = $uri->decode($payload->{'pidExtended'}) if defined $payload->{'pidExtended'};
      $data = decode_json($data)  if defined $payload->{'pidExtended'};
      
      $self->app->log->info("view data: ".$self->app->dumper($data));
      
      
      #my $pid = $data->{pid};
      #my $pid = decode_json($self->param('pid')) if defined $self->param('pid');
      my $pid;
      $pid = $self->param('pid') if defined $self->param('pid');
      if(not defined $pid){
           $pid = $self->stash('pid') if defined $self->stash('pid');
      }
      #$data->{pidExtended} = decode_json($pid);
      $self->app->log->info("view data9999: ".$pid);
      $data = decode_json($pid);
      
      
      my $object_model = PhaidraUI::Model::Object->new;	
      my $owner = $object_model->get_owner($self, $data->{pid});
      $data->{current_user} = $self->current_user;
      $data->{owner} = $owner;
      $data->{baseurl} = $self->app->config->{phaidra}->{baseurl};
      # url encode dot and dash
      $data->{baseurl} =~ s/\./%2E/g; 
      $data->{baseurl} =~ s/-/%2D/g;
      $data = encode_json($data);

      my $init_data_perl = { current_user => $self->current_user, pid => $pid, owner => $owner };
      $self->stash(init_data_perl => $init_data_perl);
      $self->stash(init_data => $data);

      $self->render('objects/view');
}

sub get_classifications{

        my $self = shift;
    
        my $valueURIs = $self->param('valueuris'); # post method
        $valueURIs  = decode_json $valueURIs;
    
    	my $cache_model = PhaidraUI::Model::Cache->new;	

	my @clss;
	foreach my $uri (@$valueURIs){
		my $class = $cache_model->resolve_class_uri($self, $uri);
		push @clss, $class;
	}
	$self->render(json => { classifications => \@clss }, status => 200);
}

sub get_geo{
    
    my $self = shift;
    
    my $object_model = PhaidraUI::Model::Object->new;	
    my $geo = $object_model->get_geo($self, $self->stash('pid'));
    
    $self->render(json =>  $geo , status => 200);
    
}
sub post_geo{
   
    my $self = shift;
    
    my $payload = $self->req->json;
    my $geo = $payload->{'geo'};
    
    my $object_model = PhaidraUI::Model::Object->new;	
    $geo = $object_model->post_geo($self, $self->stash('pid'), $geo);
    
    $self->render(json => { geo => $geo }, status => 200);
}



1;