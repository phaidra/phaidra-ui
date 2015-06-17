app.controller('BookmarkPidEditorCtrl',  function($scope, $modal, $location, BookmarkService, MetadataService, promiseTracker){
  
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
	BookmarkService.bookmarkPids = $scope.initdata.pids;
	$scope.bookmarkPids = BookmarkService.bookmarkPids;
	$scope.bookmarkName = $scope.initdata.bookmarkName;
	$scope.bookmarkId   = $scope.initdata.bookmarkId;
        for (var i = 0; i <= $scope.limit-1 ; i++) {
	     //if('undefined' !== typeof $scope.bookmarks[i] ){
	     if('undefined' !== typeof BookmarkService.bookmarkPids && BookmarkService.bookmarkPids != null){
                  if('undefined' !== typeof BookmarkService.bookmarkPids[i] ){
                        //$scope.bookmarksdisplay.push($scope.bookmarks[i]);
                        BookmarkService.bookmarkpidsdisplay.push(BookmarkService.bookmarkPids[i]);
                 }
	     }
	}
	console.log('init BookmarkService.bookmarkpidsdisplay: ',BookmarkService.bookmarkpidsdisplay);
   }
   
    $scope.deleteBookmarkPid = function (pid) {
            var promise = BookmarkService.deleteBookmarkPid($scope.bookmarkId, pid);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			BookmarkService.bookmarkPids = response.data.bookmarkPids;
			BookmarkService.updateBookmarkPidsDisplay(BookmarkService, $scope.currentPage, $scope.limit);
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
   
   
   $scope.deleteAllBookmarkPid = function () {

          var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/modals/bookmark/delete_all_bookmark.html',
                  controller: DeleteAllBookmarkPidCtrl,
		  resolve: {
                            text: function(){
                                       return 'Are you sure you want to delete all objects in bookmark?';
                                           },
	                    bookmarkId: function(){
                                       return $scope.bookmarkId;
                                           }
                             },
             });
     } 
   
  $scope.setPage = function (page) {
       
       $scope.currentPage = page;
       
       var start  = (page-1)*$scope.limit ;
       var max = (page-1)*$scope.limit + $scope.limit - 1;
       BookmarkService.bookmarkpidsdisplay = [];
       for (var i = start; i <= max  ; i++) {
	     //if('undefined' !== typeof $scope.bookmarks[i] ){
	     if('undefined' !== typeof BookmarkService.bookmarkPids[i] ){
                     //$scope.bookmarksdisplay.push($scope.bookmarks[i]);
                     BookmarkService.bookmarkpidsdisplay.push(BookmarkService.bookmarkPids[i]);
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
    		    BookmarkService.bookmarkPids.sort($scope.compareRecordsPID);
		    $scope.sortOrder = 0;
    	 }else{
    		    BookmarkService.bookmarkPids.sort($scope.compareRecordsPID);
		    BookmarkService.bookmarkPids.reverse();
		    $scope.sortOrder = 1;
    	 }
	 BookmarkService.updateBookmarkPidsDisplay(BookmarkService, $scope.currentPage, $scope.limit);
  };

  $scope.compareRecordsPID = function(a,b) {
         
       var numberA = a.slice(2); // remove o:
       var numberB = b.slice(2);
       if (parseInt(numberA, 10) < parseInt(numberB, 10))  return -1;
       if (parseInt(numberA, 10) > parseInt(numberB, 10))  return 1;
       return 0;
    };
    
  $scope.viewPid = function(pid) {
   	
    
            var promise = MetadataService.getUwmetadataFromObject(pid);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			console.log(response.data);
			//MetadataService.bookmarkPids = [];
			//MetadataService.bookmarkpidsdisplay = [];
    		}                     
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		if(typeof $scope.alerts == 'undefined'){
			    $scope.alerts = [];
			}
			$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   ); 
       
    /*
        console.log('viewPid',$scope.initdata);
	console.log('viewPid pid',pid);
        var init_data = {};
	init_data.pid = pid;
	init_data.pagePidsData = [];
	init_data.pagePids = [];
	init_data.previousPageLastObject = '';
	init_data.nextPageFirstObject = '';
	init_data.singleView = 1;
	//alert(init_data);
	init_data = angular.toJson(init_data);
	init_data = encodeURIComponent(init_data);
	window.location = $('head base').attr('href')+'view/'+init_data; 
	*/
  }
    
});

var DeleteAllBookmarkPidCtrl = function ($scope, $modalInstance, BookmarkService, bookmarkId, text ) {
  
  $scope.text = text;  
  $scope.deleteAllBookmarkPid = function () {
            var promise = BookmarkService.deleteAllBookmarkPid(bookmarkId);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			BookmarkService.bookmarkPids = [];
			BookmarkService.bookmarkpidsdisplay = [];
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
          $scope.deleteAllBookmarkPid();
	  $modalInstance.dismiss('OK');
   };
   $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
   };
   $scope.hitEnter = function(evt){
    	   if(angular.equals(evt.keyCode,13)){
	          $scope.deleteAllBookmarkPid();
                  $modalInstance.dismiss('OK');
	   }
   }; 
   
}