package PhaidraUI::Controller::Frontend;

use strict;
use warnings;
use v5.10;
use Mango 0.24;
use Mojo::JSON qw(encode_json decode_json);
use base 'Mojolicious::Controller';
use PhaidraUI::Model::Cache;
use utf8;
use URI::Escape;

sub home {
    my $self = shift;  	 
    
    unless($self->flash('redirect_to')){
    	# if no redirect was set, reload the current url
    	$self->flash({redirect_to => $self->req->url});
    }
    
    my $init_data = { current_user => $self->current_user };
    $self->stash(init_data => encode_json($init_data));  

    $self->render('home');	
}

sub post_selection {
	my $self = shift;  	 
	
	my $res = { alerts => [], status => 200 };
	
	my $username = $self->current_user->{username};
	
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save selection, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
	
	my $payload = $self->req->json;
	my $selection = $payload->{selection};		
	
	$self->mango->db->collection('selections')->update({username => $username}, { username => $username, selection => $selection }, { upsert => 1 });
	
	$self->render(json => { alerts => [] }, status => 200);
	
}

sub get_selection {
	my $self = shift;  	 
	
	my $username = $self->current_user->{username};
	
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot load selection, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}	
		
	my $res = $self->mango->db->collection('selections')->find_one({username => $username});

	#$self->app->log->info("frontend get_selection: ".$self->app->dumper($res->{selection}));
	
	$self->render(json => { selection => $res->{selection} }, status => 200);	
}

sub get_username {
	my $self = shift;   	 
	  
	
	my $username = $self->current_user->{username};
	
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot load username, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}	
		
	my $res = $self->mango->db->collection('selections')->find_one({username => $username});

	$self->render(json => { username => $res->{username} }, status => 200);	
}

sub get_users {

        my $self = shift;
       
        my $q = $self->param('query');
      	
      	my $payload = $self->req->json;
	my $selection = $payload->{query};	
      	
      	
      	$self->app->log->debug("get_users12321:".$q);
	my $res = { alerts => [], status => 200 };
	
	my $token = $self->load_token;
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){  
		$url->path($base[1]."/directory/user/search?q=$q");
	}else{
		$url->path("/directory/user/search?q=$q");
	}
	$url = uri_unescape($url);
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub {
  	      my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
	  	        $self->app->log->error('get_users: ', $self->app->dumper($tx->error)) if defined $tx->error;	
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


sub get_faculty_id_from_department {

        my $self = shift;
       
        my $id = $self->param('id');
        
        
        $self->app->log->debug("get_faculty_id_from_department id:".$self->param('id'));

        
        my $token = $self->load_token;
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	#https://services.phaidra-sandbox.univie.ac.at/api/directory/get_parent_org_unit_id?child_id=A311 
	if(exists($base[1])){  
		$url->path($base[1]."/directory/get_parent_org_unit_id?child_id=$id");
	}else{
		$url->path("/directory/get_parent_org_unit_id?child_id=$id");
	}
	$url = uri_unescape($url);
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub {
  	      my ($ua, $tx) = @_;
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  	}else {
	  	        $self->app->log->error('get_faculty_id_from_department: ', $self->app->dumper($tx->error)) if defined $tx->error;	
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








1;
