package PhaidraUI::Model::Object;

use strict;
use warnings;
use v5.10;
use base qw/Mojo::Base/;
use Mojo::JSON qw(encode_json decode_json);


sub get_owner {
    
    my $self = shift;
    my $c = shift;
    my $pid = shift;
    my $owner;

    $c->app->log->debug("get_owner pid:".$c->app->dumper($pid));
    
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
  		$c->app->log->debug("get_owner result:".$c->app->dumper($r->json->{result}));
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


sub get_geo {
	
	my $self = shift;
	my $c = shift;
	my $pid = shift;

	
	$c->app->log->debug("get_geo pid:".$c->app->dumper($pid));
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$c->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/object/$pid/geo");
	}else{
		$url->path("/object/$pid/geo");
	}
	#$url->query({mfv => $self->app->config->{phaidra}->{metadata_format_version}});	
	my $geo;
	#my $ ua = Mojo::UserAgent->new;
  	my $get = $c->ua->get($url);  	
  	if (my $r = $get->success) {
  		#my @res = $r->json;
  		$geo = $r->json;
  		$c->app->log->debug("get_geo result:".$c->app->dumper($geo));
  	}
	else {
	      my ($err, $code) = $get->error;
	      $c->app->log->error("Cannot get geo data. Errorcode: $code, Error:".$c->app->dumper($err));
	}

        return $geo;

}


#delete it
sub post_geo {
	my $self = shift;
	my $c = shift;
	my $pid = shift;
	my $geo = shift;
	
	
	
	
	
	
        $c->app->log->debug("post_geo pid:".$c->app->dumper($pid));
        $c->app->log->debug("post_geo geo:".$c->app->dumper($geo));
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$c->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/object/$pid/metadata");
	}else{
		$url->path("/object/$pid/metadata");
	}

	#$url->query({mfv => $c->app->config->{phaidra}->{metadata_format_version}});
	$geo = encode_json($geo);
	my $token = $c->load_token;
	#my $ua = Mojo::UserAgent->new;
	
	
	
	
	
	
=head1		
	#my $value = $ua->get('https://sri:s3cret@example.com/test.json')->res->json;
	
	my $tx = $c->ua->post('https://services.phaidra-sandbox.univie.ac.at/api/object/o:71747/metadata' => {$c->app->config->{authentication}->{token_header} => $token} => form => {metadata => $geo});
        if (my $res = $tx->success) { 
                   say $res->body;
                   $c->app->log->debug("save_object_geo success:", $res->body);
        }
        else {
            my $err = $tx->error;
            die "$err->{code} response: $err->{message}" if $err->{code};
            die "Connection error: $err->{message}";
        }

	
	
	
	
=cut	
	
	

	
	
	

  	$c->ua->post($url => {$c->app->config->{authentication}->{token_header} => $token},
  		form => {metadata => $geo}, #mf ... TODO !!!
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	                $c->app->log->debug("save_object_geo xxx:");
		  	if (my $res = $tx->success) {
		  		$c->render(json => $res->json, status => 200 );
		  		$c->app->log->debug("save_object_geo success345:".$c->app->dumper($res->json));
		  	}else {
			 	$c->app->log->debug("save_object_geo fail1:");
			 	my ($err, $code) = $tx->error;
			 	$c->app->log->debug("save_object_geo err:",$c->app->dumper($err),"code:", $code);
			 	if(exists($tx->res->json->{alerts})) {
			 		$c->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$c->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			 	
			}		
  		}
  	);
  	
	
  	
}


1;
__END__
