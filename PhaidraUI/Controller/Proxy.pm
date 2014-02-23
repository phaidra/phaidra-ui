package PhaidraUI::Controller::Proxy;

use strict;
use warnings;
use v5.10;
use base 'Mojolicious::Controller';
use Sereal::Decoder qw(decode_sereal);

sub get_object_uwmetadata {
	
	my $self = shift;  	
	my $pid = $self->stash('pid');
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my $ba = $self->load_ba;	
	$url->userinfo($ba->{username}.":".$ba->{password});
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/object/$pid/uwmetadata");	
	$url->query({mfv => $self->app->config->{phaidra}->{metadata_format_version}});
		
  	$self->ua->get($url => sub { 	
  		my ($ua, $tx) = @_;

	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;	  
		  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
		}
		
  	});

}

1;
