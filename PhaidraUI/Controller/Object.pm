package PhaidraUI::Controller::Object;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json decode_json);
use base 'Mojolicious::Controller';
use PhaidraUI;
use PhaidraUI::Model::Object;
use URI::Encode;

use Data::Dumper;


sub get_object_mods{
      
	my $self = shift;

	#my $pid = 'o:13690';
	my $pid = $self->stash('pid');
	$self->app->log->debug("o get_object_mods pid".$self->app->dumper($self->stash('pid')));
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/object/$pid/mods");
	}else{
		$url->path("/object/$pid/mods");
	}
        
        #$url->query({'q' => $q, 'limit' => $limit});
      	my $token = $self->load_token;
	
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub {
  		my ($ua, $tx) = @_;
	  	#$self->app->log->debug("get_object_mods tx".$self->app->dumper($tx));
	  	if (my $res = $tx->success) {
	  		#$self->app->log->debug("get_object_mods success".$self->app->dumper($res->json));
	  		$self->render(json => $res->json, status => 200 );
	  	}else{
		 	my ($err, $code) = $tx->error;
		 	$self->app->log->error("get_object_mods error: ".$self->app->dumper($tx->error));
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

sub save_object_mods{
     	
     	my $self = shift;  	
	
	my $pid = $self->stash('pid');
	my $payload = $self->req->json;
        my $mods = $payload->{'mods'};
	
	$self->app->log->debug("mods pid:".$self->app->dumper($pid));
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/object/$pid/mods");
	}else{
		$url->path("/object/$pid/mods");
	}
	
	my $token = $self->load_token;
	$self->app->log->debug("save_object_mods mods:".$self->app->dumper(encode_json($mods)));
	$self->app->log->debug("save_object_mods token:".$self->app->dumper($token));
  	$self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		form => { metadata => encode_json($mods) }, 
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	
		  	if (my $res = $tx->success) {
		  		$self->render(json => $res->json, status => 200 );
		  		$self->app->log->debug("save_object_mods success123:".$self->app->dumper($res->json));
		  	}else {
			 	my ($err, $code) = $tx->error;	 
			 	$self->app->log->debug("save_object_mods error:".$self->app->dumper($tx->error));
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			}		
  		}
  	);
      
      
}

sub get_object_uwmetadata {
	
	my $self = shift;  	
	my $pid = $self->stash('pid');
	$self->app->log->debug('get_object_uwmetadata pid:',$self->stash('pid'));
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
	$self->app->log->debug('get_object_uwmetadata00');
  	$self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub {
  		my ($ua, $tx) = @_;
              $self->app->log->debug('get_object_uwmetadata11');
	  	if (my $res = $tx->success) {
	  		$self->render(json => $res->json, status => 200 );
	  		# $self->app->log->debug('get_object_uwmetadata', $self->app->dumper($res->json));
	  		$self->app->log->debug('get_object_uwmetadata');
	  	}else {
	  	        $self->app->log->error('get_object_uwmetadata error: ', $self->app->dumper($tx->error)) if defined $tx->error;
	  	        #$self->app->log->debug($self->app->dumper($tx));	
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
	my $payload = $self->req->json;
        my $uwmetadata = $payload->{'uwmetadata'};
	

	$self->app->log->debug("save_object_uwmetadata pid:".$self->app->dumper($pid));
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
	
	my $token = $self->load_token;
	$self->app->log->debug("save_object_uwmetadata token:".$self->app->dumper($token));
  	#$self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token, 'Content-Type' => 'multipart/form-data'},
  	#	form => { metadata =>   { content => encode_json($uwmetadata) } }, 
  	$self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		form => { metadata => encode_json($uwmetadata) }, 
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	
		  	if (my $res = $tx->success) {
		  		$self->render(json => $res->json, status => 200 );
		  		$self->app->log->debug("save_object_uwmetadata success123:".$self->app->dumper($res->json));
		  	}else {
			 	my ($err, $code) = $tx->error;	 
			 	$self->app->log->debug("save_object_uwmetadata error:".$self->app->dumper($tx->error));
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			}		
  		}
  	);

}

