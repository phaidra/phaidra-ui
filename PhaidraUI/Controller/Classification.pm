package PhaidraUI::Controller::Classification;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json decode_json);
#use Mojo::Util;
use base 'Mojolicious::Controller';
use PhaidraUI;
use PhaidraUI::Model::Cache;
#use PhaidraUI::Model::Session::Store::Mongo;

use Data::Dumper;



sub toggle_classif {
	
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
       $self->app->log->info("toggle_classification");
	$self->render(json => { alerts => [] }, status => 200);

}

sub get_mods_classif {
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

sub get_classif_from_uris{

        my $self = shift;
    
        my $valueURIs = $self->param('valueuris');
        $valueURIs  = decode_json $valueURIs;
    
    	my $cache_model = PhaidraUI::Model::Cache->new;	

	my @clss;
	foreach my $uri (@$valueURIs){
		my $class = $cache_model->resolve_class_uri($self, $uri);
		push @clss, $class;
	}
	$self->render(json => { classifications => \@clss }, status => 200);
}

sub get_user_classif {
	my $self = shift;

	my $username = $self->current_user->{username};

	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot load classifications, current user is missing (the session might be expired)." }] }, status => 500);
		return;
	}
	
	my $cache_model = PhaidraUI::Model::Cache->new;	

	my @clss;
	# project defined classifications
	#my $r = $self->mango->db->collection('project.settings')->find_one({project => $self->current_user->{project}});
	#foreach my $uri (@{$r->{settings}->{classifications}}){
	#	my $class = $cache_model->resolve_class_uri($self, $uri);
	#	$class->{type} = 'project';
	#	push @clss, $class;
	#}

	# user defined classification
	my $r = $self->mango->db->collection('user.classifications')->find_one({username => $username});
	foreach my $uri (@{$r->{classifications}}){
		my $class = $cache_model->resolve_class_uri($self, $uri);
		$class->{type} = 'user';
		push @clss, $class;
	}
	#$self->app->log->debug( 'get_classifications11122233'.$self->app->dumper(\@clss));
	$self->render(json => { classifications => \@clss }, status => 200);
}



1;