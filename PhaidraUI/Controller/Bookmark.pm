package PhaidraUI::Controller::Bookmark;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json decode_json);
use Mojo::Util;
use base 'Mojolicious::Controller';
#use PhaidraUI::Model::Object;
#use PhaidraUI::Model::Cache;
use PhaidraUI;


use Data::Dumper;


=head1	

sub create2 {

    my $self = shift;
    
    
    my $username = $self->current_user->{username};
    unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
    }
    my $bookmarkName = $self->param('bookmarkname');
    
    
    
    $self->app->log->info("bookmarkname2: ".$self->app->dumper($self->param('bookmarkname')));

}

=cut

sub create{
            
        my $self = shift;
         $self->app->log->info("bookmarkname2: ".$self->app->dumper($self->param('bookmarkname')));
        my $username = $self->current_user->{username};
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
	my $bookmarkName = $self->param('bookmarkname');
	
	
	#my @existingBookmarks = $self->getBookmarks();
	
	#if( !($bookmarkName ~~ @existingBookmarks)  )
	#{
              $self->mango->db->collection('bookmarks')->insert({ username     => $username,
                                                                  bookmarkname => $bookmarkName,
	                                                        });
	#}
	
=head1	
	
	{
	       $self->app->log->info("bookmarkname3: ".$self->app->dumper($self->param('bookmarkname')));
	       $self->mango->db->collection('bookmarks')->update({"name" => $bookmarkName},
	                                                         {'$set' => { 
                                                                            'name'       => $username
                                                                            }
                                                                 }
                                                                );	     
	}
	

	
	else
	
=cut	
	

	
	
      $self->render(json => { alerts => [] }, status => 200);
}

sub get{
     
     my $self = shift;
     #my $bookmarks = $self->getBookmarks();
     my $bookmarksWithId = $self->getBookmarksWithId();
     $self->render(json => { bookmarks => $bookmarksWithId, alerts => [] }, status => 200);
}

sub getBookmarks{
  
    my $self = shift;
    my $username = $self->current_user->{username};
    my @bookmarksArr;
    my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username});
    while (my $bookmark = $datasetBookmarks->next) {
         if(defined $bookmark->{'bookmarkname'}){
               push(@bookmarksArr, $bookmark->{'bookmarkname'});
         }
    }
    return \@bookmarksArr;
}

sub getBookmarksWithId{
  
    my $self = shift;
    my $username = $self->current_user->{username};
    my @bookmarksArr;
    my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username});
    while (my $bookmark = $datasetBookmarks->next) {
         if(defined $bookmark->{'bookmarkname'}){
               my $bookmarkWithId;
               $bookmarkWithId->{'bookmarkname'} = $bookmark->{'bookmarkname'};
               $bookmarkWithId->{'id'} = $bookmark->{'_id'};
               $self->app->log->info("id: ".$self->app->dumper($bookmark->{'_id'}));
               push(@bookmarksArr, $bookmarkWithId);
         }
    }
    return \@bookmarksArr;
}


sub add_to{

     my $self = shift;

     
     my $payload = $self->req->json;
     my $pid = decode_json($payload->{'pid'});
     my $currentBookmarkId = decode_json($payload->{'currentBookmarkId'});

     
     $self->app->log->info("currentBookmarkId: ".$self->app->dumper($currentBookmarkId));
     $self->app->log->info("pid: ".$self->app->dumper($pid));

     my $username = $self->current_user->{username};

     
     my $id = {oid => $currentBookmarkId};
     no strict 'subs';
     bless($id, Mango::BSON::ObjectID);
     use strict 'subs';
     
     my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username, _id => $id});
     my $bookmarkPids;
     while (my $bookmark = $datasetBookmarks->next) {
           $bookmarkPids = $bookmark->{'bookmarkPids'};
     }
     $self->app->log->info(" bookmarkPids: ".$self->app->dumper( $bookmarkPids));
     if( !($pid ~~ @$bookmarkPids)  ){
	       $self->app->log->info("add_to push. ");
	       push(@$bookmarkPids, $pid);
	       $self->mango->db->collection('bookmarks')->update({"username" => $username, _id => $id},
	                                                         {'$set' => { 
                                                                            'bookmarkPids'       => $bookmarkPids
                                                                            }
                                                                 }
                                                                );
     }
     
     
     
=head1     
     
     # first bookmark case for current bookmark
     $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username, current_bookmark_flag => 1});
     my $bookmarkFlag;
     while (my $bookmark = $datasetBookmarks->next) {
           $bookmarkFlag = $bookmark;
     }
     if(not defined $bookmarkFlag){
            $self->mango->db->collection('bookmarks')->insert({ username     => $username,
                                                                current_bookmark_flag => '1',
	                                                        });
     }
     # save current bookmark
     $self->mango->db->collection('bookmarks')->update({"username" => $username, current_bookmark_flag => '1'},
	                                                         {'$set' => { 
                                                                            'current_bookmark'       => $currentBookmark
                                                                            }
                                                                 }
                                                                );
     
