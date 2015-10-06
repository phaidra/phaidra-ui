app.controller('ViewCtrl',  function($scope, $modal, $location, DirectoryService, MetadataService, FrontendService, BookmarkService, SearchService, promiseTracker) {
  
   $scope.alerts = [];
        
   $scope.$parent.disableBookmark = false;
   $scope.bookmark_name = '';
   
   $scope.BookmarkService = BookmarkService;
   
   if(typeof BookmarkService.currentBookmarkId != 'undefined'){
         if(BookmarkService.currentBookmarkId != ''){
                  $scope.init_data.currentBookmarkId = BookmarkService.currentBookmarkId;
	 }
   }
   
   var fields = {};
   $scope.initdata = [];
   $scope.form_disabled = 1;
   $scope.fields = 1;
   
   $scope.uwmetaClassExist = 1;
   $scope.modsClassExist   = 1;
   
   $scope.sort = FrontendService.getSort();
   
   $scope.init = function (initdata) {

	  var init_data = angular.fromJson(initdata);
	  $scope.init_data = init_data;
	  console.log('init_data view: ',init_data);
	  $scope.pid = init_data.pid;
	  $scope.getDublinCore($scope.pid);
	  $scope.current_user = init_data.current_user.username;
	  BookmarkService.currentBookmarkId = $scope.init_data.currentBookmarkId;
	  
	  $scope.getBookmarks();
          
	  if(init_data.singleView != 1){ // view of single object without next and previous ...
	     if(!init_data.collectionMember){
	        if(typeof init_data.query === 'undefined' || init_data.query == null){
		      $scope.getPreviousObjNoQuery(init_data.current_user.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.query);
                      $scope.getNextObjNoQuery(init_data.current_user.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.query);
	        }else{
	              $scope.getPreviousObjQuery(init_data.current_user.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.query);
	              $scope.getNextObjQuery(init_data.current_user.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.query);
	        }
	     }else{
	         $scope.getPreviousObjColl(init_data.current_user.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.parentCollPid );
	         $scope.getNextObjColl(init_data.current_user.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.parentCollPid);
	     }
	  } 
	  //ui sortable collection
	  $scope.ownersObject = false;
	  if(init_data.owner === init_data.current_user.username){
	       $scope.ownersObject = true;
	  }
	  //content model
	  $scope.contentModelCollection = 0;
	  if(typeof $scope.init_data.contentModel != 'undefined'){
	         if($scope.init_data.contentModel == 'cmodel:Collection'){
	              $scope.contentModelCollection = 1;
	         }
	  }
	 
	  
  }
   
  $scope.getBookmarks = function () {
            var promise = BookmarkService.getBookmark();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			BookmarkService.bookmarks = response.data.bookmarks;
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		if(typeof $scope.alerts == 'undefined'){
			    $scope.alerts = [];
			}
			$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   ); 
    
  } 
   
   
  $scope.getDublinCore = function (pid) {
            var promise = MetadataService.getDublincore(pid);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			$scope.dublinCore = response.data.metadata;
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		if(typeof $scope.alerts == 'undefined'){
			    $scope.alerts = [];
			}
			$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   ); 
  }
   
   $scope.getNextObjColl = function (username, from, limit, sort, reverse, parrentPid) {
     	    var promise = SearchService.getCollectionMembers(parrentPid, from+limit, 1);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	     		$scope.alerts = response.data.alerts;
	     		var nextPageFirstObject;
			if(typeof response.data.objects != 'undefined'){
		              if(response.data.objects.length != 0){
			           if(response.data.objects[0].pid != 'undefined'){
				        nextPageFirstObject = response.data.objects[0].pid;
			           }
			      }
		        }
			$scope.init_data.nextPageFirstObject = nextPageFirstObject;
			$scope.getPagePidsColl(username, from, limit, sort, reverse, parrentPid); 
	     		$scope.form_disabled = false;
	     	}
	     	,function(response) {
	     		$scope.alerts = response.data.alerts;
	     		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	     		$scope.form_disabled = false;
	     	}
	    );
   }
   
   
   $scope.getPreviousObjColl = function (username, from, limit, sort, reverse, parrentPid) {
 
        // get last object from previous page        
       if(from != 1){
	    var promise = SearchService.getCollectionMembers(parrentPid, from-1, 1);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	     		$scope.alerts = response.data.alerts;
	     		var previousPageLastObject;
			if(typeof response.data.objects != 'undefined'){
		              if(response.data.objects.length != 0){
			           if(response.data.objects[0].pid != 'undefined'){
				        previousPageLastObject = response.data.objects[0].pid;
			           }
			      }
		        }
			$scope.init_data.previousPageLastObject = previousPageLastObject;
			$scope.getPagePidsColl(username, from, limit, sort, reverse, parrentPid); 
	     		$scope.form_disabled = false;
	     	}
	     	,function(response) {
	     		$scope.alerts = response.data.alerts;
	     		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	     		$scope.form_disabled = false;
	     	}
	    );
       	}else{
               $scope.init_data.previousPageLastObject = '';
	}
  
   }
   $scope.getPagePidsColl = function (username, from, limit, sort, reverse, parrentPid) {

            $scope.form_disabled = true;
            var promise = SearchService.getCollectionMembers(parrentPid, from, limit);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	     		$scope.alerts = response.data.alerts;
			if(typeof response.data.objects != 'undefined'){
		              if(response.data.objects.length != 0){
				   $scope.init_data.pagePids = [];
				   $scope.init_data.pagePidsData = [];
				   for( var i = 0 ; i < response.data.objects.length ; i++ ){
	     			        if(response.data.objects[i].pid != 'undefined'){
					      $scope.init_data.pagePids.push(response.data.objects[i].pid);
					      var obj = {};
					      obj.pid = response.data.objects[i].pid;
					      obj.contentModel = response.data.objects[i].cmodel;
					      $scope.init_data.pagePidsData.push(obj);
	     		                }
				   }
			      }
		         }
			 $scope.setPageExceedingPids();
	     		 $scope.form_disabled = false;
	     	}
	     	,function(response) {
	     		$scope.alerts = response.data.alerts;
	     		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	     		$scope.form_disabled = false;
	     	}
	    );
   }
   
   $scope.getPagePids = function (username, from, limit, sort, reverse, query) {
          if( $scope.init_data.query == null ){
	       var promise = SearchService.getUserObjects(username, from, limit, sort, reverse);
               $scope.loadingTracker.addPromise(promise);
	       promise.then(
      	           function(response) { 
	                 $scope.alerts = response.data.alerts;
			 if(typeof response.data.objects != 'undefined'){
		              if(response.data.objects.length != 0){
				   $scope.init_data.pagePids = [];
				   $scope.init_data.pagePidsData = [];
				   for( var i = 0 ; i < response.data.objects.length ; i++ ){
	     			        if(response.data.objects[i].PID != 'undefined'){
					      $scope.init_data.pagePids.push(response.data.objects[i].PID);
					      var obj = {};
					      obj.pid = response.data.objects[i].PID;
					      obj.contentModel = response.data.objects[i]['fgs.contentModel'];
					      $scope.init_data.pagePidsData.push(obj);
	     		                }
				   }
			      }
		         }
			 $scope.setPageExceedingPids();
      	          }
      	          ,function(response) {
      		        $scope.alerts = response.data.alerts;
      		        $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		        $scope.form_disabled = false;
      	          }
               );
   
	  }else{
	       var promise = SearchService.search(query, from, limit, sort, reverse);
               $scope.loadingTracker.addPromise(promise);
               promise.then(
      	            function(response) { 
	                  $scope.alerts = response.data.alerts;
		          if(typeof response.data.objects != 'undefined'){
		               if(response.data.objects.length != 0){
			           $scope.init_data.pagePids = [];
				   for( var i = 0 ; i < response.data.objects.length ; i++ ){	     			
	     			        if(response.data.objects[i].PID != 'undefined'){             
					      $scope.init_data.pagePids.push(response.data.objects[i].PID);
	     		                }  
				   }
			      }
		          }
		          $scope.setPageExceedingPids();
      	           }
      	          ,function(response) {
      		          $scope.alerts = response.data.alerts;
      		          $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		          $scope.form_disabled = false;
      	          }
             );
	 }
   }  
   $scope.getPreviousObjQuery = function(username, from, limit, sort, reverse, query) {
        
        // get last object from previous page 
	if(from != 1){
	        //var fields = ['PID'];
	        //(query, from, limit, sort, reverse, fields)
		var promise = SearchService.search(query, from-1, 1, sort, reverse);
                $scope.loadingTracker.addPromise(promise);
	        promise.then(
      	           function(response) { 
	                 $scope.alerts = response.data.alerts;
			 var previousPageLastObject;
			 if(typeof response.data.objects != 'undefined'){
		              if(response.data.objects.length != 0){
			           if(response.data.objects[0].PID != 'undefined'){
				        previousPageLastObject = response.data.objects[0].PID;
			           }
			      }
		         }
			 $scope.init_data.previousPageLastObject = previousPageLastObject;
			 $scope.getPagePids(username, from, limit, sort, reverse, query);
      	           }
      	           ,function(response) {
      		        $scope.alerts = response.data.alerts;
      		        $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		        $scope.form_disabled = false;
      	          }
             );
	}else{
               $scope.init_data.previousPageLastObject = '';
	}
   }
   
  $scope.getNextObjQuery = function(username, from, limit, sort, reverse, query) {
      
      // get first object from next page
      //(query, from, limit, sort, reverse, fields)
      var promise = SearchService.search(query, from+limit, 1, sort, reverse);
      $scope.loadingTracker.addPromise(promise);
      promise.then(
      	    function(response) { 
	           $scope.alerts = response.data.alerts;
      		   var nextPageFirstObject = '';
		   if(typeof response.data.objects != 'undefined'){
		         if(response.data.objects.length != 0){
			      if(response.data.objects[0].PID != 'undefined'){
				    nextPageFirstObject = response.data.objects[0].PID;
			      }
			 }
		   }
		   $scope.init_data.nextPageFirstObject = nextPageFirstObject;
		   $scope.getPagePids(username, from, limit, sort, reverse, query);
      	    }
      	    ,function(response) {
      		   $scope.alerts = response.data.alerts;
      		   $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		   $scope.form_disabled = false;
      	   }
     );
  }
   
   $scope.getPreviousObjNoQuery = function(username, from, limit, sort, reverse, query) {
        
        // get last object from previous page 
        //$scope.init_data.username = username;
        if(from != 1){
	       var promise = SearchService.getUserObjects(username, from-1, 1, sort, reverse);
               $scope.loadingTracker.addPromise(promise);
	       promise.then(
      	           function(response) { 
	                 $scope.alerts = response.data.alerts;
			 var previousPageLastObject;
			 if(typeof response.data.objects != 'undefined'){
		              if(response.data.objects.length != 0){
			           if(response.data.objects[0].PID != 'undefined'){
				        previousPageLastObject = response.data.objects[0].PID;
			           }
			      }
		         }
			 $scope.init_data.previousPageLastObject = previousPageLastObject;
			 $scope.getPagePids(username, from, limit, sort, reverse, query);
      	          }
      	          ,function(response) {
      		        $scope.alerts = response.data.alerts;
      		        $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		        $scope.form_disabled = false;
      	         }
             );
	}else{
               $scope.init_data.previousPageLastObject = '';
	}
 }
  
   $scope.getNextObjNoQuery = function(username, from, limit, sort, reverse, query) {
    
     // get first object from next page
     var promise = SearchService.getUserObjects(username, from+limit, 1, sort, reverse);
     $scope.loadingTracker.addPromise(promise);
     promise.then(
      	    function(response) { 
	           $scope.alerts = response.data.alerts;
      		   var nextPageFirstObject = '';
		   if(typeof response.data.objects != 'undefined'){
		         if(response.data.objects.length != 0){
			      if(response.data.objects[0].PID != 'undefined'){
				    nextPageFirstObject = response.data.objects[0].PID;
			      }
			 }
		   }
		   $scope.init_data.nextPageFirstObject = nextPageFirstObject;
		   $scope.getPagePids(username, from, limit, sort, reverse, query);
      	    }
      	    ,function(response) {
      		   
	           $scope.alerts = response.data.alerts;
      		   $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		   $scope.form_disabled = false;
      	   }
    );
  }
  
   $scope.setPageExceedingPids = function(){
          
          // set next and previous page button
	  for (var i = 0; i < $scope.init_data.pagePids.length; ++i){
	     if($scope.init_data.pagePids[i] == $scope.init_data.pid){
		     if( (i != 0) && (i != $scope.init_data.pagePids.length-1) ){
		          $scope.nextPagePid     = $scope.init_data.pagePids[i+1];
			  $scope.previousPagePid = $scope.init_data.pagePids[i-1];
		     }
		     if( i == 0 ){
		         $scope.nextPagePid      = $scope.init_data.pagePids[i+1];
			 $scope.previousPagePid  = $scope.init_data.previousPageLastObject;
		     }
                     if( i == $scope.init_data.pagePids.length - 1 ){
		         $scope.nextPagePid      = $scope.init_data.nextPageFirstObject;
			 $scope.previousPagePid  = $scope.init_data.pagePids[i-1];
		     }
	       }
	  }
	  if(typeof $scope.init_data.previousPageLastObject != 'undefined'){
	         if($scope.init_data.previousPageLastObject != ''){
		     if ($scope.init_data.pagePids.indexOf($scope.init_data.previousPageLastObject) == -1) {
		            $scope.init_data.pagePids.unshift($scope.init_data.previousPageLastObject);
		     }
		}
	  }
	  if(typeof $scope.init_data.nextPageFirstObject != 'undefined'){
	        if($scope.init_data.nextPageFirstObject != ''){
		    if ($scope.init_data.pagePids.indexOf($scope.init_data.nextPageFirstObject) == -1) {
		            $scope.init_data.pagePids.push($scope.init_data.nextPageFirstObject);
		    }
		}
	  }
   }
   
   
   $scope.prevPage = function(){
           
        $scope.init_data.pid = $scope.previousPagePid;
        if($scope.init_data.from != 1){
	    if( $scope.init_data.pagePids[0] == $scope.previousPagePid){
	          $scope.init_data.from = $scope.init_data.from - $scope.init_data.limit;
	    }
	}
	// set contentModel for previous page
	for (var i = 0; i < $scope.init_data.pagePidsData.length; ++i){
	    if( $scope.previousPagePid == $scope.init_data.pagePidsData[i].pid){
		  $scope.init_data.contentModel = $scope.init_data.pagePidsData[i].contentModel;
	    } 
	}
	
	$scope.init_data.pagePids = [];
	$scope.init_data.currentBookmarkId = BookmarkService.currentBookmarkId;
	var initData = angular.toJson($scope.init_data);
	initData = encodeURIComponent(initData);
	window.location = $('head base').attr('href')+'view/'+initData;
   }
   
   $scope.nextPage = function(nextPid){
        $scope.init_data.pid = $scope.nextPagePid;
	if( $scope.init_data.nextPageFirstObject == $scope.nextPagePid){
	     $scope.init_data.from = $scope.init_data.from + $scope.init_data.limit;
	}
	// set contentModel for next page
	for (var i = 0; i < $scope.init_data.pagePidsData.length; ++i){
	    if( $scope.nextPagePid == $scope.init_data.pagePidsData[i].pid){
		 $scope.init_data.contentModel = $scope.init_data.pagePidsData[i].contentModel;
	    } 
	}
	
	$scope.init_data.pagePids = [];
	$scope.init_data.currentBookmarkId = BookmarkService.currentBookmarkId;
	var initData = angular.toJson($scope.init_data);
	initData = encodeURIComponent(initData);
	window.location = $('head base').attr('href')+'view/'+initData;
   }
   
   $scope.editUwmeta = function(pid){
        window.location = $('head base').attr('href')+'uwmetadata_editor/'+pid;
   }
   $scope.editDublincore = function(pid){
        //window.location = $('head base').attr('href')+'uwmetadata_editor/'+pid;
   }
   $scope.editMods = function(pid){
        window.location = $('head base').attr('href')+'mods_editor/'+pid;
   }
   //$scope.editUwmetaClass = function(pid){
        //window.location = $('head base').attr('href')+'uwmetadata_editor/'+pid;
   //}
   //$scope.editModsClass = function(pid){
        //window.location = $('head base').attr('href')+'uwmetadata_editor/'+pid;
   //}
   
 ////////////////////////////////////////////////////////////  
   
   $scope.loadAllMeta = function(pid){
        
          if(typeof $scope.mods == 'undefined'){
                  $scope.loadMods(pid);
	  }
 	  if(typeof $scope.uwmetadata == 'undefined'){
	          $scope.loadUwmeta(pid);
	  }
  }
   

   
  $scope.loadMods = function(pid){

           if(typeof $scope.mods == 'undefined'){
		 var promise = MetadataService.getModsFromObject(pid);
                 $scope.loadingTracker.addPromise(promise);
                 promise.then(
    		        function(response) {
    			       $scope.alerts = response.data.alerts;
			       $scope.mods = response.data;
                               var valueURIs = $scope.getValueURIMods();
                               if(valueURIs != 'undefined' ){
			              if(valueURIs.length != 0){ 
			                   $scope.getClass(valueURIs, 'mods');
			              }
			       }    
    			       $scope.mods = angular.fromJson($scope.mods);
                               console.log('mods',$scope.mods);
			}
    		        ,function(response) {
           		       $scope.alerts = response.data.alerts;
           		       $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	        }
                );
		 
	  }
  }
   
   $scope.loadUwmeta = function(pid){
       if(typeof $scope.uwmetadata == 'undefined'){
	    var promise = MetadataService.getUwmetadataFromObject(pid);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
		        $scope.alerts = response.data.alerts;
			$scope.uwmetalanguages = response.data.languages;
			$scope.uwmetadata = response.data.metadata.uwmetadata;
                        var valueURIs = $scope.getValueURIUwm();
		        if(valueURIs != 'undefined' ){
			       if(valueURIs.length != 0){ 
                                         $scope.getClass(valueURIs, 'uwmeta');
			       }
			}
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   );
	}
    };
    
     
    $scope.getValueURIMods = function(){
        
         var classes = [];
         var mods = $scope.mods.metadata.mods;
         for (var i = 0; i < mods.length; ++i) {
	     if( mods[i].xmlname == 'classification'){
	         var authorityURI = (function () { return; })(); //set undefined
	         var valueURI     = (function () { return; })(); //set undefined
		 for (var j = 0; j < mods[i].attributes.length; ++j){
                      if(typeof mods[i].attributes[j].xmlname != 'undefined'){
			    if(mods[i].attributes[j].xmlname == 'authorityURI'){
			        authorityURI = mods[i].attributes[j].ui_value;
			    }
			    if(mods[i].attributes[j].xmlname == 'valueURI'){
			        valueURI = mods[i].attributes[j].ui_value;
			    }
		       }
		 }
		 if(typeof authorityURI != 'undefined'){
                        if( ( authorityURI == 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification' ) && ( typeof valueURI != 'undefined' ) ){
                               classes.push(valueURI);
                        }
                 }
	     }
	}
	return classes;
    };
    
    $scope.getValueURIUwm = function(){
        
        var classes = [];
	for (var i = 0; i < $scope.uwmetadata[6].children.length; ++i) {
	     if($scope.uwmetadata[6].children[i].xmlname == 'taxonpath'){
                  if(typeof $scope.uwmetadata[6].children[i].children != 'undefined'){
	               var authuri  = $scope.uwmetadata[6].children[i].children[$scope.uwmetadata[6].children[i].children.length-1].xmlns;   
	               var valueuri = $scope.uwmetadata[6].children[i].children[$scope.uwmetadata[6].children[i].children.length-1].ui_value;
                       if(authuri == 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification' && valueuri != ''){
                               classes.push(valueuri);
		       }
		  }
	    }
	}
	return classes;
    }
    
    
    $scope.getClass = function(valueURIs, ClassType){

	    valueURIs = angular.toJson(valueURIs);
            var promise = MetadataService.getClassificationsFromUris(valueURIs);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			if(ClassType == 'uwmeta'){
			     $scope.uwmetaClassifications = response.data.classifications;
			}
			if(ClassType == 'mods'){
			     $scope.modsClassifications = response.data.classifications;
			}
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		if(typeof $scope.alerts == 'undefined'){
			    $scope.alerts = [];
			}
			$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   ); 
    }
        
    // hacky bullshit to make the map refresh on geo tab select
    // this var is watched in geo controller
    $scope.geoTabActivated = false;
    $scope.triggerGeoTabActivated = function (){
        $scope.geoTabActivated = true;
    }

}); 

