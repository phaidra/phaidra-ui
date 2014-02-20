package PhaidraUI::Model::Session;

use strict;
use warnings;
use base 'MojoX::Session::Store';
use Mango;
use Carp qw(croak);

use namespace::clean;

__PACKAGE__->attr('mango');

sub new {
    my ($class, $mango) = @_;
    my $self = $class->SUPER::new();
    bless $self, $class;

    $self->mango($mango);

    return $self;
}

sub create {
    my ($self, $sid, $expires, $data) = @_;
    
    $self->mango->collection('session')->update(({sid => $sid}, { _id => $sid, expires => $expires, data => $data }, { upsert => 1 }) => 
	    sub {
	    	my ($collection, $err, $oid) = @_;	 
	    	return $err ? 0 : 1;    	
	    }
    );    
}

sub update {
    shift->create(@_);
}

sub load {
    my ($self, $sid) = @_;
    my $res = $self->mango->collection('session')->find_one({_id => $sid});
    return ($res->{expires}, $res->{data});
}

sub delete {
    my ($self, $sid) = @_;
    my $res = $self->mango->collection('session')->remove({_id => $sid});
    return 1;
}

1;

