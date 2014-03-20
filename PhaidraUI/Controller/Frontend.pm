package PhaidraUI::Controller::Frontend;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';

sub home {
    my $self = shift;  	 
    
    unless($self->flash('redirect_to')){
    	# if no redirect was set, reload the current url
    	$self->flash({redirect_to => $self->req->url});
    }      

    $self->render('home');	
}

sub uwmetadataeditor {
    my $self = shift;  	
    $self->stash(uwmetadataeditor_mode => 'object');
    # we will add more later, like current user
    my $init_data = { pid => $self->stash('pid'), current_user => $self->current_user };
    $self->stash(init_data => encode_json($init_data));
    $self->render('uwmetadataeditor');	
}

sub uwmetadata_template_editor {
    my $self = shift;
    $self->stash(uwmetadataeditor_mode => 'template');
    my $init_data = { tid => $self->stash('tid'), current_user => $self->current_user };
    $self->stash(init_data => encode_json($init_data));  	 
    $self->render('uwmetadataeditor');	
}

1;
