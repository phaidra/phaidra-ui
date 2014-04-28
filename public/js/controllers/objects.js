
app.controller('ObjectsCtrl',  function($scope, $modal, $location, DirectoryService, SearchService, promiseTracker) {
    
	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	
	$scope.alerts = [];
	
	$scope.objects = [];        
    
    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
    
    $scope.totalItems = 0;
    $scope.currentPage = 0;
    $scope.maxSize = 10;
    $scope.from = 1;
    $scope.limit = 10;
    $scope.sort = 'uw.general.title,SCORE';
    $scope.reverse = 0;
    $scope.uofrom = 1;
    $scope.uolimit = 10;
    $scope.uosort = 'fgs.lastModifiedDate,STRING';
    $scope.uoreverse = 0;
  
    $scope.setPage = function (page) {
    	if($scope.query){
    		if(page == 1){
    			$scope.from = 1;
    		}else{    		
    			$scope.from = (page-1)*$scope.limit+1;
    		}
    		
    		$scope.search($scope.query, $scope.from, $scope.limit, $scope.sort, $scope.reverse);
    		$scope.currentPage = page;
    	}else{
    		$scope.getUserObjects(null, $scope.uofrom, $scope.uolimit, $scope.uosort, $scope.uoreverse); // no username -> current_user    		
    	}
    };

	$scope.initdata = '';
	$scope.current_user = '';
			
	$scope.init = function (initdata) {
		$scope.initdata = angular.fromJson(initdata);
		$scope.current_user = $scope.initdata.current_user;		
    	
    	$scope.query = $scope.initdata.query;
    	if($scope.query){
    		$scope.search($scope.query, $scope.from, $scope.limit, $scope.sort, $scope.reverse);
    	}else{
    		$scope.getUserObjects(null, $scope.uofrom, $scope.uolimit, $scope.uosort, $scope.uoreverse); // no username -> current_user    		
    	}
    };

     
 $scope.getUserObjects = function(username, from, limit, sort, reverse) {
	 $scope.form_disabled = true;
     var promise = SearchService.getUserObjects(username, from, limit, sort, reverse);
     $scope.loadingTracker.addPromise(promise);
     promise.then(
      	function(response) { 
      		$scope.alerts = response.data.alerts;
      		$scope.objects = response.data.objects;
      		$scope.form_disabled = false;
      	}
      	,function(response) {
      		$scope.alerts = response.data.alerts;
      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		$scope.form_disabled = false;
      	}
     );    	      
 };   
 
 $scope.search = function(query, from, limit, sort, reverse) {
		$scope.form_disabled = true;
	    var promise = SearchService.search(query, from, limit, sort, reverse);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	     		$scope.alerts = response.data.alerts;
	     		$scope.objects = response.data.objects;
	     		$scope.totalItems = response.data.hits;
	     		$scope.form_disabled = false;
	     	}
	     	,function(response) {
	     		$scope.alerts = response.data.alerts;
	     		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	     		$scope.form_disabled = false;
	     	}
	    );    	      
	};   
       
});


