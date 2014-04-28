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
    
    my $init_data = { current_user => $self->current_user };
    $self->stash(init_data => encode_json($init_data));  

    $self->render('home');	
}



1;
