package PhaidraUI::Controller::Collection;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';

sub view {
    my $self = shift;  	 

	my $pid = $self->stash('pid');

	my $init_data = { current_user => $self->current_user, pid => $pid };
    $self->stash(init_data => encode_json($init_data));
    
	$self->render('objects/members');
}

sub members {
	
	
	
}

1;
