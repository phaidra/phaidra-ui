package PhaidraUI::Controller::Frontend;

use strict;
use warnings;
use v5.10;
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
    $self->render('uwmetadataeditor');	
}

1;