sub uwmetadataeditor {
    my $self = shift;  	
    $self->stash(uwmetadataeditor_mode => 'object');
    
     $self->app->log->info("uwmetadata_template_editor owner pid: ".$self->app->dumper($self->stash('pid')));
    
    my $object_model = PhaidraUI::Model::Object->new;	
    my $owner = $object_model->get_owner($self, $self->stash('pid'));
    $self->app->log->info("uwmetadata_template_editor owner: ".$self->app->dumper($owner));
    my $init_data = { pid => $self->stash('pid'), current_user => $self->current_user, owner => $owner, uwmetadataeditor_mode => 'object' };
    $self->stash(init_data => encode_json($init_data));
    $self->stash(init_data_perl => $init_data);
    #$self->app->log->info("uwmetadata_template_editor: ".$self->app->dumper($init_data));
    $self->render('uwmetadataeditor/uwmetadataeditor');
    #$self->render('templates/uwmetadata/uwmetadataeditor_experiment');
    #$self->render('uwmetadataeditor');
}

sub uwmetadata_template_editor {
    my $self = shift;
    
    my $object_model = PhaidraUI::Model::Object->new;
    
    $self->stash(uwmetadataeditor_mode => 'template');
    my $init_data = { tid => $self->stash('tid'), current_user => $self->current_user, uwmetadataeditor_mode => 'template' };
    $self->stash(init_data => encode_json($init_data));
    $self->stash(init_data_perl => $init_data);
    #$self->render('uwmetadataeditor');
    $self->render('uwmetadataeditor/uwmetadataeditor');	
}
sub modseditor {
     my $self = shift;
     $self->stash(mods_mode => 'object');
     
     my $object_model = PhaidraUI::Model::Object->new;	
     my $owner = $object_model->get_owner($self, $self->stash('pid'));
   
     
     
     my $init_data = { pid => $self->stash('pid'), current_user => $self->current_user, owner => $owner, mods_mode => 'object' };
     $self->stash(init_data => encode_json($init_data)); 
     $self->stash(init_data_perl => $init_data);
     
     $self->render('modseditor/modseditor');
}


sub mods_template_editor {
    
    my $self = shift;
    $self->stash(mods_mode => 'template');
    
    my $object_model = PhaidraUI::Model::Object->new;
    
    #my $init_data = { tid => $self->stash('tid'), current_user => $self->current_user };
    #$self->stash(init_data => encode_json($init_data));  	 
    
    ###my $cache_model = PhaidraUI::Model::Cache->new;
    ###my $res = $cache_model->get_mods_tree($self);
    #$self->app->log->info("mods_template_editor: ".$self->app->dumper($res));
    #my $resJson = decode_json($res) if defined $res;
    my $init_data = { tid => $self->stash('tid'), current_user => $self->current_user, mods_mode => 'template' };
    $self->stash(init_data => encode_json($init_data)); 
    $self->stash(init_data_perl => $init_data);
    
    ###$self->stash(init_data => encode_json($res));
    
    $self->render('modseditor/modseditor');	
}

sub search {
        
        my $self = shift;  	 
	my $query = $self->param('q');

	my $init_data = { current_user => $self->current_user};
	
	if($query){
		$init_data->{query} = $query;	
	}
	
        $self->stash(init_data => encode_json($init_data));
    
	$self->render('objects/list');
}


sub view {
      
      my $self = shift;
      #my $int = {pid => $self->stash('pid')}; #get
      #my $int = {pid => $self->param('pid')};  #post
      
      my $payload = $self->req->json;
      #my $template = $payload->{'pidExtended'};  
      
      ############################## start test ############################
      ######################################################################
      #my $data = $self->stash('pid');
      my $data = $self->param('pidExtended');
      $self->app->log->info("view stash pid: ".$self->app->dumper($self->stash('pid')));
      $self->app->log->info("view param pid: ".$self->app->dumper($self->param('pid')));
      $self->app->log->info("view payload pidExtended: ".$self->app->dumper($payload->{'pidExtended'}));
      $self->app->log->info("view stash pidExtended: ".$self->app->dumper($self->stash('pidExtended')));
      $self->app->log->info("view param pidExtended: ".$self->app->dumper($self->param('pidExtended')));
      
      # TODO pid/data fix/clean!!! after decision on frontend session design
      
      #$data = decode_json($data);
      my $uri = URI::Encode->new( { encode_reserved => 0 } );
      $data = $uri->decode($payload->{'pidExtended'}) if defined $payload->{'pidExtended'};
      $data = decode_json($data)  if defined $payload->{'pidExtended'};
      
      $self->app->log->info("view data: ".$self->app->dumper($data));
      
      ############################## end test ###############################
      #######################################################################
      #my $pid = $data->{pid};
      #my $pid = decode_json($self->param('pid')) if defined $self->param('pid');
      my $pid;
      $pid = $self->param('pid') if defined $self->param('pid');
      if(not defined $pid){
           $pid = $self->stash('pid') if defined $self->stash('pid');
      }
      #$data->{pidExtended} = decode_json($pid);
      $self->app->log->info("view data9999: ".$pid);
      $data = decode_json($pid);
      
      
      my $object_model = PhaidraUI::Model::Object->new;	
      my $owner = $object_model->get_owner($self, $data->{pid});
      $data->{current_user} = $self->current_user;
      $data->{owner} = $owner;
      $data->{baseurl} = $self->app->config->{phaidra}->{baseurl};
      # url encode dot and dash
      $data->{baseurl} =~ s/\./%2E/g; 
      $data->{baseurl} =~ s/-/%2D/g;
      $data = encode_json($data);

      my $init_data_perl = { current_user => $self->current_user, pid => $pid, owner => $owner };
      $self->stash(init_data_perl => $init_data_perl);
      $self->stash(init_data => $data);

      $self->render('objects/view');
}

