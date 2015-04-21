package PhaidraUI::Controller::Object;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json decode_json);
use base 'Mojolicious::Controller';
use PhaidraUI::Model::Object;
use PhaidraUI::Model::Cache;
use PhaidraUI;
#use Mojo::Util qw(url_unescape);

use Data::Dumper;



sub uwmetadataeditor {
    my $self = shift;  	
    $self->stash(uwmetadataeditor_mode => 'object');
    
    my $object_model = PhaidraUI::Model::Object->new;	
	my $owner = $object_model->get_owner($self, $self->stash('pid'));
    
    my $init_data = { pid => $self->stash('pid'), current_user => $self->current_user, owner => $owner };
    $self->stash(init_data => encode_json($init_data));
    $self->stash(init_data_perl => $init_data);
    $self->app->log->info("uwmetadata_template_editor: ".$self->app->dumper($init_data));
    $self->render('uwmetadataeditor');	
}

sub uwmetadata_template_editor {
    my $self = shift;
    $self->stash(uwmetadataeditor_mode => 'template');
    my $init_data = { tid => $self->stash('tid'), current_user => $self->current_user };
    $self->stash(init_data => encode_json($init_data));  	 
    $self->render('uwmetadataeditor');	
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
##################view object################################


=head1

sub view {
    my $self = shift;  	 

	my $pid = $self->stash('pid');
	
	my $object_model = PhaidraUI::Model::Object->new;	
	my $owner = $object_model->get_owner($self, $pid);

	my $init_data = { current_user => $self->current_user, pid => $pid, owner => $owner };
        $self->stash(init_data => encode_json($init_data));
        $self->stash(init_data_perl => $init_data);
    
	$self->render('objects/members');
}

=cut


sub view {
      
      my $self = shift;
      #my $int = {pid => $self->stash('pid')}; #get
      #my $int = {pid => $self->param('pid')};  #post
      my $data = $self->stash('pid');
      
      $data = decode_json($data);
      
      my $pid = $data->{pid};
      my $object_model = PhaidraUI::Model::Object->new;	
      my $owner = $object_model->get_owner($self, $pid);
      $data->{current_user} = $self->current_user;
      $data->{owner} = $owner;
      $data->{baseurl} = $self->app->config->{phaidra}->{baseurl};
      # url encode dot and dash
      $data->{baseurl} =~ s/\./%2E/g; 
      $data->{baseurl} =~ s/-/%2D/g;
      $self->app->log->info("baseurl: ".$self->app->dumper($data->{baseurl}));
      #$data->{username} = $self->current_user->{username};
      $data = encode_json($data);

      my $init_data_perl = { current_user => $self->current_user, pid => $pid, owner => $owner };
      $self->stash(init_data_perl => $init_data_perl);
      $self->stash(init_data => $data);

      $self->render('objects/view');
}

sub get_classifications{

        my $self = shift;
    
        my $valueURIs = $self->param('valueuris'); # post method
        $self->app->log->info("object get_classifications param: ".$self->app->dumper($self->param('valueuris')));
        $valueURIs  = decode_json $valueURIs;
    
    	my $cache_model = PhaidraUI::Model::Cache->new;	

	my @clss;
	foreach my $uri (@$valueURIs){
		my $class = $cache_model->resolve_class_uri($self, $uri);
		push @clss, $class;
	}
	#$self->app->log->info("get_classifications: ".$self->app->dumper(@clss));
	$self->render(json => { classifications => \@clss }, status => 200);
}
###########################################################


1;
