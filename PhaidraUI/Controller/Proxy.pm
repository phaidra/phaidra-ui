package PhaidraUI::Controller::Proxy;

use strict;
use warnings;
use v5.10;
use base 'Mojolicious::Controller';

use Data::Dumper;
$Data::Dumper::Indent= 1; 


sub get_object_uwmetadata {
	
	my $self = shift;  	
	my $pid = $self->stash('pid');
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/object/$pid/uwmetadata");
	}else{
		$url->path("/object/$pid/uwmetadata");
	}
	$url->query({mfv => $self->app->config->{phaidra}->{metadata_format_version}});
	
	my $token = $self->load_token;	
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub { 	
  		my ($ua, $tx) = @_;

	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  		$self->app->log->debug('get_object_uwmetadata', $self->app->dumper($res->json));	
	  	}else {
		 	my ($err, $code) = $tx->error;
		 	if($tx->res->json){	  
			  	if(exists($tx->res->json->{alerts})) {
				 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
				 }else{
				  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
				 }
		 	}
		}
		
  	});

}

sub search {
    my $self = shift;  	     
    
    my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/search");
	}else{
		$url->path("/search");
	}
	
	my %params;
	$params{q} = $self->param('q');
	if(defined($self->param('from'))){
		$params{from} = $self->param('from');
	}
	if(defined($self->param('limit'))){
		$params{limit} = $self->param('limit');
	}
	if(defined($self->param('sort'))){
		$params{'sort'} = $self->param('sort');
	}
	if(defined($self->param('reverse'))){
		$params{'reverse'} = $self->param('reverse');
	}
	if(defined($self->param('fields'))){	
		my @fields = $self->param('fields');	
		$params{'fields'} = \@fields;
	}
    $url->query(\%params);
    
    #$self->app->log->debug($self->app->dumper(\%params));		

	my $token = $self->load_token;
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub { 	
  		my ($ua, $tx) = @_;

	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;
		 	if($tx->res->json){	  
			  	if(exists($tx->res->json->{alerts})) {
				 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
				 }else{
				  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
				 }
		 	}
		}
		
  	});	
    
}

sub get_related_objects {
    my $self = shift;  	     
    
    my $pid = $self->stash('pid');
    my $relation = $self->param('relation');
    
    my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/object/$pid/related");
	}else{
		$url->path("/object/$pid/related");
	}
	
	my %params;
	$params{relation} = $self->param('relation');
	if(defined($self->param('from'))){
		$params{from} = $self->param('from');
	}
	if(defined($self->param('limit'))){
		$params{limit} = $self->param('limit');
	}	
	if(defined($self->param('fields'))){	
		my @fields = $self->param('fields');	
		$params{'fields'} = \@fields;
	}
    $url->query(\%params);
    
    #$self->app->log->debug($self->app->dumper(\%params));		

	my $token = $self->load_token;
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub { 	
  		my ($ua, $tx) = @_;

	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;
		 	if($tx->res->json){	  
			  	if(exists($tx->res->json->{alerts})) {
				 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
				 }else{
				  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
				 }
		 	}
		}
		
  	});	
    
}

sub search_owner {
    my $self = shift;  	 
    
    my $username = defined($self->stash('username')) ? $self->stash('username') : $self->current_user->{username} ;
    
    my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/search/owner/$username");
	}else{
		$url->path("/search/owner/$username");
	}
		    
	my %params;
	if(defined($self->param('from'))){
		$params{from} = $self->param('from');
	}
	if(defined($self->param('limit'))){
		$params{limit} = $self->param('limit');
	}
	if(defined($self->param('sort'))){
		$params{'sort'} = $self->param('sort');
	}
	if(defined($self->param('reverse'))){
		$params{'reverse'} = $self->param('reverse');
	}
    $url->query(\%params);
	
	my $token = $self->load_token;
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub { 	
  		my ($ua, $tx) = @_;

	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;
		 	if($tx->res->json){	  
			  	if(exists($tx->res->json->{alerts})) {
				 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
				 }else{
				  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
				  	
				 }
		 	}
		}
		
  	});	
    
}

sub save_object_uwmetadata {
	
	my $self = shift;  	
	my $pid = $self->stash('pid');
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/object/$pid/uwmetadata");
	}else{
		$url->path("/object/$pid/uwmetadata");
	}
		
	$url->query({mfv => $self->app->config->{phaidra}->{metadata_format_version}});
	
	my $token = $self->load_token;
	
  	$self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		json => $self->req->json,
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	
		  	if (my $res = $tx->success) {
		  		$self->render(json => $res->json, status => 200 );
		  	}else {
			 	my ($err, $code) = $tx->error;	 
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			}		
  		}
  	);

}


sub get_uwmetadata_tree {
	my $self = shift;  
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');	
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/uwmetadata/tree");
	}else{
		$url->path("/uwmetadata/tree");
	}
	$url->query({mfv => $self->app->config->{phaidra}->{metadata_format_version}});
		
  	$self->ua->get($url => sub { 	
  		my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;	  
		  	if(exists($tx->res->json->{alerts})) {
			 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 }else{
			  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 }
		}	
  	});
}

