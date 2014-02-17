package PhaidraUI::Controller::Uwmetadata;

use strict;
use warnings;
use v5.10;
use Mojo::UserAgent;
use Mojo::Util 'squish';
use base 'Mojolicious::Controller';
use PhaidraUI::Model::Uwmetadata;
use Time::HiRes qw/tv_interval gettimeofday/;


sub uwmetadataeditor_full {
    my $self = shift;  	       
    $self->render('uwmetadataeditor');	
}


1;
