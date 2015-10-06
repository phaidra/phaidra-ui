package PhaidraUI::Controller::Bookmark;

use strict;
use warnings;
use v5.10;
use Mojo::JSON qw(encode_json decode_json);
use Mojo::Util;
use base 'Mojolicious::Controller';
use PhaidraUI;
use PhaidraUI::Model::Session::Store::Mongo;

use Data::Dumper;


sub create{
            
        my $self = shift;
        #$self->app->log->info("bookmarkname2: ".$self->app->dumper($self->param('bookmarkname')));
        
        my $username = $self->current_user->{username};
	unless(defined($username)){
		$self->render(json => { alerts => [{ type => 'danger', msg => "Cannot save template, current user is missing (the session might be expired)." }] }, status => 500);
		return;	
	}
	my $bookmarkName = $self->param('bookmarkname');
		
        $self->mango->db->collection('bookmarks')->insert({ username     => $username,
                                                                  bookmarkname => $bookmarkName,
	                                                        });

        $self->render(json => { alerts => [] }, status => 200);
}

sub get{
     
     my $self = shift;
     my $bookmarksWithId = $self->getBookmarksWithId();
     $self->render(json => { bookmarks => $bookmarksWithId, alerts => [] }, status => 200);
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
     my $username = $self->current_user->{username};
     my $id = Mango::BSON::ObjectID->new($currentBookmarkId);
          
     my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username, _id => $id});
     my $bookmarkPids;
     while (my $bookmark = $datasetBookmarks->next) {
           $bookmarkPids = $bookmark->{'bookmarkPids'};
     }
     #if( !($pid ~~ @$bookmarkPids)  ){ 
     if( grep $_ eq $pid, @$bookmarkPids ) {
	       push(@$bookmarkPids, $pid);
	       $self->mango->db->collection('bookmarks')->update({"username" => $username, _id => $id},
	                                                            {'$set' => { 
                                                                            'bookmarkPids'       => $bookmarkPids
                                                                            }
                                                                    }
                                                                );
     }
     
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
     my $id = Mango::BSON::ObjectID->new($bookmarkId);
     
     my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username, _id => $id});
     my $pids;
     my $bookmarkName;
     while (my $bookmark = $datasetBookmarks->next) {
           $pids         = $bookmark->{'bookmarkPids'};
           $bookmarkName = $bookmark->{'bookmarkname'};
     }
     
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
      my $id = Mango::BSON::ObjectID->new($bookmarkId);
      
      my $res = $self->mango->db->collection('bookmarks')->remove({username => $username, _id => $id }) if defined $id;
      # return bookmars after deletion
      my $bookmarks = $self->getBookmarksWithId();
      $self->render(json => { bookmarks => $bookmarks, alerts => [] }, status => 200);
}

sub delete_pid{
      
      my $self = shift;
      
      my $username = $self->current_user->{username};
      my $payload = $self->req->json;
      my $bookmarkId = $payload->{'bookmarkId'};
      my $pid = $payload->{'pid'};
      my $bookmarkPids;
      my $id = Mango::BSON::ObjectID->new($bookmarkId);
      
      my $datasetBookmarks = $self->mango->db->collection('bookmarks')->find({username => $username, _id => $id});
      while (my $bookmark = $datasetBookmarks->next) {
           $bookmarkPids = $bookmark->{'bookmarkPids'};
      }
      
      if(defined $pid){
          for my $index (0 .. @$bookmarkPids - 1){
             if(@$bookmarkPids[$index] eq $pid){
                splice(@$bookmarkPids, $index, 1);
             }
          }
      }
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
    
    my $id = Mango::BSON::ObjectID->new($bookmarkId);
    
    $self->mango->db->collection('bookmarks')->update({"username" => $username, _id => $id},
	                                                         {'$set' => { 
                                                                            'bookmarkPids'       => []
                                                                            }
                                                                 }
                                                       );
    
    $self->render(json => { alerts => [] }, status => 200);
}


1;