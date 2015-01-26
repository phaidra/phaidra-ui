app.controller('MasseditJobsDetailsCtrl',  function($scope, $modal, promiseTracker, FrontendService, Massedit ) {
  
  $scope.itemsDisplay = [];
  $scope.maxSize = 10; // pages in paginator
  Massedit.limit = 10; // records on page
  $scope.itemsPerPageNum = 10; // records on page
  $scope.sortOrder = 0;
  $scope.currentPageInPaginator = '';
  $scope.titleDisplay = true;
  $scope.jobId = '';
  $scope.refreshInterval = 7000;
  
  $scope.init = function (initdata) {
        
        var re = /myQuotePhaiDra123/gi;
        var items = initdata.replace(re, "'");
	items = items.replace(/(\r\n|\n|\r)/gm,"");
	$scope.items = angular.fromJson(items);
	//get jobId
	for(var i = $scope.items.length - 1; i >= 0; i--){
	      if('undefined' !== typeof  $scope.items[i].jobId ){
		     $scope.jobId = $scope.items[i].jobId;
		     $scope.items.splice(i, 1);
	      }  
	}
	$scope.setPage(1);
	setInterval($scope.getNewAlerts, $scope.refreshInterval);
  }
  
  $scope.viewChanges = function (pid) {
   
             var modalInstance = $modal.open({
             templateUrl: $('head base').attr('href')+'views/partials/massedit/agent_details/viewChanges.html',
	     controller: ViewChangesCtr,
             resolve: {
		        pid: function(){
			    return pid;
	                },
			items: function(){
			    return $scope.items;
	                }
	              }
            });  
  };
  
  $scope.itemsPerPage = function (itemsPerPage) { 
      
       $scope.itemsPerPageNum = itemsPerPage;
       Massedit.limit = itemsPerPage;
       $scope.setPage(1);
  }
  
  $scope.setPage = function (page) {
          
	$scope.currentPageInPaginator = page;
	var start  = (page-1)*$scope.itemsPerPageNum ;
	var max = (page-1)*$scope.itemsPerPageNum + $scope.itemsPerPageNum - 1;							      
	$scope.itemsDisplay = [];
	for (var i = start; i <= max  ; i++) {
	       if('undefined' !== typeof  $scope.items[i] ){  
                          $scope.itemsDisplay.push($scope.items[i]);
	       }
        }
	if($scope.titleDisplay){
	      $scope.getTitles();
	}	
    }
    
    $scope.getTitles = function () {
      	
	Massedit.titleDisplay = $scope.titleDisplay;
	Massedit.datastructure = $scope.items;
	Massedit.updateDataStructureDisplay($scope.currentPageInPaginator, Massedit);
	for( var i = 0 ; i < $scope.itemsDisplay.length ; i++ ){
	      for( var j = 0 ; j < Massedit.datastructuredisplay.length ; j++ ){
		     if($scope.itemsDisplay[i].PID == Massedit.datastructuredisplay[j].PID){
		           $scope.itemsDisplay[i].title = Massedit.datastructuredisplay[j].title;
		     }
	      }
	} 
    }
    
    $scope.displayTitle = function () { 
    
         if($scope.titleDisplay == true){
    	        $scope.titleDisplay = false;
         }else{
    		$scope.titleDisplay = true;
    	 }
    	 if($scope.titleDisplay){
	      $scope.getTitles();
	 }
    }
    
    $scope.sortIdClick = function() {  
	  
         //  ascending = 1, descending = 0
	 if($scope.sortOrder == 1){
    		    $scope.items.sort($scope.compareRecordsId);
		    $scope.sortOrder = 0;
    	 }else{
    		    $scope.items.sort($scope.compareRecordsId);
		    $scope.items.reverse();
		    $scope.sortOrder = 1;
    	 }	 
	 $scope.setPage($scope.currentPageInPaginator);
    };
    
    $scope.sortTitleClick = function() {  
	  
         //  ascending = 1, descending = 0
	 if($scope.sortOrder == 1){
    		    $scope.items.sort($scope.compareTitlesId);
		    $scope.sortOrder = 0;
    	 }else{
    		    $scope.items.sort($scope.compareTitlesId);
		    $scope.items.reverse();
		    $scope.sortOrder = 1;
    	 }	 
	 $scope.setPage($scope.currentPageInPaginator);
    };
    
   $scope.compareTitlesId = function(a,b) { 
         
       if (a.title < b.title)  return -1;
       if (a.title > b.title)   return 1;
       return 0;
    };
    
    $scope.compareRecordsId = function(a,b) {
         
       var numberA = a.PID.slice(2); // remove 'o:'
       var numberB = b.PID.slice(2);
       if (parseInt(numberA, 10) < parseInt(numberB, 10))  return -1;
       if (parseInt(numberA, 10) > parseInt(numberB, 10))  return 1;
       return 0;
    };
    
    $scope.getNewAlerts = function () { 
      
            var promise =  FrontendService.MEjobsDetailsRefreshAlerts($scope.jobId);
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
            $scope.loadingTracker.addPromise(promise); 
            promise.then(
                  function(response) { 
                         var refreshedItems = response.data.refreshedItems;
                         $scope.refreshAlerts(refreshedItems);
			  $scope.alerts = response.data.alerts;
                         $scope.form_disabled = false;
                  }
                  ,function(response) {
                         $scope.alerts = response.data.alerts;
                         if(typeof($scope.alerts) != "undefined"){
                             $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                         }
                         $scope.form_disabled = false;
                 }
           );
    }
    
    $scope.refreshAlerts = function (refreshedItems) { 
      
          for( var i = 0 ; i < $scope.items.length ; i++ ){
	         for( var j = 0 ; j < refreshedItems.length ; j++ ){
		        if($scope.items[i].PID == refreshedItems[j].PID){
			      $scope.items[i].alerts = refreshedItems[j].alerts;
			}
		 }
	  }     
    }
    
    
});

var ViewChangesCtr = function ($scope, $modalInstance, promiseTracker, items, pid) {

      $scope.changes = [];
      $scope.PID = pid; 
      for( var i = 0 ; i < items.length ; i++ ){
	   if(items[i].PID == pid){
	        $scope.changes = items[i].changes;
	   }
      }
  
      $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
       
      $scope.close = function () {
		$modalInstance.dismiss('cancel');
      };
   
       
}; 