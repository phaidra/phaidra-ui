package PhaidraUI;

use strict;
use warnings;
use Mojo::Base 'Mojolicious';
use Mojo::Log;
use Mojolicious::Plugin::I18N;
use Mojolicious::Plugin::Authentication;
use Mojolicious::Plugin::Session;
use Mojo::Loader;
use lib "lib/phaidra_directory";
use lib "lib/phaidra_binding";
use PhaidraUI::Model::Session;

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
	
	$self->helper(mango => sub { state $mango = Mango->new('mongodb://'.$config->{mongodb}->{username}.':'.$config->{mongodb}->{password}.'@'.$config->{mongodb}->{host}.'/'.$config->{mongodb}->{database}) });
	
    # we might possibly save a lot of data to session 
    # so we are not going to use cookies, but a database instead
    $self->plugin(
        session => {
            stash_key     => 'mongo-session',
	    	store  => PhaidraUI::Model::Session->new( mango => $self->mango, 'log' => $self->log ),              
            expires_delta => 7200, #2hrs
	    	ip_match      => 1
        }
    );

	$self->sessions->default_expiration(7200); # 2hrs 
	$self->sessions->secure(1);
	$self->sessions->cookie_name('phaidra_'.$config->{installation_id});
        
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
    
    # if we are proxied from base_apache/ui eg like
    # ProxyPass /ui http://localhost:3000/
    # then we have to add /ui/ to base of every req url
    # (set $config->{proxy_path} in config)
    if($config->{proxy_path}){
	    $self->hook('before_dispatch' => sub {
		my $self = shift;		    
	      	push @{$self->req->url->base->path->trailing_slash(1)}, $config->{proxy_path};
	    });
    }

    my $r = $self->routes;
    $r->namespaces(['PhaidraUI::Controller']);
    
    $r->route('') 			  		->via('get')   ->to('frontend#home');
    $r->route('signin') 			  	->via('get')   ->to('authentication#signin');
    $r->route('signout') 			->via('get')   ->to('authentication#signout');
    $r->route('loginform') 			->via('get')   ->to('authentication#loginform');
    
    # if not authenticated, users will be redirected to login page
    my $auth = $r->bridge->to('authentication#check');
    $auth->route('uwmetadataeditor') ->via('get')  ->to('frontend#uwmetadataeditor'); 
    
    $auth->route('proxy/get_object_uwmetadata/:pid') ->via('get')   ->to('proxy#get_object_uwmetadata');
    
    return $self;
}

1;
