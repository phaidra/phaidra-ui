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
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/object/$pid/uwmetadata");	
	$url->query({mfv => $self->app->config->{phaidra}->{metadata_format_version}});
	
	my $token = $self->load_token;
	
	# we have to use the useragent from the controller, otherwise the async call does not work
	# (probably needs ioloop etc)
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
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/object/$pid/uwmetadata");	
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
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/uwmetadata/tree");	
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
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/uwmetadata/languages");		
		
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
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/help/tooltip");	
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
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/directory/get_org_units");	
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
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/directory/get_study");	
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
	$url->host($self->app->config->{phaidra}->{apibaseurl});
	$url->path("/directory/get_study_name");	
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



1;
