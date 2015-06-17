package PhaidraUI::Controller::Frontend;

use strict;
use warnings;
use v5.10;
use Mango 0.24;
use Mojo::JSON qw(encode_json decode_json);
use base 'Mojolicious::Controller';
use PhaidraUI::Model::Cache;
use utf8;

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
# move to classification or object controler TODO
sub toggle_classification {
	
	my $self = shift;

	my $res = { alerts => [], status => 200 };

	my $username = $self->current_user->{username};

	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot add classification, current user is missing (the session might be expired)." }] }, status => 500);
		return;
	}

	my $payload = $self->req->json;
	my $uri = $payload->{uri};

	my @uri = ($uri);
	my $cursor = $self->mango->db->collection('user.classifications')->find({ username => $username, classifications => {'$all' => \@uri } });
	my $hits = $cursor->count;

	if($hits > 0){
		$self->mango->db->collection('user.classifications')->update({username => $username}, { '$set' => {username => $username}, '$pullAll' => { classifications => \@uri } });
	}else{
		$self->mango->db->collection('user.classifications')->update({username => $username}, { '$set' => {username => $username}, '$addToSet' => { classifications => $uri } }, {upsert => 1});
	}

	$self->render(json => { alerts => [] }, status => 200);

}


sub get_classifications {
	my $self = shift;

	my $username = $self->current_user->{username};

	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot load classifications, current user is missing (the session might be expired)." }] }, status => 500);
		return;
	}
	
	my $cache_model = PhaidraUI::Model::Cache->new;	

	my @clss;
	# project defined classifications
	my $r = $self->mango->db->collection('project.settings')->find_one({project => $self->current_user->{project}});
	foreach my $uri (@{$r->{settings}->{classifications}}){
		my $class = $cache_model->resolve_class_uri($self, $uri);
		$class->{type} = 'project';
		push @clss, $class;
	}

	# user defined classification
	$r = $self->mango->db->collection('user.classifications')->find_one({username => $username});
	foreach my $uri (@{$r->{classifications}}){
		my $class = $cache_model->resolve_class_uri($self, $uri);
		$class->{type} = 'user';
		push @clss, $class;
	}
	#$self->app->log->debug($self->app->dumper(\@clss));
	$self->render(json => { classifications => \@clss }, status => 200);
}


=head1

sub get_uwmeta_classifications {
	my $self = shift;
	
	my $payload = $self->req->json;
        my $uwmeta = $payload->{'uwmeta'};  
        #$self->app->log->info("uwmeta553".$self->app->dumper($uwmeta));
        utf8::encode($uwmeta);
        #$self->app->log->info("uwmeta554".$self->app->dumper($uwmeta));
        $uwmeta = decode_json($uwmeta);
        #$self->app->log->info("uwmeta555".$self->app->dumper($uwmeta));
        
        unless(defined($uwmeta) || $uwmeta eq ''){
		$self->render(json => { classifications => [] }, status => 200);
		return;
	}

	if(scalar @$uwmeta < 1){
		$self->render(json => { classifications => [] }, status => 200);
		return;
	}

	my @classes;
	foreach my $n (@$uwmeta){
		if($n->{xmlname} eq 'classification'){
		        #$self->app->log->info("uwmeta55n".$self->app->dumper($n));
			my $authuri = '';
			my $valueuri = '';
			foreach my $a (@{$n->{children}}){
				 $self->app->log->info("children55n".$self->app->dumper($a));
				#if($a->{xmlname} eq 'authorityURI'){
				#	$authuri = $a->{ui_value} if defined $a->{ui_value};
				#}
				#if($a->{xmlname} eq 'valueURI'){
				#	$valueuri = $a->{ui_value} if defined $a->{ui_value};
				#}
				$authuri = $a->{ui_value} if defined $a->{ui_value};
				$valueuri = $a->{xmlns} if defined $a->{xmlns};
				$self->app->log->info("authuri55".$self->app->dumper($authuri));
				$self->app->log->info("valueuri55".$self->app->dumper($valueuri));
			}
			if($authuri eq 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification' && $valueuri ne ''){
				push @classes, $valueuri;
			}
		}
	}

	my $cache_model = PhaidraUI::Model::Cache->new;

	my @clss;
	foreach my $uri (@classes){
		my $class = $cache_model->resolve_class_uri($self, $uri);
		push @clss, $class;
	}
        $self->app->log->info("clss5555:".$self->app->dumper(@clss));
        
	$self->render(json => { classifications => \@clss }, status => 200);
}

=cut


sub get_mods_classifications {
	my $self = shift;
	

	

	my $payload = $self->req->json;
        my $mods = $payload->{'mods'};  
        $mods = decode_json($mods);
        #$self->app->log->info("mods555".$self->app->dumper($mods));
        
        unless(defined($mods) || $mods eq ''){
		$self->render(json => { classifications => [] }, status => 200);
		return;
	}

	if(scalar @$mods < 1){
		$self->render(json => { classifications => [] }, status => 200);
		return;
	}

	my @classes;
	foreach my $n (@$mods){
		if($n->{xmlname} eq 'classification'){
			my $authuri = '';
			my $valueuri = '';
			foreach my $a (@{$n->{attributes}}){
				if($a->{xmlname} eq 'authorityURI'){
					$authuri = $a->{ui_value} if defined $a->{ui_value};
				}
				if($a->{xmlname} eq 'valueURI'){
					$valueuri = $a->{ui_value} if defined $a->{ui_value};
				}
			}
			if($authuri eq 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification' && $valueuri ne ''){
				push @classes, $valueuri;
			}
		}
	}

	my $cache_model = PhaidraUI::Model::Cache->new;

	my @clss;
	foreach my $uri (@classes){
		my $class = $cache_model->resolve_class_uri($self, $uri);
		push @clss, $class;
	}

	$self->render(json => { classifications => \@clss }, status => 200);
}



1;
