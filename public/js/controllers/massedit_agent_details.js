app.controller('MasseditAgentDetailsCtrl',  function($scope, $modal, $location, promiseTracker ) {
  
  //$scope.initdata = '';
  //$scope.items = [];
  $scope.itemsDisplay = [];
  $scope.maxSize = 10; // pages in paginator
  $scope.itemsPerPageNum = 10;
  
  $scope.init = function (initdata) {
        
        var re = /myQuotePhaiDra123/gi;
	//var re2 = /\n/gi;
        var items = initdata.replace(re, "'");
	
	
	
	items = items.replace(/(\r\n|\n|\r)/gm,"");
	//var items = items.replace(re2, "");
        console.log("items: ", items);
	$scope.items = angular.fromJson(items);
	console.log("items details: ", $scope.items);
	$scope.setPage(1);
        console.log("itemsDisplay: ", $scope.itemsDisplay);
        console.log("items: ", $scope.items);
    
  }
  $scope.viewChanges2 = function (pid) {
    alert();
  }
  
  
  /*$scope.setPage = function (page) {
    
	var start  = (page-1)*$scope.itemsPerPage ;
	var max = (page-1)*$scope.itemsPerPage + $scope.itemsPerPage - 1;

	$scope.itemsDisplay = [];								      
	for (var i = start; i <= max  ; i++) {
	       if('undefined' !== typeof  $scope.items[i] ){  
                          $scope.itemsDisplay.push($scope.items[i]);
	       }
        }	
  }
  */
  
  
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
    
	console.log("setPage");
        var start  = (page-1)*$scope.itemsPerPageNum ;
	var max = (page-1)*$scope.itemsPerPageNum + $scope.itemsPerPageNum - 1;							      
	console.log($scope.items);
	$scope.itemsDisplay = [];
	for (var i = start; i <= max  ; i++) {
	       if('undefined' !== typeof  $scope.items[i] ){  
                          $scope.itemsDisplay.push($scope.items[i]);
			   console.log("adding item");
	       }
        }
    }
  
});

var ViewChangesCtr = function ($scope, $modalInstance, $location, promiseTracker, items, pid) {

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