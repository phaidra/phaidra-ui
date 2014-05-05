
app.controller('MembersCtrl',  function($scope, $modal, $location, DirectoryService, SearchService, ObjectService, FrontendService, promiseTracker) {
    
	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	
	$scope.alerts = [];	
	
	$scope.selection = [];	 
	
	$scope.objects = [];
	
	$scope.pid = '';
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.from = 1;
    $scope.limit = 10;
        
	$scope.initdata = '';
	$scope.current_user = '';	
	
	$scope.order_dirty = false;		
	
	// cannot do this in ui-sortable update event because at that moment the model
	// was not yet updated, only the DOM
	$scope.$watchCollection('objects', function() { 		
		if($scope.order_dirty){
			$scope.order_dirty = false;
			// assign a pos to all objects, as they are now
			var fields = ['PID'];
			var promise = SearchService.getCollectionMembers($scope.pid, 1, 0, fields);
		    $scope.loadingTracker.addPromise(promise);
		    promise.then(
		     	function(response) {
		     		$scope.alerts = response.data.alerts;
		     		var members = [];
		     		for( var i = 0 ; i < response.data.objects.length ; i++ ){	     			
		     			members.push({ pid: response.data.objects[i].pid, pos: response.data.objects[i].pos});
		     		}	
		     		
		     		// get new positions from this page
		     		var new_pos_members = {};
		     		for(var i = 0; i < $scope.objects.length ; i++){
						var pos = i;
						if($scope.from > 1){
							pos = i + ($scope.from-1);
						}	
						new_pos_members[$scope.objects[i].pid] = pos;
						// update pos on frontend
						$scope.objects[i].pos = pos; 
					}		     		

		     		for(var i = 0; i < members.length ; i++){
		     			// if this object was repositioned, assign new position
						if(new_pos_members[members[i].pid]){
							members[i].pos = new_pos_members[members[i].pid];
						}else{
							// otherwise assign the position it ha
							members[i].pos = i;
						}						
					}		     		

					var promise = ObjectService.orderCollection($scope.pid, members);
				    $scope.loadingTracker.addPromise(promise);
				    promise.then(
				     	function(response) { 
				     		$scope.alerts = response.data.alerts;
				     		return false;
				     	}
				     	,function(response) {
				     		$scope.alerts = response.data.alerts;
				     		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
				     		return false;
				     	}
				    );
		     		
		     		return false;
		     	}
		     	,function(response) {
		     		$scope.alerts = response.data.alerts;
		     		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
		     		return false;
		     	}
		    );   
			
		}
		
	});
	
	$scope.sortableOptions = {
	    placeholder: "object",
	    update: function(e, ui) {
			$scope.order_dirty = true;			
		}
	};
  
    
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
	    	$scope.selection.push($scope.objects[i].pid);
	    }
    	$scope.saveSelection();
    };

    $scope.allGoldEverything = function(event){
    	var fields = ['PID'];
	    var promise = SearchService.getCollectionMembers($scope.pid, 1, 0, fields);
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
  
    $scope.setPage = function (page) {
    	if(page == 1){
			$scope.from = 1;
		}else{    		
			$scope.from = (page-1)*$scope.limit+1;
		}
    	    		    		
    	$scope.getCollectionMembers($scope.pid, $scope.from, $scope.limit);
    	
    	$scope.currentPage = page;
    };

	$scope.init = function (initdata) {
		$scope.initdata = angular.fromJson(initdata);
		$scope.current_user = $scope.initdata.current_user;
		$scope.pid = $scope.initdata.pid;
		$scope.owner = $scope.initdata.owner;
    	
    	$scope.query = $scope.initdata.query;
    	$scope.getCollectionMembers($scope.pid, $scope.from, $scope.limit);
    	
    	if($scope.current_user){
    		$scope.loadSelection();
    	}
    	
    };
   
 
 $scope.getCollectionMembers = function(pid, from, limit) {
		$scope.form_disabled = true;
	    var promise = SearchService.getCollectionMembers(pid, from, limit);
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


