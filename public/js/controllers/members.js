
app.controller('MembersCtrl',  function($scope, $modal, $location, $timeout, DirectoryService, SearchService, ObjectService, FrontendService, promiseTracker) {
    
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
			
			// the position of the objects in the array was already updated, 	
			// but we have to manually update the 'pos' attribute
		    for(var i = 0; i < $scope.objects.length ; i++){
		    	$scope.objects[i].pos = i;						 
			}		     		

		}
		
	});
	
	
	$scope.sortableOptions = {
	    placeholder: "dragged-object",
	    update: function(e, ui) {
			$scope.order_dirty = true;	
			var itempid = $scope.objects[ui.item.sortable.index].pid;
			var newposition = ui.item.sortable.dropindex;
			var promise = ObjectService.collectionMemberPosition($scope.pid, itempid, newposition);
			$scope.loadingTracker.addPromise(promise);
			promise.then(
				function(response) { 
				   	$scope.alerts = response.data.alerts;
				   	//$scope.setPage($scope.currentPage);
				   	return false;
				}
				,function(response) {
				   	$scope.alerts = response.data.alerts;
				   	$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
				   	return false;
				}
			);
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
	     		// little hack to run the editable init after the angular digest 
	     		$timeout(function() { $('.position-editable').editable({
		     			success: function(response) {	     						
	     					$scope.setPage($scope.currentPage);	     						
		     			},
		     			error: function(response) {	   		     			
		     				$scope.alerts = response.responseJSON.alerts;
		     				return $scope.alerts[0].msg; 
		     			},
		     			emptytext: '?'
		     			})
	     		},0);				
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

$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'popup';        
});
