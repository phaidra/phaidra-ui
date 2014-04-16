package PhaidraUI::Controller::Object;

use strict;
use warnings;
use v5.10;
use base 'Mojolicious::Controller';

sub browse {
    my $self = shift;  	 

	$self->render('objects/browse');
}

sub my_objects {
    my $self = shift;  	 
    
    
}

1;
