
app.controller('ObjectsCtrl',  function($scope, $modal, $location, DirectoryService, SearchService, promiseTracker) {
    
	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	
	$scope.alerts = [];
	
	$scope.objects = [];        
    
    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
            
	$scope.initdata = '';
	$scope.current_user = '';
			
	$scope.init = function (initdata) {
		$scope.initdata = angular.fromJson(initdata);
		$scope.current_user = $scope.initdata.current_user;		
    	$scope.getUserObjects();    	
    };

     
 $scope.getUserObjects = function() {
	 $scope.form_disabled = true;
     var promise = SearchService.getUserObjects();
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
       
});