sub get_rights{
	
	my $self = shift;
	my $pid = $self->stash('pid');

	
	$self->app->log->debug("get_rights pid:".$self->app->dumper($pid));
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){
		$url->path($base[1]."/object/$pid/rights");
	}else{
		$url->path("/object/$pid/rights");
	}
	my $rights;
  	my $get = $self->ua->get($url);  	
  	if (my $r = $get->success) {
  		$rights = $r->json;
  		$self->app->log->debug("get_rights result:".$self->app->dumper($rights));
  		$self->render(json => $r->json, status => 200 );
  	}
	else {
	      my ($err, $code) = $get->error;
	      $self->app->log->error("Cannot get rights data. Errorcode: $code, Error:".$self->app->dumper($err));
	      if(exists($get->res->json->{alerts})) {
		     $self->render(json => { alerts => $get->res->json->{alerts} }, status =>  $code ? $code : 500);
	      }else{
		     $self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
	      }
	
	
	}

}


sub post_rights{

    my $self = shift;
    
    my $payload = $self->req->json;
    my $rights = $payload->{'rights'};
    my $pid = $self->stash('pid');
    
    my $url = Mojo::URL->new;
    $url->scheme('https');
    my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
    $url->host($base[0]);
    if(exists($base[1])){
		$url->path($base[1]."/object/$pid/metadata");
    }else{
		$url->path("/object/$pid/metadata");
    }
    $rights = encode_json($rights);
    my $token = $self->load_token;

    $self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		form => {metadata => $rights}, #mf ... TODO !!!
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	                $self->app->log->debug("save_object_rights xxx:".$self->app->dumper($rights));
		  	if (my $res = $tx->success) {
		  		$self->render(json => $res->json, status => 200 );
		  		$self->app->log->debug("save_object_rights success345:".$self->app->dumper($res->json));
		  	}else {
			 	$self->app->log->debug("save_object_rights fail1:");
			 	my ($err, $code) = $tx->error;
			 	$self->app->log->debug("save_object_rights err:",$self->app->dumper($err),"code:", $code);
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			 	
			}		
  		}
  	);
    
}


#TODO bring it back to controler because of 'status'
sub get_geo{
    
    my $self = shift;
    
    my $object_model = PhaidraUI::Model::Object->new;	
    my $geo = $object_model->get_geo($self, $self->stash('pid'));
    
    $self->render(json =>  $geo , status => 200);
    
}

sub post_geo{
   
    my $self = shift;
    
    my $payload = $self->req->json;
    my $geo = $payload->{'geo'};
    my $pid = $self->stash('pid');
    
    #my $object_model = PhaidraUI::Model::Object->new;	
    #$geo = $object_model->post_geo($self, $pid, $geo);
    
    #$self->render(json => { geo => $geo }, status => 200);
    
    
    
    
    
    
    
    
    
    
    
    my $url = Mojo::URL->new;
    $url->scheme('https');
    my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
    $url->host($base[0]);
    if(exists($base[1])){
		$url->path($base[1]."/object/$pid/metadata");
    }else{
		$url->path("/object/$pid/metadata");
    }
    $geo = encode_json($geo);
    my $token = $self->load_token;

    $self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		form => {metadata => $geo}, #mf ... TODO !!!
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	                $self->app->log->debug("save_object_geo xxx:");
		  	if (my $res = $tx->success) {
		  		$self->render(json => $res->json, status => 200 );
		  		$self->app->log->debug("save_object_geo success345:".$self->app->dumper($res->json));
		  	}else {
			 	$self->app->log->debug("save_object_geo fail1:");
			 	my ($err, $code) = $tx->error;
			 	$self->app->log->debug("save_object_geo err:",$self->app->dumper($err),"code:", $code);
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			 	
			}		
  		}
  	);
    
    
    
    
}

