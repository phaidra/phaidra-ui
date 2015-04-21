
app.controller('ObjectsCtrl',  function($scope, $rootScope, $modal, $location, DirectoryService, SearchService, FrontendService, promiseTracker) {
    
     // we will use this to track running ajax requests to show spinner
    //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
    $scope.loadingTracker = $rootScope.loadingTracker;
    
    $scope.alerts = [];	
	
    $scope.selection = [];	 
	
    $scope.objects = [];
	
    $scope.initdata = '';
    $scope.current_user = '';
	
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.from = 1;
    $scope.limit = 10;
    $scope.sort = FrontendService.getSort();
    $scope.reverse = 0;
    
    $scope.init = function (initdata) {
		
        $scope.initdata = angular.fromJson(initdata);
	$scope.current_user = $scope.initdata.current_user;
    	
	console.log('initdata: ', $scope.initdata);
    	$scope.query = $scope.initdata.query;
    	if($scope.query){
    		$scope.search($scope.query, $scope.from, $scope.limit, $scope.sort, $scope.reverse);
    	}else{
    		$scope.getUserObjects(null, $scope.from, $scope.limit); // no username -> current_user
    	}
    	if($scope.current_user){
    		$scope.loadSelection();
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
    	
          var promise = FrontendService.getSelection();
	  $scope.loadingTracker.addPromise(promise);
	  promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
			$scope.selection = response.data.selection;
			for( var i = 0 ; i < $scope.objects.length ; i++ ){	     			
			    if( $scope.selection.indexOf($scope.objects[i].PID) == -1 ){
			         $scope.selection.push($scope.objects[i].PID);
			    }
	                 }
    	                 $scope.saveSelection();
			$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
	     );
    };

    $scope.allGoldEverything = function(event){
    	    
	    if('undefined' !== typeof $scope.query ){
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
	    }else{
	        $scope.form_disabled = true;
                var username = null; // null => using current user
	        var promise = SearchService.getUserObjects(username, 1, 0, $scope.sort, $scope.reverse);
                $scope.loadingTracker.addPromise(promise);
                promise.then(
      	            function(response) { 
	                 $scope.alerts = response.data.alerts;
			 $scope.selection = [];
			 for( var i = 0 ; i < response.data.objects.length ; i++ ){	     			
	     			$scope.selection.push(response.data.objects[i].PID);
	     		 }	
	     		 $scope.saveSelection();
      		         $scope.form_disabled = false;
      	            }
      	           ,function(response) {
      		         $scope.alerts = response.data.alerts;
      		         $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		         $scope.form_disabled = false;
      	           }
              ); 
	  }
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
    	
        //initialize previousPageObject and nextPageObject
        for( var i = 0 ; i < $scope.objects.length ; i++ ){
             if(typeof $scope.objects[i].pidExtended != 'undefined' ){
                 $scope.objects[i].pidExtended.nextPageObject = '';
                 $scope.objects[i].pidExtended.previousPageObject = '';
             }
        }
        if(page == 1){
		$scope.from = 1;
	}else{    		
		$scope.from = (page-1)*$scope.limit+1;
	}
    	if($scope.query){    		    		
    		$scope.search($scope.query, $scope.from, $scope.limit, $scope.sort, $scope.reverse);
    	}else{
    		$scope.getUserObjects(null, $scope.from, $scope.limit); // no username -> current_user    		
    	}
    	$scope.currentPage = page;
    };
			

 
     

 
 
 $scope.urlEncodePidExtended = function(pidExtended) {

      pidExtended = angular.toJson(pidExtended);
      pidExtended = encodeURIComponent(pidExtended);
      return pidExtended;
 }
 
 $scope.setPageData = function(username, from, limit, sort, reverse, query, objects) {
        	         
       console.log('objects2: ',objects);
       for( var i = 0 ; i < $scope.objects.length ; i++ ){
	         $scope.objects[i].pidExtended                  = {};
		 $scope.objects[i].pidExtended.pagePids         = [];
		 $scope.objects[i].pidExtended.pagePidsData     = [];
	         $scope.objects[i].pidExtended.pid              = $scope.objects[i].PID;
	         $scope.objects[i].pidExtended.from             = from;
	         $scope.objects[i].pidExtended.limit            = limit;
	         $scope.objects[i].pidExtended.reverse          = reverse;
	         $scope.objects[i].pidExtended.username         = username;
	         $scope.objects[i].pidExtended.query            = query;
		 $scope.objects[i].pidExtended.contentModel     = objects[i]['fgs.contentModel'];
		 $scope.objects[i].pidExtended.collectionMember = false; //not accessed as collection member
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
		// next/prev page button
		$scope.setPageData(username, from, limit, sort, reverse, null, $scope.objects);
		
		$scope.totalItems = response.data.hits;
      		$scope.form_disabled = false;
		console.log('objectsA',$scope.objects);
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
			// next/prev page button
		        var username = null;
			$scope.setPageData(username, from, limit, sort, reverse, query, $scope.objects);
			
			$scope.totalItems = response.data.hits;
	     		$scope.form_disabled = false;
			console.log('objectsB',$scope.objects);
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


