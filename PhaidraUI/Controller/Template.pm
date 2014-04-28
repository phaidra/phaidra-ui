package PhaidraUI::Controller::Template;

use strict;
use warnings;
use v5.10;
use Mango::BSON ':bson';
use Mango::BSON::ObjectID;
use Mojo::JSON qw(encode_json);
use base 'Mojolicious::Controller';

sub load {
	
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
								#alerts => [{ type => 'success', msg => "Template ".$doc->{title}." loaded" }] 
							}, 
					status => 200);
				   
				}
	);
		
}

sub save {
	
	my $self = shift;  	
	my $tid = $self->stash('tid');
	
	$self->app->log->info("[".$self->current_user->{username}."] Saving template $tid");
	
	my $oid = Mango::BSON::ObjectID->new($tid);
	
	my $reply = $self->mango->db->collection('templates.uwmetadata')->update({_id => $oid},{ '$set' => {updated => bson_time, uwmetadata => $self->req->json->{uwmetadata}} } );
	
	my ( $sec, $min, $hour, $day, $mon, $year ) = localtime();
	my $now = sprintf("%02d.%02d.%04d %02d:%02d:%02d",$day, $mon + 1, $year + 1900, $hour, $min, $sec);
	$self->render(json => { alerts => [{ type => 'success', msg => "Saved at $now" }] }, status => 200);

}


sub create {
	my $self = shift;  
	
	my $res = { alerts => [], status => 200 };
	
	my $title = $self->req->json->{title};
	
	$self->app->log->info("[".$self->current_user->{username}."] Creating template ".$title);
	
	my $reply = $self->mango->db->collection('templates.uwmetadata')->insert({ title => $title, created => bson_time, updated => bson_time, created_by => $self->current_user->{username}, uwmetadata => $self->req->json->{uwmetadata} } );
	
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

sub my {
    my $self = shift;  	 
    
    $self->render_later;

	$self->mango->db->collection('templates.uwmetadata')
		->find({ created_by => $self->current_user->{username}})
		->sort({created => 1})
		->fields({ title => 1, created => 1, updated => 1, created_by => 1 })
		->all(
			sub {
			    my ($reply, $error, $coll) = @_;

			    if ( $error ){
			    	$self->app->log->info("[".$self->current_user->{username}."] Error searching templates: ".$self->app->dumper($error));
			    	$self->render(json => { alerts => [{ type => 'danger', msg => "Error searching templates" }] }, status => 500);	
			    }
			    
			    my $collsize = scalar @{$coll};
			    $self->render(json => { templates => $coll, alerts => [{ type => 'success', msg => "Found $collsize templates" }] , status => 200 });
			}
	);

}

1;
