package PhaidraUI::Model::Session;

use strict;
use warnings;
use base 'MojoX::Session::Store';
use Mango;
use Data::Dumper;

__PACKAGE__->attr('mango');
__PACKAGE__->attr('log');

=cut
sub new {
    my ($class, $mango, $logp) = @_;
    my $self = $class->SUPER::new();
    bless $self, $class;
	$log = $logp;
	
	$log->debug("XXXXX new session object");
    $self->mango($mango);

    return $self;
}
=cut
sub create {
    my ($self, $sid, $expires, $data) = @_;
    $self->log->debug("XXXXX session update/create: ".$sid);
    $self->mango->db->collection('session')->update(({_id => $sid}, { _id => $sid, expires => $expires, data => $data }, { upsert => 1 }) => 
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
    
    my $res = $self->mango->db->collection('session')->find_one({_id => $sid});
    $self->log->debug("XXXXX session load: ".$sid. "\nexpires: ".$res->{expires}."\ndata:".Dumper($res->{data}));
    
    return ($res->{expires}, $res->{data});
}

sub delete {
    my ($self, $sid) = @_;
    $self->log->debug("XXXXX session delete: ".$sid);
    my $res = $self->mango->db->collection('session')->remove({_id => $sid});
    return 1;
}

1;

