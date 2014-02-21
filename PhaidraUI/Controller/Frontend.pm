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
=cut    
    $self->mango->db->collection('test')->update(({sid => 123 }, { sid => 123, expires => 123214, data => { username => 'hudakr4' ,test => 'huda'} }, { upsert => 1 }) => 
	    sub {
	    	my ($collection, $err, $oid) = @_;	 
	    	$self->app->log->error("XXXXX error:".$self->app->dumper($err));
	    	return $err ? 0 : 1;    	
	    }
    );
=cut        
    $self->render('home');	
}

sub uwmetadataeditor {
    my $self = shift;  	 
    $self->render('uwmetadataeditor');	
}

1;
