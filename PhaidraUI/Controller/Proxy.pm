package PhaidraUI::Controller::Proxy;

use strict;
use warnings;
use v5.10;
use base 'Mojolicious::Controller';

sub get_object_uwmetadata {
	
	my $self = shift;  	
	my $pid = $self->stash('pid');
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	# FIXME
	$url->userinfo($self->current_user->{username}.":".$self->current_user->{password});
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/object/$pid/uwmetadata");	
	$url->query({mfv => $self->app->config->{phaidra}->{metadata_format_version}});
	
	my $ua = Mojo::UserAgent->new;
	
  	my $put = $ua->get($url);  	
  	if (my $r = $put->success) {  
  		$self->render(json => $r->body, status => 200 );
  	}
	else {
	  my ($err, $code) = $put->error;	  
	  $self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
	}

}


1;
