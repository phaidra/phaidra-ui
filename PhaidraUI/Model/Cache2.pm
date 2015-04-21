package PhaidraBagger::Model::Cache;

use strict;
use warnings;
use v5.10;
use Mojo::Util qw(slurp);
use Mojo::JSON qw(encode_json decode_json);
use base qw/Mojo::Base/;


sub test{
   my $self = shift;
   my $c    = shift;  
   $c->app->log->debug("aaaaaaaaaaaaaaaaaaaaaaaaaaaa");
   #die('testing!!!');
}
#used!
sub get_terms_label {
	my $self = shift;
	my $c    = shift;   	
	my $uri  = shift;
	
	my $res = { alerts => [], status => 200 };
	
	my $cachekey = 'labels_'.$uri;
	my $cacheval = $c->app->chi->get($cachekey);
	  		
	if($cacheval){   			  	
		#$c->app->log->debug("[cache hit] $cachekey");
		$res->{labels} = $cacheval;
		return $res;			
	}else{
		
		$c->app->log->debug("[cache miss] $cachekey");
	
		my $url = Mojo::URL->new;
		$url->scheme('https');		
		my @base = split('/',$c->app->config->{phaidra}->{apibaseurl});
		$url->host($base[0]);
		if(exists($base[1])){
			$url->path($base[1]."/terms/label");
		}else{
			$url->path("/terms/label");
		}
		
		$url->query({uri => $uri});
		
  		my $tx = $c->ua->get($url);
  		
  		if (my $r = $tx->success) {
  			my $cacheval = $tx->res->json->{labels};  		
	    	$c->app->chi->set($cachekey, $cacheval, '1 day');    
	    	# serialization check
	    	$cacheval = $c->app->chi->get($cachekey);
  			$res->{labels} = $cacheval;  
  			return $res;
  		} else {
			my ($err, $code) = $tx->error;
			if(exists($tx->res->json->{alerts})) {
				$res->{alerts} = $tx->res->json->{alerts};
				$res->{status} = $code ? $code : 500;				
			}else{
				$res->{alerts} = [{ type => 'danger', msg => $err }];
				$res->{status} = $code ? $code : 500;	
			}
			return $res;
		}
	}
	
}	

sub get_mods_tree {
    my $self = shift;
    my $c = shift;   	

	my $res = { alerts => [], status => 200 };

	my $cachekey = 'mods_tree';
	my $cacheval = $c->app->chi->get($cachekey);
	if($cacheval){
		$c->app->log->debug("[cache hit] $cachekey");
		return $cacheval;
	}

	if($c->app->config->{phaidra}->{local_mods_tree}){

		$c->app->log->debug("Reading mods tree from file: ".$c->app->config->{phaidra}->{local_mods_tree});

		# read metadata tree	    
	    my $bytes = slurp $c->app->config->{phaidra}->{local_mods_tree};
		unless(defined($bytes)){
		   	push @{$res->{alerts}}, "Error reading local_mods_tree";
		   	$res->{status} = 500;
	    	return $res;
		}	    

		my $metadata = decode_json($bytes);
 		$res->{tree} = $metadata->{tree};
 		$res->{vocabularies} = $metadata->{vocabularies};
 		$res->{vocabularies_mapping} = $metadata->{vocabularies_mapping};
 		$res->{languages} = $metadata->{languages};

 		$cacheval = $res;
 		$c->app->chi->set($cachekey, $cacheval, '1 day');
	    # serialization check
	    $cacheval = $c->app->chi->get($cachekey);

 		return $res;
	}

	$c->app->log->debug("Reading mods tree from api");

	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$c->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/mods/tree");
	}else{
		$url->path("/mods/tree");
	}

	 my $tx = $self->ua->get($url);

		  	if (my $rs = $tx->success) {

				$res->{languages} = $rs->json->{languages};
				$res->{tree} = $rs->json->{tree};
				foreach my $a (@{$rs->json->{alerts}}){
					push @{$res->{alerts}}, $a;	
				}

				$cacheval = $res;
		 		$c->app->chi->set($cachekey, $cacheval, '1 day');
			    # serialization check
			    $cacheval = $c->app->chi->get($cachekey);
		  		return $res;

		  	}else {
			 	my ($err, $code) = $tx->error;
			  	if(exists($tx->res->json->{alerts})) {
			  		foreach my $a (@{$tx->res->json->{alerts}}){
						push @{$res->{alerts}}, $a;	
					}
			  		$res->{status} = $code ? $code : 500;
			  		return $res;

				 }else{
				 	push @{$res->{alerts}}, $err;
				  	$res->{status} = $code ? $code : 500;
			  		return $res;
				 }
			}
}