sub get_uwmetadata_languages {
	my $self = shift;  
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/uwmetadata/languages");
	}else{
		$url->path("/uwmetadata/languages");
	}
  	$self->ua->get($url => sub { 	
  		my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;	  
		  	if(exists($tx->res->json->{alerts})) {
			 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 }else{
			  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 }
		}
		
  	});
}
	
sub get_help_tooltip {
	my $self = shift;  
	
	my $id = $self->param('id');
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');		
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/help/tooltip");
	}else{
		$url->path("/help/tooltip");
	}
	
	$url->query({id => $id});
		
  	$self->ua->get($url => sub { 	
  		my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;	  
		  	if(exists($tx->res->json->{alerts})) {
			 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 }else{
			  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 }
		}
		
  	});
}		
	
sub get_directory_get_org_units {
	my $self = shift;  
	
	my $parent_id = $self->param('parent_id');
	my $values_namespace = $self->param('values_namespace');
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');	
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/directory/get_org_units");
	}else{
		$url->path("/directory/get_org_units");
	}
	$url->query({parent_id => $parent_id, values_namespace => $values_namespace});
		
  	$self->ua->get($url => sub { 	
  		my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;	  
		  	if(exists($tx->res->json->{alerts})) {
			 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 }else{
			  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 }
		}		
  	});
}

sub get_directory_get_study {
	my $self = shift;  
	
	my $spl = $self->param('spl');
	my @ids = $self->param('ids');
	my $values_namespace = $self->param('values_namespace');
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');	
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/directory/get_study");
	}else{
		$url->path("/directory/get_study");
	}
	
	$url->query({spl => $spl, ids => \@ids, values_namespace => $values_namespace});
		
  	$self->ua->get($url => sub { 	
  		my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;	  
		  	if(exists($tx->res->json->{alerts})) {
			 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 }else{
			  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 }
		}
		
  	});
	
}
sub get_directory_get_study_name {
	my $self = shift;  
	
	my $spl = $self->param('spl');
	my @ids = $self->param('ids');
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');	
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/directory/get_study_name");
	}else{
		$url->path("/directory/get_study_name");
	}
	$url->query({spl => $spl, ids => @ids});
		
  	$self->ua->get($url => sub { 	
  		my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
		 	my ($err, $code) = $tx->error;	  
		  	if(exists($tx->res->json->{alerts})) {
			 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 }else{
			  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 }
		}
		
  	});
}  	

sub collection_create {
	
	my $self = shift;  				
	
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/collection/create");
	}else{
		$url->path("/collection/create");
	}
	
	my $token = $self->load_token;

  	$self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		json => $self->req->json,
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	
		  	if (my $res = $tx->success) {
		  		$self->render(json => $res->json, status => 200 );
		  	}else {
			 	my ($err, $code) = $tx->error;	 
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			}		
  		}
  	);

}

sub collection_order {
	
	my $self = shift;  				
	
	my $res = { alerts => [], status => 200 };
	
	my $pid = $self->stash('pid');
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/collection/$pid/members/order");
	}else{
		$url->path("/collection/$pid/members/order");
	}
	
	my $token = $self->load_token;

  	$self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		json => $self->req->json,
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	
		  	if (my $res = $tx->success) {
		  		$self->render(json => $res->json, status => 200 );
		  	}else {
			 	my ($err, $code) = $tx->error;	 
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			}		
  		}
  	);

}

sub collection_member_order {
	
	my $self = shift;  			 	
	
	my $res = { alerts => [], status => 200 };
	
	my $pid = $self->stash('pid');
	my $itempid = $self->stash('itempid');
	my $position = $self->stash('position');
	if(defined($self->param('value'))){
		$position = $self->param('value');
	}
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/collection/$pid/members/$itempid/order/$position");
	}else{
		$url->path("/collection/$pid/members/$itempid/order/$position");
	}
	
	my $token = $self->load_token;

  	$self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		json => $self->req->json,
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	
		  	if (my $res = $tx->success) {
		  		$self->render(json => $res->json, status => 200 );
		  	}else {
			 	my ($err, $code) = $tx->error;	 
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			}		
  		}
  	);

}
 
sub get_object_tripl{
   
        my $self = shift;
       
        my $res = { alerts => [], status => 200 };
        my $q;
        #my $limit;
     
        if(defined($self->param('q'))){
		$q = $self->param('q');
        } 
        #if(defined($self->param('limit'))){
	#	$limit = $self->param('limit');
        #}
        $q = '<info:fedora/'.$q.'> <http://purl.org/dc/elements/1.1/title> *';
     
     	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/search/triples");
		#$self->app->log->info("get_object_tripl path".$base[1]."/search/triples ") ;
	}else{
		# $url->path("/collection/$pid/members/$itempid/order/$position");
		#$self->app->log->info("get_object_tripl2 path /search/triples ") ;
		$url->path("/search/triples");
	}
        
        #$url->query({'q' => $q, 'limit' => $limit});
        $url->query({'q' => $q});
      	my $token = $self->load_token;
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub { 	
  		my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  		#$self->app->log->debug("get_object_tripl success".$self->app->dumper($res->json));
	  	}else{
		 	my ($err, $code) = $tx->error;
		 	$self->app->log->info("get_object_tripl error") ;
		 	if($tx->res->json){	  
			  	 if(exists($tx->res->json->{alerts})){
				 	$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
				 }else{
				  	$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
				 }
		        }
		}	
  	});  	
}


1;
