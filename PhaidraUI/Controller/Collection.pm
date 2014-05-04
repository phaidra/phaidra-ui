package PhaidraUI::Controller::Collection;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';

sub view {
    my $self = shift;  	 

	my $pid = $self->stash('pid');

	my $owner;
	
	# get the owner from triplestore
	my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/search/triples");
	}else{
		$url->path("/search/triples");
	}
	$url->query({q => "<info:fedora/$pid> <info:fedora/fedora-system:def/model#ownerId> *"});
	
	my $ua = Mojo::UserAgent->new;
	
  	my $get = $ua->get($url);  	
  	if (my $r = $get->success) {
  		my @res = $r->json->{result};
  		# result -> first triple -> object
  		$owner = $res[0][0][2];  
  		$owner = substr($owner, 1, -1);
  	}
	else {
	  my ($err, $code) = $get->error;
	  $self->app->log->error("Cannot get collection owner");
	}	

	my $init_data = { current_user => $self->current_user, pid => $pid, owner => $owner };
    $self->stash(init_data => encode_json($init_data));
    $self->stash(init_data_perl => $init_data);
    
	$self->render('objects/members');
}

sub members {
	
	
	
}

1;
