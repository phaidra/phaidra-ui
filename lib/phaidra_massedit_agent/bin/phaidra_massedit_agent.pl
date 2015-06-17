#!/usr/bin/perl -w

use strict;

use FindBin::libs;
use FindBin '$Bin';
use lib "$Bin/../lib";

use Data::Dumper;
$Data::Dumper::Indent= 1;

use PhaidraMasseditAgent;

=head1 PhaidraMasseditAgent
 
 Running Massedit Agent
   Parameters:
      1. config path
      2. username
      3. instance 
   
=cut  

my ($configPath, $username, $instance, $jobId) = @ARGV;


my $MasseditAgent = PhaidraMasseditAgent->new($configPath, $username, $instance);


$MasseditAgent->process_job($jobId);

1;
