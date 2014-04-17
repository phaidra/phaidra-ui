package PhaidraUI::Controller::Authentication;

use strict;
use warnings;
use v5.10;
use Mojo::ByteStream qw(b);
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';

# bridge
sub check {	
	my $self = shift;
	
	unless($self->is_user_authenticated){
		$self->flash({opensignin => 1});
		$self->flash({redirect_to => $self->req->url});
		$self->redirect_to('/') and return 0;	
	}

	my $init_data = { current_user => $self->current_user };
    $self->stash(init_data => encode_json($init_data));   
    return 1;    
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
    
    my $res = $self->stash('phaidra_auth_result');
    # set token cookie, we are currently not using this, but if js would like to access api directly it needs the token
    $self->cookie($self->app->config->{authentication}->{token_cookie} => $res->{token});
    
    $self->app->log->info("Current user: ".$self->app->dumper($self->current_user));
    $self->render(json => { alerts => $res->{alerts}} , status => $res->{status});    
}

sub signout {
	my $self = shift;
	
	my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/signout") ;
	}else{
		$url->path("/signout") ;
	}
			
	my $token = $self->load_token;
				
	my $tx = $self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token}); 
		
	if (my $res = $tx->success) {			  		
		$self->app->log->info("User ".$self->current_user->{username}." successfuly signed out");
		$self->stash({phaidra_auth_result => { alerts => [{ type => 'success', msg => "You have been signed out" }], stauts  =>  200 }});
	}else {
		my ($err, $code) = $tx->error;
			 	
		$self->app->log->info("Sign out failed for user ".$self->current_user->{username});
	 	if($tx->res->json){	  
		  	if(exists($tx->res->json->{alerts})) {
		  		$self->app->log->error($self->app->dumper($tx->res->json->{alerts}));
		  		$self->stash({phaidra_auth_result => { alerts => $tx->res->json->{alerts}, stauts  =>  $code ? $code : 500 }});						 	
			}else{
				$self->app->log->error($err);
			 	$self->stash({phaidra_auth_result => { alerts => [{ type => 'danger', msg => $err }], stauts  =>  $code ? $code : 500 }});						  	
			}
		}		
	}

	$self->logout();

	$self->redirect_to('/');
}


1;
