package PhaidraUI::Controller::Collection;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';
use PhaidraUI::Model::Object;

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


1;
