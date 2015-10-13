package PhaidraUI::Controller::Group;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json decode_json);
use base 'Mojolicious::Controller';
use PhaidraUI;
#use PhaidraUI::Model::Object;
use URI::Encode;

use Data::Dumper;

sub display{

        my $self = shift;
    
        my $url = Mojo::URL->new;
        $url->scheme('https');
        my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
        $url->host($base[0]);
        if(exists($base[1])){
                $url->path($base[1]."/groups");
        }else{
                $url->path("/groups");
        }
        
        my $token = $self->load_token;
        
        
        $self->ua->get($url => {$self->app->config->{authentication}->{token_header} => $token} => sub {
                my ($ua, $tx) = @_;
                my $init_data = {};
                #$self->app->log->debug("get_groups tx".$self->app->dumper($tx));
                if (my $res = $tx->success) {
                        #$self->render(json => $res->json, status => 200 );
                        #$self->app->log->debug("get_groups success".$self->app->dumper($res->json));
                        $init_data = { json => $res->json, status => 200 };
                        $self->stash(init_data => encode_json($init_data));
                        $self->render('groups');
                }else{
                        my ($err, $code) = $tx->error;
                        $self->app->log->error("get_groups error: ".$self->app->dumper($tx->error));
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

sub add{

    my $self = shift;
    
    my $payload = $self->req->json;
    my $group_name = $payload->{'group_name'};
    #my $pid = $self->stash('pid');
    
    my $url = Mojo::URL->new;
    $url->scheme('https');
    my @base = split('/',$self->app->config->{phaidra}->{apibaseurl});
    $url->host($base[0]);
    if(exists($base[1])){
                $url->path($base[1]."/group/add");
    }else{
                $url->path("/group/add");
    }
    #$url->query({'name' => $group_name});
    
    #$group_name = encode_json($group_name);
    my $uri = URI::Encode->new( { encode_reserved => 0 } );
    $group_name = $uri->decode($group_name) if defined $group_name;
    
    my $token = $self->load_token;
    $self->app->log->debug("group add group_name:".$self->app->dumper($group_name));
    $self->ua->post($url => {$self->app->config->{authentication}->{token_header} => $token},
                form => {name => $group_name},
                sub {
                        my ($ua, $tx) = @_;
                        if (my $res = $tx->success) {
                                my $successful;
                                $self->app->log->debug("group add success:".$self->app->dumper($tx));
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


1;