sub get_dublincore{
   
   	my $self = shift;
	my $pid = $self->stash('pid');

	
	$self->app->log->debug("get_dublincore pid:".$self->app->dumper($pid));
	my $res = { alerts => [], status => 200 };
	
	my $url = Mojo::URL->new;
	$url->scheme('https');
	my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
	$url->host($base[0]);
	if(exists($base[1])){  
		$url->path($base[1]."/object/$pid/dc");
	}else{
		$url->path("/object/$pid/dc");
	}
	my $dc;
  	my $get = $self->ua->get($url);  	
  	if (my $r = $get->success) {
  		$dc = $r->json;
  		$self->app->log->debug("get_rights result:".$self->app->dumper($dc));
  		$self->render(json => $r->json, status => 200 );
  	}
	else {
	      my ($err, $code) = $get->error;
	      $self->app->log->error("Cannot get dublincore data. Errorcode: $code, Error:".$self->app->dumper($err));
	      if(exists($get->res->json->{alerts})) {
		     $self->render(json => { alerts => $get->res->json->{alerts} }, status =>  $code ? $code : 500);
	      }else{
		     $self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
	      }
	
	
	}
}

sub submit {
        
        my $self = shift;  	 

	my $init_data = { current_user => $self->current_user };
        $self->stash(init_data => encode_json($init_data));
      
	$self->render('objects/submit/submit');
}



sub submit_new_object{
     
     my $self = shift;
     
     my $object_type = $self->stash('object_type');
     $self->app->log->debug("submit_new_object:",$self->app->dumper($object_type));
     
     my $init_data = { current_user => $self->current_user, object_type => $object_type };
     $self->stash(init_data => encode_json($init_data));
     
     $self->render('objects/submit/new_object');
     
}

sub submit_create_object{

    my $self = shift;
  
    my $uwmetadata    = $self->param('uwmetadata');
    my $object_type   = $self->param('object_type');
    

    my $url = Mojo::URL->new;
    $url->scheme('https');
    my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
    $url->host($base[0]);
    
    my $upload;
    if($object_type eq 'picture'){
         $upload = $self->req->upload('img');
         $self->app->log->debug("new_picture3333 upload:",$self->app->dumper($upload)  );
         if(exists($base[1])){
    	       $url->path($base[1]."/picture/create");
         }else{
    	       $url->path("/picture/create");
         }
    }
    if($object_type eq 'audio'){
         $upload = $self->req->upload('audio');
         if(exists($base[1])){
    	       $url->path($base[1]."/audio/create");
         }else{
    	       $url->path("/audio/create");
         }
    }
    if($object_type eq 'video'){
         $upload = $self->req->upload('video');
         if(exists($base[1])){
    	       $url->path($base[1]."/video/create");
         }else{
    	       $url->path("/video/create");
         }
    }
    if($object_type eq 'document'){
         $upload = $self->req->upload('document');
         if(exists($base[1])){
    	       $url->path($base[1]."/document/create");
         }else{
    	       $url->path("/document/create");
         }
    }
    #$self->app->log->debug("new_picture2 uwmetadata:",$self->app->dumper(decode_json($uwmetadata))  );
    #$self->app->log->debug("new_picture2 upload:",$self->app->dumper($upload)  );
    my $token = $self->load_token;
    $self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
  		form => {file => {file=> $upload->asset}, metadata => $uwmetadata},
  	 	sub { 	
	  		my ($ua, $tx) = @_;
	                $self->app->log->debug("new_picture2 xxx:");
		  	if (my $res = $tx->success) {
		  		$self->stash(init_data => encode_json($res->json));
		  		$self->render('objects/submit/successful');
		  		#$self->app->log->debug("new_picture2 success345:".$self->app->dumper(encode_json($res->json)));
		  	}else {
			 	#$self->app->log->debug("new_picture2 fail1:");
			 	my ($err, $code) = $tx->error;
			 	#$self->app->log->debug("new_picture2 err:",$self->app->dumper($err),"code:", $code);
			 	if(exists($tx->res->json->{alerts})) {
			 		$self->render(json => { alerts => $tx->res->json->{alerts} }, status =>  $code ? $code : 500);
			 	}else{
			  		$self->render(json => { alerts => [{ type => 'danger', msg => $err }] }, status =>  $code ? $code : 500);
			 	}
			}		
  		}
  	);
    
    
}


1;