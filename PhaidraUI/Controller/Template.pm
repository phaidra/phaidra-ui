package PhaidraUI::Controller::Template;

use strict;
use warnings;
use v5.10;
use Mango::BSON ':bson';
use Mango::BSON::ObjectID;
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';
use PhaidraUI::Model::Mods;
use PhaidraUI::Model::Cache;


sub load {

	my $self = shift;
	my $tid = $self->stash('tid');

	$self->app->log->info("[".$self->current_user->{username}."] Loading template $tid");

	my $oid = Mango::BSON::ObjectID->new($tid);

	my $doc = $self->mango->db->collection('templates')->find_one({_id => $oid});

	unless(defined($doc)){
		$self->app->log->error("[".$self->current_user->{username}."] Error loading template ".$tid);
		$self->render(
			json => {
			uwmetadata => '',
			title => '',
			alerts => [{ type => 'danger', msg => "Template with id ".$tid." was not found" }]
			},
		status => 500);
		return;
	}
        #$self->app->log->info("reset_hide_rec uwmetadata11".$self->app->dumper($doc));
	my $geo; 
	if($doc->{geo}){
		$self->app->log->info("load geo");
                 
		$self->app->log->info("[".$self->current_user->{username}."] Loaded geo template ".$doc->{title}." [$tid]");
		$geo = $doc->{geo};
		
		#$self->render(
		#	json => {
		#		geo => $doc->{geo},
		#		title => $doc->{title},
		#	},
		#	status => 200
		#);
		#return;
	}
	if($doc->{uwmetadata}){
		$self->app->log->info("reset_hide_rec uwmetadata");
		
		$self->reset_hide_rec($doc->{uwmetadata});

		$self->app->log->info("[".$self->current_user->{username}."] Loaded uwmetadata template ".$doc->{title}." [$tid]");
		$self->render(
			json => {
				geo => $geo,
				uwmetadata => $doc->{uwmetadata},
				title => $doc->{title},
			},
			status => 200
		);
		return;
	}

	if($doc->{mods}){
		$self->app->log->info("reset_hide_rec mods");
		my $cache_model = PhaidraUI::Model::Cache->new;
		my $res = $cache_model->get_mods_tree($self);
		my $mods_tree = $res->{tree};
		my $mods_model = PhaidraUI::Model::Mods->new;
		$mods_model->mods_fill_tree($self, $doc->{mods}, $mods_tree);

		$self->app->log->info("[".$self->current_user->{username}."] Loaded mods template ".$doc->{title}." [$tid]");
		$self->render(
			json => {
				geo => $geo,
				mods => $mods_tree,
				vocabularies => $res->{vocabularies},
				vocabularies_mapping => $res->{vocabularies_mapping},
				languages => $res->{languages},
				title => $doc->{title},
			},
			status => 200
		);
		return;
	}

}

# everything in a template should be visible
sub reset_hide_rec {
	my $self = shift;
	my $children = shift;
  #$self->app->log->info("reset_hide_rec:".$self->app->dumper($children));
	foreach my $n (@{$children}){
		if($n->{hide}){
			$n->{hide} = 0;
		}
		my $children_size = defined($n->{children}) ? scalar (@{$n->{children}}) : 0;
		if($children_size > 0){
			$self->reset_hide_rec($n->{children});
		}
	}
}

sub load2 {
	
	my $self = shift;  	
	my $tid = $self->stash('tid');
	
	$self->app->log->info("[".$self->current_user->{username}."] Loading template $tid");
	
	my $oid = Mango::BSON::ObjectID->new($tid);
	
	$self->render_later;
	my $reply = $self->mango->db->collection('templates.uwmetadata')->find_one(
		{_id => $oid} => 	
			sub {
				    my ($reply, $error, $doc) = @_;
	
				    if ( $error ){
				    	$self->app->log->error("[".$self->current_user->{username}."] Error loading template ".$tid.":".$self->app->dumper($error));
						$self->render(
								json => { 
									uwmetadata => '', 
									title => '',
									alerts => [{ type => 'danger', msg => "Template with id ".$tid." was not found" }] 
								}, 
						status => 500);	
				    }
				    
				    $self->app->log->info("[".$self->current_user->{username}."] Loaded template ".$doc->{title}." [$tid]");
					$self->render(
							json => { 
								uwmetadata => $doc->{uwmetadata}, 
								title => $doc->{title},
								alerts => [{ type => 'success', msg => "Template ".$doc->{title}." loaded" }] 
							}, 
					status => 200);
				   
				}
	);
		
}


