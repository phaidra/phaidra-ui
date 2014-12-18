#!/usr/bin/perl -w

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

if( not defined $configPath ) { $configPath = "/etc/phaidra-massedit/PhaidraMasseditAgent.json" };
if( not defined $username ) { $username = "folcanm4"; }
if( not defined $instance ) { $instance = "sandbox"; }

my $MasseditAgent = PhaidraMasseditAgent->new($configPath, $username, $instance);


#print "aaaaaaaaaaaaaaaaaa\n";
#print "Arg zero: ".$ARGV[0]."\n";
$MasseditAgent->process_job($jobId);

#print Dumper($MasseditAgent);


1;


#/home/michal/Documents/code/area42/user/mf/phaidra-bagger/lib/PhaidraBaggerAgent/Massedit/lib
#/home/michal/Documents/code/area42/user/mf/phaidra-bagger/lib/PhaidraBaggerAgent/Massedit/bin/PhaidraBaggerMasseditAgent.json