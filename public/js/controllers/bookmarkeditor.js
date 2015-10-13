app.controller('BookmarkEditorCtrl',  function($scope, $modal, $location, BookmarkService, promiseTracker){
  
   $scope.sortOrder = 1;
  
   $scope.currentPage = 1; // starting page

   $scope.maxSize = 10; // pages in paginator

   $scope.limit =   10; // records per page
   
   //$scope.bookmarksdisplay = [];
   $scope.bookmarkService = BookmarkService;
   
   $scope.init = function (initdata) {
        
        $scope.initdata = angular.fromJson(initdata);
        console.log('init: ', $scope.initdata);
	//$scope.bookmarks = $scope.initdata.bookmarks;
	BookmarkService.bookmarks = $scope.initdata.bookmarks;
	$scope.bookmarks = BookmarkService.bookmarks;
        for (var i = 0; i <= $scope.limit-1 ; i++) {
	     //if('undefined' !== typeof $scope.bookmarks[i] ){
	     if('undefined' !== typeof BookmarkService.bookmarks[i] ){
                     //$scope.bookmarksdisplay.push($scope.bookmarks[i]);
                     BookmarkService.bookmarksdisplay.push(BookmarkService.bookmarks[i]);
             }
	}
	 console.log('init BookmarkService.bookmarksdisplay: ',BookmarkService.bookmarksdisplay);
   }
   
   $scope.editBookmark = function (bookmark) {
        
   }
   
   $scope.deleteAll = function () {
      
   }
   
   $scope.addBookmark = function () {
      
   }
   
   $scope.setPage = function (page) {
       
       $scope.currentPage = page;
       
       var start  = (page-1)*$scope.limit ;
       var max = (page-1)*$scope.limit + $scope.limit - 1;
       BookmarkService.bookmarksdisplay = [];
       for (var i = start; i <= max  ; i++) {
	     //if('undefined' !== typeof $scope.bookmarks[i] ){
	     if('undefined' !== typeof BookmarkService.bookmarks[i] ){
                     //$scope.bookmarksdisplay.push($scope.bookmarks[i]);
                     BookmarkService.bookmarksdisplay.push(BookmarkService.bookmarks[i]);
             }
       }
       
  }
  
    $scope.recordsPerPage = function (recordsPerPage) { 

        $scope.limit   = recordsPerPage;
        $scope.setPage(1);
    }
  
    $scope.sort = function() {
	  
         //  ascending = 1, descending = 0
	 if($scope.sortOrder == 1){
    		    BookmarkService.bookmarks.sort();
		    $scope.sortOrder = 0;
    	 }else{
    		    BookmarkService.bookmarks.sort();
		    BookmarkService.bookmarks.reverse();
		    $scope.sortOrder = 1;
    	 }
	 BookmarkService.updateBookmarksDisplay(BookmarkService, $scope.currentPage, $scope.limit);
    };
    
    $scope.edit_pid = function(bookmarkId) {
      	
         //bookmarkId = angular.toJson(bookmarkId);
	 //bookmarkId = encodeURIComponent(bookmarkId);  
         window.location = $('head base').attr('href')+'bookmark/edit_pid/'+bookmarkId;
    }
    
    $scope.deleteBookmark = function (bookmarkId, bookmarkName) {

          var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/modals/bookmark/delete_bookmark.html',
                  controller: DeleteBookmarkCtrl,
                  resolve: {
                            bookmarkId: function(){
                                       return bookmarkId;
                                                },
                            bookmarkName: function(){
                                       return bookmarkName;
                                                },
                            page: function(){
                                       return $scope.currentPage;
                                           },
                            limit: function(){
                                       return $scope.limit;
                                             }
                           },
             });
     }
     
    $scope.deleteAllBookmark = function () {

          var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/modals/bookmark/delete_all_bookmark.html',
                  controller: DeleteAllBookmarkCtrl,
                  resolve: {
                            text: function(){
                                       return 'Are you sure you want to delete all bookmarks?';
                                           }
                           },
             });
     }
    // delete it? already in frontend controler!
    $scope.createBookmark2 = function(){
          console.log('createBookmark123');
       
          var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/modals/bookmark/create_bookmark.html',
                     controller: CreateBookmarkModalCtrl,
		     resolve: {
                            page: function(){
                                       return $scope.currentPage;
                                           },
                            limit: function(){
                                       return $scope.limit;
                                             }
                             },
          });
        
   }  
  

});