sub save {

	my $self = shift;
	my $tid = $self->stash('tid');

	$self->app->log->info("[".$self->current_user->{username}."] Saving template $tid");
        
        #$self->app->log->error("save mods".$self->app->dumper($self->req->json->{mods}));
        
        
	my $oid = Mango::BSON::ObjectID->new($tid);

	if($self->req->json->{geo}){
		$self->app->log->info("save geo:".$self->app->dumper($self->req->json->{geo}));
		my $reply = $self->mango->db->collection('templates')->update({_id => $oid},{ '$set' => {updated => time, geo => $self->req->json->{geo}} } );
	}
	if($self->req->json->{uwmetadata}){
		my $reply = $self->mango->db->collection('templates')->update({_id => $oid},{ '$set' => {updated => time, uwmetadata => $self->req->json->{uwmetadata}} } );
	}
	if($self->req->json->{mods}){

		my $mods_model = PhaidraUI::Model::Mods->new;
		my $mods = $mods_model->mods_strip_empty_nodes($self, $self->req->json->{mods});
		my $reply = $self->mango->db->collection('templates')->update({_id => $oid},{ '$set' => {updated => time, mods => $mods} } );
	}
	my ( $sec, $min, $hour, $day, $mon, $year ) = localtime();
        my $now = sprintf("%02d.%02d.%04d %02d:%02d:%02d",$day, $mon + 1, $year + 1900, $hour, $min, $sec);
	$self->render(json => { alerts => [{ type => 'success', msg => "Template saved" }], msg => "Saved at $now" }, status => 200);
}


sub delete {
	
	my $self = shift;  	
	my $tid = $self->stash('tid');
	
	$self->app->log->info("[".$self->current_user->{username}."] Removing template $tid");
	
	my $oid = Mango::BSON::ObjectID->new($tid);
	
	my $reply = $self->mango->db->collection('templates')->remove({_id => $oid});
		
	$self->render(json => { alerts => [] }, status => 200);
}









sub create {
	my $self = shift;

	my $res = { alerts => [], status => 200 };

	my $title = $self->req->json->{title};

	$self->app->log->info("[".$self->current_user->{username}."] Creating template ".$title);

	my $reply;
	if($self->req->json->{uwmetadata}){
		$self->app->log->info("[".$self->current_user->{username}."] saving uwmetadata");
		$reply = $self->mango->db->collection('templates')->insert({ title => $title, created => time, updated => time, project => $self->current_user->{project}, created_by => $self->current_user->{username}, uwmetadata => $self->req->json->{uwmetadata} } );
	}
	elsif($self->req->json->{mods}){
		$self->app->log->info("[".$self->current_user->{username}."] saving mods");
		my $mods_model = PhaidraUI::Model::Mods->new;
		my $mods = $mods_model->mods_strip_empty_nodes($self, $self->req->json->{mods});
		$reply = $self->mango->db->collection('templates')->insert({ title => $title, created => time, updated => time, project => $self->current_user->{project}, created_by => $self->current_user->{username}, mods => $mods } );
	}

	$self->render(json => { alerts => [{ type => 'danger', msg => "Saving template $title failed" }] }, status => 500)
		unless($reply);

	my $oid = $reply->{oid};
	if($oid){
		$self->app->log->info("[".$self->current_user->{username}."] Created template ".$title." [$oid]");
		$self->render(json => { tid => "$oid", alerts => [{ type => 'success', msg => "Template $title created" }] }, status => 200);
	}else{
		$self->render(json => { alerts => [{ type => 'danger', msg => "Saving template $title failed" }] }, status => 500);
	}
}





sub templates {
        
        my $self = shift;  	 

	my $init_data = { current_user => $self->current_user };
        $self->stash(init_data => encode_json($init_data));
      
	$self->render('templates/list');
}



#sub my {
sub get_all {
    my $self = shift;  	 
    
    $self->render_later;
    #$self->mango->db->collection('templates.uwmetadata')
    $self->mango->db->collection('templates')
		->find({ created_by => $self->current_user->{username}})
		->sort({created => 1})
		#->fields({ title => 1, created => 1, updated => 1, created_by => 1 })
		->all(
			sub {
			    my ($reply, $error, $coll) = @_;

			    if ( $error ){
			    	$self->app->log->info("[".$self->current_user->{username}."] Error searching templates: ".$self->app->dumper($error));
			    	$self->render(json => { alerts => [{ type => 'danger', msg => "Error searching templates" }] }, status => 500);	
			    }
			    foreach (@$coll){
			          push(@{$_->{metadata_types}}, 'Uwmetadata') if defined $_->{uwmetadata};
			          push(@{$_->{metadata_types}}, 'Mods') if defined $_->{mods};
			          #$_->{metadata_type} = 'Uwmetadata' if defined $_->{uwmetadata};
			          #$_->{metadata_type} = 'Mods' if defined $_->{mods};
			    }
                           
			    my $collsize = scalar @{$coll};
			    $self->render(json => {templates => $coll, alerts => [{ type => 'success', msg => "Found $collsize templates" }] , status => 200 });
			}
	       );

}

1;