=cut     
     
     
     # check if bookmark already exisits
     #my $bookmakrExist = 0;
     #if(defined $bookmarkPids){
     #     foreach my $pid (@$bookmarkPids){
     #          if($pid == $currentBookmark){
     #               $bookmakrExist = 1;
     #          }
     #     }
     #}
     
     $self->render(json => { alerts => [] }, status => 200);
}

sub edit{

     my $self = shift;
     
     my $init_data;
     my $username = $self->current_user->{username};
     my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username});
     my @bookmarksArr;
     while (my $bookmark = $datasetBookmarks->next) {
         if(defined $bookmark->{'bookmarkname'}){
               my $bookmarkWithId;
               $bookmarkWithId->{'bookmarkname'} = $bookmark->{'bookmarkname'};
               $bookmarkWithId->{'id'} = $bookmark->{'_id'};
               push(@bookmarksArr, $bookmarkWithId);
         }
     }
     $init_data->{bookmarks} = \@bookmarksArr;
     $self->stash(init_data => encode_json($init_data)); 
     $self->stash(title => 'Bookmarks editor');
     
     $self->render('bookmarkeditor');
}

sub edit_pid{
    
     my $self = shift;
     
     my $bookmarkId = $self->stash('bookmarkid');
     my $username = $self->current_user->{username};
     #$bookmark = decode_json($bookmark);
     #$bookmark = url_unescape($bookmark);
     
     my $id = {oid => $bookmarkId};
     no strict 'subs';
     bless($id, Mango::BSON::ObjectID);
     use strict 'subs';
     
     my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username, _id => $id});
     my $pids;
     my $bookmarkName;
     while (my $bookmark = $datasetBookmarks->next) {
           $pids         = $bookmark->{'bookmarkPids'};
           $bookmarkName = $bookmark->{'bookmarkname'};
     }
     
     
     $self->app->log->info("pids111: ".$self->app->dumper($pids));
     #my $pid = $data->{pid};
     
     my $init_data->{pids} = $pids;
     $init_data->{bookmarkName} = $bookmarkName;
     $init_data->{bookmarkId} = $bookmarkId;
     $self->stash(init_data => encode_json($init_data)); 
     $self->stash(title => 'Bookmark pids editor');
     
     $self->render('bookmark_pid_editor');
}


sub delete{
      
      my $self = shift;
      
      my $username = $self->current_user->{username};
      my $payload = $self->req->json;
      my $bookmarkId = $payload->{'bookmarkId'};
      
      my $id = {oid => $bookmarkId};
      no strict 'subs';
      bless($id, Mango::BSON::ObjectID);
      use strict 'subs';
      
      my $res = $self->mango->db->collection('bookmarks')->remove({username => $username, _id => $id }) if defined $id;
      # return bookmars after deletion
      my $bookmarks = $self->getBookmarksWithId();
      $self->render(json => { bookmarks => $bookmarks, alerts => [] }, status => 200);
}

sub deletepid{
      
      my $self = shift;
      
      my $username = $self->current_user->{username};
      my $payload = $self->req->json;
      my $bookmarkId = $payload->{'bookmarkId'};
      my $pid = $payload->{'pid'};
      my $bookmarkPids;
      
      my $id = {oid => $bookmarkId};
      no strict 'subs';
      bless($id, Mango::BSON::ObjectID);
      use strict 'subs';
      my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username, _id => $id});
      while (my $bookmark = $datasetBookmarks->next) {
           $bookmarkPids = $bookmark->{'bookmarkPids'};
      }
      for my $index (0 .. @$bookmarkPids){
         if(@$bookmarkPids[$index] eq $pid){
             splice(@$bookmarkPids, $index, 1);
         }
      }
      $self->app->log->info("bookmarkPids 123b: ".$self->app->dumper($bookmarkPids));
      $self->mango->db->collection('bookmarks')->update({"username" => $username, _id => $id},
	                                                         {'$set' => { 
                                                                            'bookmarkPids'       => $bookmarkPids
                                                                            }
                                                                 }
                                                       );
      $self->render(json => { bookmarkPids => $bookmarkPids, alerts => [] }, status => 200);
}


sub delete_all{

    my $self = shift;
    
    my $username = $self->current_user->{username};
    my $res = $self->mango->db->collection('bookmarks')->remove({username => $username });
    $self->render(json => { alerts => [] }, status => 200);
}

sub delete_all_pid{

    my $self = shift;
    
    my $username = $self->current_user->{username};
    my $payload = $self->req->json;
    my $bookmarkId = $payload->{'bookmarkId'};
    my $id = {oid => $bookmarkId};
    no strict 'subs';
    bless($id, Mango::BSON::ObjectID);
    use strict 'subs';
    
    $self->mango->db->collection('bookmarks')->update({"username" => $username, _id => $id},
	                                                         {'$set' => { 
                                                                            'bookmarkPids'       => []
                                                                            }
                                                                 }
                                                       );
    $self->render(json => { alerts => [] }, status => 200);
 
}







1;