sub get_uwmetadata_tree {
     my $self = shift;
     my $c = shift;

	my $res = { alerts => [], status => 200 };

	my $cachekey = 'uwmetadata_tree';
	my $cacheval = $c->app->chi->get($cachekey);
	if($cacheval){
		$c->app->log->debug("[cache hit] $cachekey");
		return $cacheval;
	}

	if($c->app->config->{phaidra}->{local_uwmetadata_tree}){

		$c->app->log->debug("Reading uwmetadata tree from file");

		# read metadata tree	    
	    my $bytes = slurp $c->app->config->{phaidra}->{local_uwmetadata_tree};
		unless(defined($bytes)){
		   	push @{$res->{alerts}}, "Error reading local_uwmetadata_tree";
		   	$res->{status} = 500;
	    	return $res;
		}	    

		my $metadata = decode_json($bytes);
 		$res->{tree} = $metadata->{tree};
 		$res->{languages} = $metadata->{languages};

 		$cacheval = $res;
 		$c->app->chi->set($cachekey, $cacheval, '1 day');
	    # serialization check
	    $cacheval = $c->app->chi->get($cachekey);

 		return $res;
	}

	$c->app->log->debug("Reading uwmetadata tree from api");

	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$c->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/uwmetadata/tree");
	}else{
		$url->path("/uwmetadata/tree");
	}
	$url->query({mfv => $c->app->config->{phaidra}->{metadata_format_version}});

	 my $tx = $self->ua->get($url);

		  	if (my $rs = $tx->success) {

				$res->{languages} = $rs->json->{languages};
				$res->{tree} = $rs->json->{tree};
				foreach my $a (@{$rs->json->{alerts}}){
					push @{$res->{alerts}}, $a;	
				}


				$cacheval = $res;
		 		$c->app->chi->set($cachekey, $cacheval, '1 day');
			    # serialization check
			    $cacheval = $c->app->chi->get($cachekey);
		  		return $res;

		  	}else {
			 	my ($err, $code) = $tx->error;
			  	if(exists($tx->res->json->{alerts})) {
			  		foreach my $a (@{$tx->res->json->{alerts}}){
						push @{$res->{alerts}}, $a;	
					}
			  		$res->{status} = $code ? $code : 500;
			  		return $res;

				 }else{
				 	push @{$res->{alerts}}, $err;
				  	$res->{status} = $code ? $code : 500;
			  		return $res;
				 }
			}
}

#used!
sub resolve_class_uri {
		my $self = shift;
		my $c = shift;
		my $uri = shift;

		my $class;

		# get taxon labels
		my $res = $self->get_terms_label($c, $uri);
		if($res->{status} eq 200){
			$class = $res->{labels};
		}else{
			#$c->app->log->error("Cannot get taxon labels: ".$self->app->dumper($res));
			$c->app->log->error("Cannot get taxon labels: ");
		}

		# get classification labels
		my $ns = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification';
		$uri =~ m/($ns\/cls_\d+)\//;
		$res = $self->get_terms_label($c, $1);
		if($res->{status} eq 200){
			$class->{classification} = $res->{labels};
		}else{
			#$c->app->log->error("Cannot get classification labels: ".$c->app->dumper($res));
			$c->app->log->error("Cannot get classification labels: ");
		}
		$class->{uri} = $uri;

		return $class;
}


1;
__END__
