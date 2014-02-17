package PhaidraUI::Controller::Info;

use strict;
use warnings;
use v5.10;
use base 'Mojolicious::Controller';

sub home {
    my $self = shift;  	 
    my $cu = $self->current_user();
    
    unless($self->flash('redirect_to')){
    	# if no redirect was set, reload the current url (portal)
    	$self->flash({redirect_to => $self->req->url});
    }      
        
    $self->render('home');	
}

1;
