package PhaidraUI::Controller::Object;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';

sub browse {
    my $self = shift;  	 

	my $init_data = { current_user => $self->current_user };
    $self->stash(init_data => encode_json($init_data));
    
	$self->render('objects/browse');
}



1;
