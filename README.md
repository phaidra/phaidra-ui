phaidra-ui 
===========

Prerequisities:

* Mojolicious Plugins

  /usr/local/bin/cpanm Mojolicious::Plugin::Database
  
  /usr/local/bin/cpanm MooX::Types::MooseLike::Numeric --force
  
  /usr/local/bin/cpanm MooX::Types::MooseLike
  
  /usr/local/bin/cpanm Mojolicious::Plugin::CHI
  
  /usr/local/bin/cpanm Mojolicious::Plugin::I18N

  /usr/local/bin/cpanm Mojolicious::Plugin::Session
  
  /usr/local/bin/cpanm Mojolicious::Plugin::Authentication
  
  /usr/local/bin/cpanm Net::LDAPS

  /usr/local/bin/cpanm IO::Socket::SSL
  
  
  (On Ubuntu: sudo apt-get install libmojolicious-plugin-i18n-perl)

* Run:

  $# morbo -w PhaidraUI -w templates -w public -w lib phaidra-ui.cgi

  [debug] Reading config file "PhaidraUI.json".

  Server available at http://127.0.0.1:3000.

* Apache/Hypnotoad

	Run: 
	
	Hypnotoad:
	
	/usr/local/bin/hypnotoad phaidra-ui.cgi

	or
		
	Morbo:
	
	env MOJO_REVERSE_PROXY=1 /usr/local/bin/morbo -w PhaidraUI -w PhaidraUI.json -w PhaidraUI.pm -w templates -w public -w lib phaidra-ui.cgi
	
	Apache virtual host conf (among other stuff, eg SSLEngine config):
	
		RewriteEngine on
        RewriteCond %{HTTP:Authorization} ^(.+)
        RewriteRule ^(.*)$ $1 [E=HTTP_AUTHORIZATION:%1,PT]

        <Proxy *>
                Order deny,allow
                Allow from all
        </Proxy>

        ProxyRequests Off
        ProxyPreserveHost On

        ProxyPassReverse  / http://localhost:3000/
        ProxyPassReverse  / https://localhost:3000/

        ProxyPass / http://localhost:3000/ keepalive=On

        RequestHeader set X-Forwarded-HTTPS "1"

	Hypnotoad config (PhaidraUI.json):
		proxy: 1	

* Apache/CGI

  $# chown apache:apache phaidra-ui.cgi
  
  $# chmod u+x ui.cgi

  Virtual host config:
  
        ScriptAlias / my_document_root/phaidra-ui.cgi

        RewriteEngine on
        RewriteCond %{HTTP:Authorization} ^(.+)
        RewriteRule ^(.*)$ $1 [E=HTTP_AUTHORIZATION:%1,PT]
  
