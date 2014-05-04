
app.controller('ObjectsCtrl',  function($scope, $modal, $location, DirectoryService, SearchService, FrontendService, promiseTracker) {
    
	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	
	$scope.alerts = [];	
	
	$scope.selection = [];	 
	
	$scope.objects = [];
    
    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
    
    $scope.selectNone = function(event){
    	$scope.selection = [];	
    	$scope.saveSelection();
    };
    
    $scope.selectVisible = function(event){
    	$scope.selection = [];	
    	for( var i = 0 ; i < $scope.objects.length ; i++ ){	     			
	    	$scope.selection.push($scope.objects[i].PID);
	    }
    	$scope.saveSelection();
    };

    $scope.allGoldEverything = function(event){
    	var fields = ['PID'];
	    var promise = SearchService.search($scope.query, $scope.from, 0, $scope.sort, $scope.reverse, fields);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	     		$scope.alerts = response.data.alerts;
	     		$scope.selection = [];
	     		for( var i = 0 ; i < response.data.objects.length ; i++ ){	     			
	     			$scope.selection.push(response.data.objects[i].PID);
	     		}	
	     		$scope.saveSelection();
	     		return false;
	     	}
	     	,function(response) {
	     		$scope.alerts = response.data.alerts;
	     		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	     		return false;
	     	}
	    );   	    	    
    }
    
    $scope.saveSelection = function() {
    	var promise = FrontendService.updateSelection($scope.selection);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
	    );
    }
    
    $scope.loadSelection = function() {
    	var promise = FrontendService.getSelection();
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	      		$scope.selection = response.data.selection;
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
	    );
    }
    
    $scope.toggleObject = function(pid) {
    	var idx = $scope.selection.indexOf(pid);
    	if(idx == -1){
    		$scope.selection.push(pid);
    	}else{
    		$scope.selection.splice(idx,1);
    	}	
    	$scope.saveSelection();
    };
    
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.from = 1;
    $scope.limit = 10;
    $scope.sort = 'uw.general.title,SCORE';
    $scope.reverse = 0;
  
    $scope.setPage = function (page) {
    	if(page == 1){
			$scope.from = 1;
		}else{    		
			$scope.from = (page-1)*$scope.limit+1;
		}
    	if($scope.query){    		    		
    		$scope.search($scope.query, $scope.from, $scope.limit, $scope.sort, $scope.reverse);
    	}else{
    		$scope.getUserObjects(null, $scope.from, $scope.limit, $scope.sort, $scope.reverse); // no username -> current_user    		
    	}
    	$scope.currentPage = page;
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
    		$scope.getUserObjects(null, $scope.from, $scope.limit, $scope.sort, $scope.reverse); // no username -> current_user
    	}
    	
    	if($scope.current_user){
    		$scope.loadSelection();
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
  
  $scope.createCollection = function () {

	  var modalInstance = $modal.open({
            templateUrl: $('head base').attr('href')+'views/partials/create_collection.html',
            controller: CollModalCtrl,
            resolve: {
		      current_user: function(){
		        return $scope.current_user;
		      },
		      selection: function(){
			    return $scope.selection;
			  }
		    }
	  });
  };
 
});


