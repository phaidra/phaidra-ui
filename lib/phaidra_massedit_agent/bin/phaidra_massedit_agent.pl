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
      4. JobId
   
=head1 use ....

  use PhaidraMasseditAgent;
  my $pma= new PhaidraMasseditAgent ($configPaht, $username, $instance, optional parameter list as hash);


=head2 Callback UWMetadata Processor

  sub my_special_processor
  {
    my $uwm= shift;

    return (undef, $message) if (something is wrong);

    return ($number_of_changes, $message); # on success
  }

  my $pma= new PhaidraMasseditAgent (..., uwmetadata_processor => \&my_special_processor);

=cut  


my ($configPath, $username, $instance, $jobId);
my $op_mode= 'check';

my @PARS= ();
while (my $arg= shift (@ARGV))
{
  if ($arg eq '--') { push (@PARS, @ARGV); @ARGV= (); }
  elsif ($arg =~ /^--(.+)/)
  {
    my ($opt, $val)= split ('=', $1, 2);

       if ($opt eq 'help')     { usage(); }
    elsif ($opt eq 'config')   { $configPath= $val || shift (@ARGV); }
    elsif ($opt eq 'username') { $username=   $val || shift (@ARGV); }
    elsif ($opt eq 'instance') { $instance=   $val || shift (@ARGV); }
    elsif ($opt eq 'check') { $op_mode= $opt; }
    else { usage(); }
  }
  elsif ($arg =~ /^-(.+)/)
  {
    foreach my $opt (split ('', $1))
    {
         if ($opt eq 'h') { usage(); exit (0); }
      # elsif ($opt eq 'x') { $x_flag= 1; }
      else { usage(); }
    }
  }
  else
  {
    push (@PARS, $arg);
  }
}

# my $configPath, $username, $instance, $jobId) = @ARGV;

my $MasseditAgent = PhaidraMasseditAgent->new($configPath, $username, $instance);

# print "MasseditAgent: ", Dumper ($MasseditAgent); exit(0);

if ($op_mode eq 'jobs')
{
  while (my $jobId= shift (@PARS))
  {
    $MasseditAgent->process_job( { _id => $jobId } );
  }
}
elsif ($op_mode eq 'check')
{
  while (my $pid= shift (@PARS))
  {
    check( $pid );
  }
}

exit (0);

sub check
{
  my $pid= shift;
  my $uwm= $MasseditAgent->getUwmetadata ( $pid );
  print "uwm [pid=$pid]: ", Dumper ($uwm);
}

__END__
other call methods
# $MasseditAgent->process_job( { label => 'urxn_bla' });
# $MasseditAgent->process_job( { _id => $jobId });
