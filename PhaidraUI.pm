package PhaidraUI;

use strict;
use warnings;
use Mojo::Base 'Mojolicious';
use Mojo::Log;
use Mojolicious::Plugin::I18N;
use Mojolicious::Plugin::Authentication;
use Mojo::Loader;
use lib "lib/phaidra_directory";
use lib "lib/phaidra_binding";

# This method will run once at server start
sub startup {
    my $self = shift;

    my $config = $self->plugin( 'JSONConfig' => { file => 'PhaidraUI.json' } );
	$self->config($config);  
	$self->mode($config->{mode});     
    $self->secrets([$config->{secret}]);
    
    # init log	
  	$self->log(Mojo::Log->new(path => $config->{log_path}, level => $config->{log_level}));

	my $directory_impl = $config->{directory_class};
	my $e = Mojo::Loader->new->load($directory_impl);    
    my $directory = $directory_impl->new($self, $config);
 
    $self->helper( directory => sub { return $directory; } );
    
    # init auth
    $self->plugin(authentication => {
		load_user => sub {
			my $self = shift;
			my $username  = shift;
			$self->app->log->info("Loading user: ".$username);
			return $self->directory->get_login_data($self, $username);
		},
		validate_user => sub {
			my ($self, $username, $password, $extradata) = @_;
			$self->app->log->info("Validating user: ".$username);
			return $self->directory->authenticate($self, $username, $password, $extradata);
		},
	});
    $self->sessions->default_expiration(7200); # 2hrs 
        
  	# init I18N
  	$self->plugin(charset => {charset => 'utf8'});
  	$self->plugin(I18N => {namespace => 'PhaidraUI::I18N', support_url_langs => [qw(en de it sr)]});
  	
  	# init cache
  	$self->plugin(CHI => {
	    default => {
	      	driver     => 'File', # FastMmap seems to have problems saving the metadata structure (it won't save anything)
	    	root_dir   => '/tmp/phaidra-api-cache',
	    	cache_size => '20m',
	      	global => 1,
	      	#serializer => 'Storable',
    	},
  	});
  	
  	# init databases
=cut  	
    $self->plugin('database', {
    	 
    	databases => {
        	'db_metadata' => { 
				dsn      => $config->{phaidra_db}->{dsn},
                username => $config->{phaidra_db}->{username},
                password => $config->{phaidra_db}->{password},
            },
        },
    });

    
    if($config->{proxy_path}){
	    $self->hook('before_dispatch' => sub {
		    my $self = shift;
		    $self->app->log->debug('bef base:'.$self->app->dumper($self->req->url->base->path->parts));
		    $self->app->log->debug('bef :'.$self->app->dumper($self->req->url->path->parts));
	      	#my $path = shift @{$self->req->url->path->parts};
	      	
	      	#push @{$self->req->url->base->path->parts}, $config->{proxy_path};
	      	$self->app->log->debug('af base:'.$self->app->dumper($self->req->url->base->path->parts));
	      	$self->app->log->debug('af:'.$self->app->dumper($self->req->url->path->parts));
	  	});
    }

    $self->hook(before_dispatch => sub {
	  my $c = shift;
	  $c->app->log->debug('bef:'.$c->app->dumper($c->req->url->base->path->parts));
	  push @{$c->req->url->base->path->trailing_slash(1)},
	    shift @{$c->req->url->path->leading_slash(0)};
	    $c->app->log->debug('af:'.$c->app->dumper($c->req->url->path->parts));
	}) if $self->mode eq 'production';
=cut      
    my $r = $self->routes;
    $r->namespaces(['PhaidraUI::Controller']);
    
    $r->route('') 			  		  ->via('get')   ->to('info#home');
    $r->route('signin') 			  ->via('get')   ->to('authentication#signin');
	$r->route('signout') 			  ->via('get')   ->to('authentication#signout');
	$r->route('loginform') 			  ->via('get')   ->to('authentication#loginform');
    
    # if not authenticated, users will be redirected to login page
    my $auth = $r->bridge->to('authentication#check');
	$auth->route('uwmetadataeditor') ->via('get')   ->to('uwmetadata#uwmetadataeditor');
	
	return $self;
}

1;
