app.controller('MasseditJobsDetailsCtrl',  function($scope, $modal, promiseTracker, Massedit ) {
  
  $scope.itemsDisplay = [];
  $scope.maxSize = 10; // pages in paginator
  $scope.itemsPerPageNum = 10;
  $scope.sortOrder = 0;
  $scope.currentPageInPaginator = '';
  $scope.titleDisplay = true;
  
  $scope.init = function (initdata) {
        
        var re = /myQuotePhaiDra123/gi;
        var items = initdata.replace(re, "'");
	items = items.replace(/(\r\n|\n|\r)/gm,"");
	$scope.items = angular.fromJson(items);
	$scope.setPage(1);
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
	Massedit.updateDataStructureDisplay($scope.currentPageInPaginator, Massedit, $scope.maxSize );
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