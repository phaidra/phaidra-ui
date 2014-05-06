package PhaidraUI::Model::Object;

use strict;
use warnings;
use v5.10;
use base qw/Mojo::Base/;

sub get_owner {
	my $self = shift;
    my $c = shift;
    my $pid = shift;
    
    my $owner;

	# get the owner from triplestore
	my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$c->app->config->{phaidra}->{apibaseurl});
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
	  $c->app->log->error("Cannot get collection owner (errorcode: $code, error: $err)");
	}

    return $owner;	
}


1;
__END__