var DeleteBookmarkCtrl = function ($scope, $modalInstance, BookmarkService, bookmarkId, bookmarkName, page, limit ) {
  
   $scope.bookmarkName = bookmarkName;
   $scope.deleteBookmark = function () {
            var promise = BookmarkService.deleteBookmark(bookmarkId);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			BookmarkService.bookmarks = response.data.bookmarks;
			BookmarkService.updateBookmarksDisplay(BookmarkService, page, limit);
    		}                     
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		if(typeof $scope.alerts == 'undefined'){
			    $scope.alerts = [];
			}
			$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   ); 
  } 
  
   $scope.delete = function () {
          $scope.deleteBookmark();
	  $modalInstance.dismiss('delete');
   };
   $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
   };
   $scope.hitEnter = function(evt){
    	   if(angular.equals(evt.keyCode,13)){
	          $scope.deleteBookmark();
                  $modalInstance.dismiss('delete');
	   }
   };   
}

var DeleteAllBookmarkCtrl = function ($scope, $modalInstance, BookmarkService, text ) {
  
  $scope.text = text;  
  $scope.deleteAllBookmark = function () {
            var promise = BookmarkService.deleteAllBookmark();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			BookmarkService.bookmarks = [];
			BookmarkService.bookmarksdisplay = [];
    		}                     
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		if(typeof $scope.alerts == 'undefined'){
			    $scope.alerts = [];
			}
			$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   ); 
  } 
  
  
   $scope.OK = function () {
          $scope.deleteAllBookmark();
	  $modalInstance.dismiss('OK');
   };
   $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
   };
      $scope.hitEnter = function(evt){
    	   if(angular.equals(evt.keyCode,13)){
	          $scope.deleteAllBookmark();
                  $modalInstance.dismiss('OK');
	   }
   }; 
}


// delete it? already in frontend controler!
var CreateBookmarkModalCtrl2 = function ($scope, $modalInstance, BookmarkService, page, limit ) {
   
     $scope.bookmark_name = '';
            
     
     $scope.OK = function (bookmark_name) {
	     
             $scope.createBookmark(bookmark_name);
	     console.log('bookmark_name3:',bookmark_name);  
	     console.log('bookmark_name3:',$scope.bookmark_name);
	     //$modalInstance.close($scope.bookmark_name);
	     $modalInstance.dismiss('OK');
     };
     $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
     };
     $scope.hitEnter = function(evt){
    	   if(angular.equals(evt.keyCode,13)){
	         $scope.createBookmark($scope.bookmark_name);
	         console.log('enter');
	   }
     };
     

     
     $scope.createBookmark = function (bookmark_name) {
            console.log('addToBookmark:',bookmark_name);
            
            if( BookmarkService.bookmarks.indexOf(bookmark_name) == -1 ){
                 BookmarkService.bookmarks.push(bookmark_name);
	    }
	    var promise = BookmarkService.createBookmark(bookmark_name);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			//BookmarkService.bookmarks = response.data.bookmarks;
			$scope.getBookmarks(BookmarkService);
			
			console.log('createBookmark', response.data);
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		if(typeof $scope.alerts == 'undefined'){
			    $scope.alerts = [];
			}
			$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   ); 
     }
     
    $scope.getBookmarks = function () {
            console.log('addToBookmark create');
            var promise = BookmarkService.getBookmark();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			console.log('getBookmark', response.data);
			//$scope.bookmarks = response.data.bookmarks;
			BookmarkService.bookmarks = response.data.bookmarks;
			BookmarkService.updateBookmarksDisplay(BookmarkService, page, limit);
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		if(typeof $scope.alerts == 'undefined'){
			    $scope.alerts = [];
			}
			$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   ); 
  }
     
     
}