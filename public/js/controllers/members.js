app.controller('MembersCtrl',  function($scope, $rootScope, $modal, $location, $timeout, DirectoryService, SearchService, BookmarkService, ObjectService, FrontendService, promiseTracker) {
    
    
    // we will use this to track running ajax requests to show spinner
    //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
    $scope.loadingTracker = $rootScope.loadingTracker;
    $scope.alerts = [];	
	
    $scope.selection = [];	 
	
    $scope.objects_m = [];
	
    $scope.pid = '';
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.from = 1;
    $scope.limit = 10;
    
    $scope.ownersObject = 0;
    
    $scope.initdata = '';
    $scope.current_user = '';	
    $scope.sort = FrontendService.getSort();
    $scope.reverse = 0;
    
    $scope.order_dirty = false;		
	
    $scope.initCollection = function (initdata) {
    //$scope.init = function (initdata) {
	$scope.initdata = angular.fromJson(initdata);
	
	// url decode dot and dash
	$scope.baseurl = $scope.initdata.baseurl;
	var regex = new RegExp('%2E', "g");
	$scope.baseurl = $scope.baseurl.replace(regex, ".");
	$scope.baseurl = $scope.baseurl.replace("%2D","-");
	
	$scope.current_user = $scope.initdata.current_user;
	$scope.currentBookmarkId = $scope.initdata.currentBookmarkId;	
	
	$scope.pid = $scope.initdata.pid;
	$scope.owner = $scope.initdata.owner;
		
    	$scope.query = $scope.initdata.query;
    	$scope.getCollectionMembers($scope.pid, $scope.from, $scope.limit);
    	
	$scope.ownersObject = 0;
	if($scope.initdata.owner == $scope.initdata.current_user.username){
	   $scope.ownersObject = 1;
	}
	
    	if($scope.current_user){
    		$scope.loadSelection();
    	}
    };
    
	// cannot do this in ui-sortable update event because at that moment the model
	// was not yet updated, only the DOM
	
	$scope.$watchCollection('objects_m', function() { 	
		if($scope.order_dirty){
	               $scope.order_dirty = false;
			// the position of the objects in the array was already updated,
			// but we have to manually update the 'pos' attribute
		       for(var i = 0; i < $scope.objects_m.length ; i++){
		    	     $scope.objects_m[i].pos = ($scope.from-1)+i;
		       }	
		}
		
	});
	
	
	$scope.sortableOptions = {
	    placeholder: "dragged-object",
	    update: function(e, ui) {
			if(!$scope.ownersObject){
			   ui.item.sortable.cancel();
			   return;
			}
	                 $scope.order_dirty = true;	
			var itempid = $scope.objects_m[ui.item.sortable.index].pid;
			var newposition = ui.item.sortable.dropindex+($scope.from-1);
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
    	for( var i = 0 ; i < $scope.objects_m.length ; i++ ){	     			
	    	$scope.selection.push($scope.objects_m[i].pid);
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
	     			$scope.selection.push(response.data.objects[i].pid);
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


    
  /*  
  $scope.urlEncodePidExtended = function(pidExtended) {
      //alert(BookmarkService.currentBookmarkId);
      
      pidExtended.currentBookmarkId = BookmarkService.currentBookmarkId;
      pidExtended = angular.toJson(pidExtended);
      pidExtended = encodeURIComponent(pidExtended);
      return pidExtended;
 }  
 */
 
  $scope.viewObject = function(pidExtended) {

       pidExtended.currentBookmarkId = BookmarkService.currentBookmarkId;
       pidExtended = angular.toJson(pidExtended);
       pidExtended = encodeURIComponent(pidExtended);
       window.location = $('head base').attr('href')+'view/'+pidExtended;
  }
 
 
  $scope.setPageData = function(username, from, limit, sort, reverse, query, objects) {
        	         
       for( var i = 0 ; i < $scope.objects_m.length ; i++ ){
	         $scope.objects_m[i].pidExtended                   = {};
		 $scope.objects_m[i].pidExtended.pagePids          = [];
		 $scope.objects_m[i].pidExtended.pagePidsData      = [];
	         $scope.objects_m[i].pidExtended.pid               = $scope.objects_m[i].pid;
	         $scope.objects_m[i].pidExtended.from              = from;
	         $scope.objects_m[i].pidExtended.limit             = limit;
	         $scope.objects_m[i].pidExtended.reverse           = reverse;
	         $scope.objects_m[i].pidExtended.username          = username;
	         $scope.objects_m[i].pidExtended.query             = query;
		 //$scope.objects_m[i].pidExtended.contentModel    = objects[i]['fgs.contentModel'];
		 $scope.objects_m[i].pidExtended.contentModel      = objects[i].cmodel;
		 $scope.objects_m[i].pidExtended.collectionMember  = true; //not accessed as collection member
	         $scope.objects_m[i].pidExtended.parentCollPid     = $scope.pid;
		 $scope.objects_m[i].pidExtended.currentBookmarkId = $scope.currentBookmarkId;
	}
 };     
    
    
    
 $scope.getCollectionMembers = function(pid, from, limit) {
	    $scope.form_disabled = true;
	    var promise = SearchService.getCollectionMembers(pid, from, limit);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	     		$scope.alerts = response.data.alerts;
	     		$scope.objects_m = response.data.objects;
			$scope.setPageData($scope.current_user, from, limit, $scope.sort, $scope.reverse, null, $scope.objects_m);
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

/*
$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'popup';        
});
*/