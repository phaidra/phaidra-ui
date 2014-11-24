package PhaidraUI::Controller::Object;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';
use PhaidraUI::Model::Object;

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

1;
