package PhaidraUI::Controller::Authentication;

use strict;
use warnings;
use v5.10;
use Mojo::ByteStream qw(b);
use base 'Mojolicious::Controller';

# bridge
sub check {	
	my $self = shift;
	
	unless($self->is_user_authenticated){
		$self->flash({opensignin => 1});
		$self->flash({redirect_to => $self->req->url});
		$self->redirect_to('/') and return 0;	
	}

    return 1;    
}

sub signout {
	my $self = shift;
	$self->logout();
	$self->flash( alerts => [{ type => 'info', msg => 'You have been signed out' }] );
	$self->redirect_to('/');
}

sub signin {
	
	my $self = shift;
		
	my $auth_header = $self->req->headers->authorization;
    # this should not happen, we are using this login method only on frontend
    # where we generate the request ourselves
    unless($auth_header)
    {
    	$self->res->headers->www_authenticate('Basic "'.$self->app->config->{authentication}->{realm}.'"');
    	$self->render(json => { alerts => [{ type => 'danger', msg => 'please authenticate' }]} , status => 401) ;
    	return;
    }
    
    my ($method, $str) = split(/ /,$auth_header);
    my ($username, $password) = split(/:/, b($str)->b64_decode);
    
    $self->authenticate($username, $password);
    
    $self->stash('mongo-session')->data(cred => { username => $username, password => $password });
    
    my $res = $self->stash('phaidra_auth_result');
        
    $self->render(json => { alerts => $res->{alerts}} , status => $res->{status}) ;    
}

1;
