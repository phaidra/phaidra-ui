app.controller('ViewCtrl',  function($scope, $modal, $location, DirectoryService, MetadataService, FrontendService, BookmarkService, SearchService, promiseTracker) {
  
   $scope.bookmark_name = '';
   
   $scope.BookmarkService = BookmarkService;
   
   
   if(typeof BookmarkService.currentBookmarkId != 'undefined'){
         $scope.init_data.currentBookmarkId = BookmarkService.currentBookmarkId;
   }
   
   
   
   var fields = {};
   $scope.initdata = [];
   $scope.form_disabled = 1;
   $scope.fields = 1;
   
   $scope.uwmetaClassExist = 1;
   $scope.modsClassExist   = 1;
   
   $scope.sort = FrontendService.getSort();
   
   // https://phaidra-sandbox.univie.ac.at/preview/o:5131
   // https://phaidra-sandbox.univie.ac.at/preview/o:64890
   //min-height: 580px;
   
   $scope.init = function (initdata) {

          //TODO  implement it over api when api ready (dublincore)
	  var dcJson = ' {"dc":{"author":{"ui_value": "Pichler, P. (Philipp)"},"contributor": {"ui_value": " Pichler, P. (Philipp)"},"contributor": {"ui_value": "Pichler, P. (Philipp)"},"title": {"ui_value": " Öşk, Öşk-Kloster","lang": "deu"},"type": {"ui_value": "Image"},"format": {"ui_value":  " image/tiff"}} }';
          $scope.dublinCore = angular.fromJson(dcJson);
          console.log('dublinCore: ', $scope.dublinCore);
	  var init_data = angular.fromJson(initdata);
	  $scope.init_data = init_data;
	  console.log('init_data2: ',init_data);
	  $scope.pid = init_data.pid;
	  $scope.current_user = init_data.current_user.username; 
	  //console.log('currentBookmarkId', $scope.init_data.currentBookmarkId);
	  BookmarkService.currentBookmarkId = $scope.init_data.currentBookmarkId;
	  
	  $scope.getBookmarks();

	  console.log('query:',init_data.query);
	  if(!init_data.collectionMember){
	        if(typeof init_data.query === 'undefined' || init_data.query == null){
	              $scope.init_data.username = '';

		      $scope.getPreviousObjNoQuery(init_data.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.query);
	              $scope.getNextObjNoQuery(init_data.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.query);
	        }else{
	              $scope.getPreviousObjQuery(init_data.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.query);
	              $scope.getNextObjQuery(init_data.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.query);
	        }
	  }else{
	         $scope.getPreviousObjColl(init_data.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.parentCollPid );
	         $scope.getNextObjColl(init_data.username, init_data.from, init_data.limit, $scope.sort, init_data.reverse, init_data.parentCollPid);
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
            console.log('addToBookmark');
            var promise = BookmarkService.getBookmark();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			console.log('getBookmark', response.data);
			//$scope.bookmarks = response.data.bookmarks;
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
       console.log('getPreviousObjColl:',username,' : ', from,' : ', limit,' : ', sort,' : ', reverse,' : ',parrentPid);
       console.log('pid: ', $scope.pid);
       
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
	     		console.log('response.data.objects11: ', response.data.objects);
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
		         console.log('init_data.pagePids11: ', $scope.init_data.pagePids);
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
        $scope.init_data.username = username;
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
        $scope.init_data.username = username;
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
   
   
   $scope.prevPage = function(prevPid){
           
        $scope.init_data.pid = $scope.previousPagePid;
        if($scope.init_data.from != 1){
	    if( $scope.init_data.pagePids[0] == prevPid){
	          $scope.init_data.from = $scope.init_data.from - $scope.init_data.limit;
	    }
	}
	// set contentModel for previous page
	for (var i = 0; i < $scope.init_data.pagePidsData.length; ++i){
	    if( prevPid == $scope.init_data.pagePidsData[i].pid){
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
	//$scope.init_data.pagePids
	if( $scope.init_data.nextPageFirstObject == nextPid){
	     $scope.init_data.from = $scope.init_data.from + $scope.init_data.limit;
	}
	// set contentModel for next page
	for (var i = 0; i < $scope.init_data.pagePidsData.length; ++i){
	    if( nextPid == $scope.init_data.pagePidsData[i].pid){
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
        //window.location = $('head base').attr('href')+'uwmetadata_editor/'+pid;
   }
   $scope.editUwmetaClass = function(pid){
        //window.location = $('head base').attr('href')+'uwmetadata_editor/'+pid;
   }
   $scope.editModsClass = function(pid){
        //window.location = $('head base').attr('href')+'uwmetadata_editor/'+pid;
   }
 ////////////////////////////////////////////////////////////  
   $scope.loadAllMeta = function(pid){
        
          if(typeof $scope.mods == 'undefined'){
              $scope.loadMods(pid);
	  }
 	  if(typeof $scope.uwmetadata == 'undefined'){
	      $scope.loadUwmeta(pid);
	  }
  }
   
  
   $scope.createBookmark = function(){
           
          var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/partials/bookmark/create_bookmark.html',
                     controller: CreateBookmarkModalCtrl,                     
          });
   }
  $scope.addToBookmark = function(){
           
          var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/partials/bookmark/add_to_bookmark.html',
                     controller: AddToBookmarkModalCtrl,
		     resolve: {	  
                           currentBookmarkId: function(){
                                         return BookmarkService.currentBookmarkId;
                                           },
                           pid: function(){
                                         return $scope.pid;
                                           },	  
                           }
		     
          });
   }
   
  $scope.addToCurrentBookmark = function(){
     
       if(typeof BookmarkService.currentBookmarkId == 'undefined' ){
	      var modalInstance = $modal.open({
                   templateUrl: $('head base').attr('href')+'views/partials/popup_alert.html',
                   controller: AddToCurrentBookmarkCtrl,
		  resolve: {
                            text: function(){
                                       return 'Plese select bookmark first?';
                                           },
                             },
             });
       }else{
	    var pidJson = angular.toJson($scope.pid);
            var currentBookmarkIdJson = angular.toJson(BookmarkService.currentBookmarkId);
            console.log('pidJson, currentBookmarkIdJson: ',pidJson, ' : ',currentBookmarkIdJson );
	    var promise = BookmarkService.addToBookmark(pidJson, currentBookmarkIdJson);
            $scope.loadingTracker.addPromise(promise);
            promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			console.log('createBookmark', response.data);
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
  }
   
   
  $scope.editBookmark = function(){
     
     window.location = $('head base').attr('href')+'bookmark/edit';
  }
   
   
  //TODO implement it over api when api ready (currently reading mods classification from bag mongodb collection and adding mods here directly as text)
  $scope.loadMods = function(pid){
          
          if(typeof $scope.mods == 'undefined'){
		 var promise = MetadataService.getModsFromObjectTest(pid);
                 $scope.loadingTracker.addPromise(promise);
                 promise.then(
    		        function(response) {
    			       $scope.alerts = response.data.alerts;
			       $scope.mods = response.data;
			       //console.log('mods: ', $scope.mods);
			       $scope.valueURIs = $scope.getValueURIMods();
			       if($scope.valueURIs != 'undefined' ){
			              if($scope.valueURIs.length != 0){ 
			                   $scope.getClass($scope.valueURIs, 'mods');
			              }
			       }    
			       //temporary
			
			      $scope.mods = '{ "alerts":[ ], "vocabularies":{ "authority_name_title":[ "abne", "banqa", "bibalex", "conorsi", "gkd", "gnd", "hapi", "hkcan", "lacnaf", "naf", "nalnaf", "nlmnaf", "nznb", "sanb", "viaf", "ulan", "unbisn" ], "authority_relator_role":[ "marcrelator" ], "type_1":[ "abbreviated", "translated", "alternative", "uniform" ], "type_2":[ "personal", "corporate", "conference", "family" ], "type_3":[ "date", "family", "given", "termsOfAddress" ], "type_4":[ "code", "text" ], "type_5":[ "class", "work type", "style" ], "item_type":[ "preceding", "succeeding", "original", "host", "constituent", "series", "otherVersion", "otherFormat", "isReferencedBy", "references", "reviewOf" ], "identifier_type":[ "hdl", "doi", "isbn", "isrc", "ismn", "issn", "issue number", "istc", "lccn", "local", "matrix number", "music publisher", "music plate", "sici", "uri", "upc", "videorecording identifier", "stock number" ], "location_type":[ "current", "discovery", "former", "creation" ], "yes":[ "yes" ], "no":[ "no" ], "primary":[ "primary" ], "authority_genre_form":[ "alett", "amg", "barngf", "bgtchm", "cjh", "dct", "estc", "fbg", "fgtpcm", "ftamc", "gatbeg", "gmd", "gmgpc", "gnd", "gsafd", "gtlm", "isbdcontent", "isbdmedia", "lcgft", "marccategory", "marcform", "marcgt", "marcsmd", "migfg", "mim", "muzeukv", "nbdbgf", "ngl", "nimafc", "nmc", "proysen", "radfg", "rbbin", "rbgenr", "rbpap", "rbpri", "rbprov", "rbpub", "rbtyp", "rdacarrier", "rdacontent", "rdamedia", "reveal", "rvmgf", "saogf", "sgp", "tgfbne" ], "type_of_resource":[ "text", "cartographic", "notated music", "sound recording-musical", "sound recording-nonmusical", "sound recording", "still image", "moving image", "three dimensional object", "software, multimedia", "mixed material" ], "event_type":[ "production", "publication", "distribution", "manufacture" ], "thority":[ "marcgac", "marccountry", "iso3166" ], "date_encoding":[ "w3cdtf", "iso8601", "marc", "edtf", "temper" ], "date_point":[ "start", "end" ], "date_qualifier":[ "approximate", "inferred", " questionable" ], "issuance":[ "continuing", "monographic", "single unit", "multipart monograph", "serial", "integrating resource" ], "description_form_type":[ "material", "technique" ], "frequency":[ "marcfrequency" ], "language_authority":[ "iso639-2b", "rfc3066", "iso639-3", "rfc4646", "rfc5646" ], "reformatting_quality":[ "access", "preservation", "replacement" ], "digital_origin":[ "born digital", "reformatted digital", "digitized microfilm", "digitized other analog" ], "physdesc_note_type":[ "condition", "marks", "medium", "organization", "physical description", "physical details", "presentation", "script", "support", "technique" ], "abstract_type":[ "review", "scope", "content" ], "toc_type":[ "incomplete contents", "partial contents" ], "target_authority":[ "marctarget" ], "note_type":[ "accrual method", "accrual policy", "acquisition", "action", "additional physical form", "admin", "bibliographic history", "bibliography", "biographical/historical", "citation/reference", "conservation history", " content", "creation/production credits", "date", "exhibitions", "funding", "handwritten", "language", "numbering", "date/sequential designation", "original location", "original version", "ownership", "performers", "preferred citation", "publications", "reproduction", "restriction", "source characteristics", "source dimensions", "source identifier", "source note", "source type", "statement of responsibility", "subject completeness", "system details", "thesis", "venue", "version identification" ], "subject_authority":[ "aass", "aat", "abne", "aedoml", "afo", "agrifors", "agrovoc", "agrovocf", "agrovocs", "afset", "aiatsisl", "aiatsisp", "aiatsiss", "aktp", "albt", "allars", "apaist", "asft", "asrcrfcd", "asrcseo", "asrctoa", "asth", "atg", "atla", "aucsh", "barn", "bella", "bet", "bhammf", "bhashe", "bhb", "bib1814", "bibalex", "biccbmc", "bicssc", "bidex", "bisacmt", "bisacrt", "bisacsh", "bjornson", "blcpss", "blmlsh", "blnpn", "bt", "cabt", "cash", "ccsa", "cct", "ccte", "cctf", "cdcng", "ceeus", "chirosh", "cht", "ciesiniv", "cilla", "collett", "conorsi", "csahssa", "csalsct", "csapa", "csh", "csht", "cstud", "czmesh", "czenas", "dcs", "ddcri", "ddcrit", "ddcut", "dissao", "dit", "dltlt", "dltt", "drama", "dtict", "ebfem", "eclas", "eet", "eflch", "eks", "embne", "emnmus", "ept", "erfemn", "ericd", "est", "eum", "eurovocen", "eurovocsl", "fast", "finmesh", "fire", "fmesh", "fnhl", "francis", "fssh", "galestne", "gccst", "gem", "geonet", "georeft", "gnd", "gnis", "gst", "gtt", "hamsun", "hapi", "helecon", "henn", "hkcan", "hlasstg", "hoidokki", "hrvmesh", "huc", "humord", "ibsen", "ica", "icpsr", "idas", "idsbb", "idszbz", "idszbzes", "idszbzna", "idszbzzg", "idszbzzh", "idszbzzk", "iescs", "iest", "ilpt", "inist", "inspect", "ipat", "ipsp", "isis", "itglit", "itrt", "jhpb", "jhpk", "jlabsh", "juho", "jupo", "jurivoc", "kaa", "kao", "kassu", "kauno", "kaunokki", "kdm", "khib", "kito", "kitu", "kkts", "koko", "kssbar", "kta", "kto", "ktpt", "ktta", "kula", "kulo", "kupu", "lacnaf", "lapponica", "larpcal", "lcac", "lcdgt", "lcsh", "lcshac", "lcstt", "lctgm", "lemac", "lemb", "liito", "liv", "lnmmbr", "local", "ltcsh", "lua", "maaq", "mao/tao", "mar", "masa", "mech", "mero", "mesh", "mipfesd", "mmm", "mpirdes", "msc", "msh", "mtirdes", "musa", "muso", "muzeukc", "muzeukn", "muzvukci", "naf", "nal", "nalnaf", "nasat", "nbdbt", "nbiemnfag", "ncjt", "ndlsh", "netc", "nicem", "nimacsc", "nlgaf", "nlgkk", "nlgsh", "nlmnaf", "no-ubo-mr", "noraf", "noubojur", "noram", "norbok", "noubomn", "nsbncf", "nskps", "ntcpsc", "ntcsd", "ntids", "ntissc", "nzggn", "nznb", "odlt", "ogst", "opms", "ordnok", "pascal", "pepp", "peri", "pha", "pmbok", "pmcsg", "pmont", "pmt", "poliscit", "popinte", "pkk", "precis", "prvt", "psychit", "puho", "qlsp", "qrma", "qrmak", "qtglit", "quiding", "ram", "rasuqam", "renib", "reo", "rero", "rerovoc", "rma", "rpe", "rswk", "rswkaf", "rugeo", "rurkp", "rvm", "samisk", "sanb", "sao", "sbiao", "sbt", "scbi", "scgdst", "scisshl", "scot", "sears", "sfit", "sgc", "sgce", "shbe", "she", "shsples", "sigle", " sipri", "sk", "skon", "slem", "smda", "snt", "socio", "solstad", "sosa", "spines", "ssg", "stw", "swd", "swemesh", "taika", "tasmas", "taxhs", "tbjvp", "tekord", "tero", "tesa", "test", "tgn", "thesoz", "tha", "tho", "thub", "tisa", "tlka", "tlsh", "trt", "trtsa", "tsht", "tsr", "ttka", "ttll", "tucua", "udc", "ukslc", "ulan", "umitrist", "unbisn", "unbist", "unescot", "usaidt", "valo", "vcaadu", "vffyl", "vmj", "waqaf", "watrest", "wgst", "wot", "wpicsh", "ysa", "yso" ], "classification_authority":[ "accs", "acmccs", "agricola", "agrissc", "anscr", "ardocs", "asb", "azdocs", "bar", "bcl", "bcmc", "bisacsh", "bkl", "bliss", "blissc", "blsrissc", "cacodoc", "cadocs", "ccpgq", "celex", "chfbn", "clc", "clutscny", "codocs", "cslj", "cstud", "cutterec", "ddc", "dopaed", "egedeklass", "ekl", "farl", "farma", "fcps", "fiaf", "finagri", "flarch", "fldocs", "frtav", "gadocs", "gfdc", "ghbs", "iadocs", "ics", "ifzs", "inspec", "ipc", "jelc", "kab", "kfmod", "kktb", "knt", "ksdocs", "kssb", "kuvacs", "laclaw", "ladocs" , "lcc", "loovs", "methepp", "midocs", "misklass", "mmlcc", "mf-klass", "modocs", "moys", "mpilcs", "mpkkl", "msc", "msdocs", "mu", "naics", "nasasscg", "nbdocs", "ncdocs", "ncsclt", "nhcp", "nicem", "niv", "njb", "nlm", "nmdocs", "no-ujur-cmr", "no-ujur-cnip", "no-ureal-ca", "no-ureal-cb", "no-ureal-cg", "noterlyd", "nvdocs", "nwbib", "nydocs", "ohdocs", "okdocs", "oosk", "ordocs", "padocs", "pim", "pssppbkj", "rich", "ridocs", "rilm", "rpb", "rswk", "rubbk", "rubbkd", "rubbkk", "rubbkm", "rubbkmv", "rubbkn", "rubbknp", "rubbko", "rubbks", "rueskl", "rugasnti", "rvk", "sbb", "scdocs", "sddocs", "sdnb", "sfb", "siblcs", "siso", "skb", "smm", "ssd", "ssgn", "sswd", "stub", "suaslc", "sudocs", "swank", "taikclas", "taykl", "teatkl", "txdocs", "tykoma", "ubtkl/2", "udc", "uef", "undocs", "upsylon", "usgslcs", "utk", "utklklass", "utklklassex", "utdocs", "veera", "vsiso", "wadocs", "widocs", "wydocs", "ykl", "z", "zdbs" ], "org_authority":[ "marcorg", "oclcorg" ], "location_url_type":[ "preview", "raw object", " object in context" ], "location_url_usage":[ "primary display", "primary" ], "unitType_type":[ "1", "2", "3" ], "accessCondition_type":[ "restriction on access", "use and reproduction" ], "part_type":[ "volume", "issue", "chapter", "section", "paragraph", "track" ], "part_detail_title_type":[ "part", "volume", "issue", "chapter", "section", "paragraph", "track" ], "part_extent_unit":[ "pages", "minutes" ], "description_authority":[ "marcdescription" ], "part_text_type":[ "host" ], "descriptionStandard":[ "aacr", "amim", "amremm", "appm", "bdrb", "bps", "cgcrb", "cco", "ccr", "crlp", "dacs", "dcgpm", "dcrb", "dcrmb", "dcrmc", "dcrmg", "dcrmm", "dcrms", "din1505", "dmbsb", "enol", "estc", "fobidrtb", "gihc", "hmstcn", "iosr", "isbd", "katreg", "krsb", "kbsdb", "local", "mmlcc", "ncafnor", "ncr", "ncs", "ohcm", "pi", "pn", "ppiak", "psbo", "rad", "rak", "rakddb", "rakwb", "-rcaa2", "rda", "rdc", "rica", "rna", "rpk", "vd16", "vd17", "-yuppiak" ] }, "vocabularies_mapping":{ "titleInfo_type":"type_1", "titleInfo_ authority":"authority_name_title", "titleInfo_supplied":"yes", "titleInfo_usage":"primary", "name_type":"type_2", "name_authority":"authority_name_title", "name_usage":"primary", "name_namePart_type":"type_3", "name_role_roleTerm_type":"type_4", "name_role_roleTerm_authority":"authority_relator_role", "typeOfResource":"type_of_resource", "typeOfResource_collection":"yes", "typeOfResource_manuscript":"yes", "typeOfResource_usage":"primary", "genre_authority":"authority_genre_form", "genre_type":"type_5", "genre_usage":"primary", "originInfo_eventType":"event_type", "originInfo_place_supplied":"yes", "originInfo_place_placeTerm_type":"type_4", "originInfo_place_placeTerm_authority":"thority", "originInfo_publisher_supplied":"yes", "originInfo_dateIssued_encoding":"date_encoding", "originInfo_dateIssued_point":"date_point", "originInfo_dateIssued_keyDate":"yes", "originInfo_dateIssued_qualifier":"date_qualifier", "originInfo_dateCreated_encoding":"date_encoding", "originInfo_dateCreated_point":"date_point", " originInfo_dateCreated_keyDate":"yes", "originInfo_dateCreated_qualifier":"date_qualifier", "originInfo_dateCaptured_encoding":"date_encoding", "originInfo_dateCaptured_point":"date_point", "originInfo_dateCaptured_keyDate":"yes", "originInfo_dateCaptured_qualifier":"date_qualifier", "originInfo_dateValid_encoding":"date_encoding", "originInfo_dateValid_point":"date_point", "originInfo_dateValid_keyDate":"yes", "originInfo_dateValid_qualifier":"date_qualifier", "originInfo_dateModified_encoding":"date_encoding", "originInfo_dateModified_point":"date_point", "originInfo_dateModified_keyDate":"yes", "originInfo_dateModified_qualifier":"date_qualifier", "originInfo_copyrightDate_encoding":"date_encoding", "originInfo_copyrightDate_point":"date_point", "originInfo_copyrightDate_keyDate":"yes", "originInfo_copyrightDate_qualifier":"date_qualifier", "originInfo_dateOther_encoding":"date_encoding", "originInfo_dateOther_point":"date_point", "originInfo_dateOther_keyDate":"yes", "originInfo_dateOther_qualifier":" date_qualifier", "originInfo_edition_supplied":"yes", "originInfo_issuance":"issuance", "originInfo_frequency_authority":"frequency", "language_usage_primary":"yes", "language_languageTerm_type":"type_4", "language_languageTerm_authority":"language_authority", "language_scriptTerm_type":"type_4", "physicalDescription_form_authority":"authority_genre_form", "physicalDescription_form_type":"description_form_type", "physicalDescription_reformattingQuality":"reformatting_quality", "physicalDescription_extent_supplied":"yes", "physicalDescription_digitalOrigin":"digital_origin", "physicalDescription_note_type":"physdesc_note_type", "abstract_type":"abstract_type", "abstract_shareable":"no", "tableOfContents_type":"toc_type", "tableOfContents_shareable":"no", "targetAudience_authority":"target_authority", "note_type":"note_type", "subject_authority":"subject_authority", "subject_usage":"primary", "subject_temporal_encoding":"date_encoding", "subject_temporal_point":"date_point", "subject_temporal_keyDate":"yes", " subject_temporal_qualifier":"date_qualifier", "subject_titleInfo_type":"type_1", "subject_titleInfo_authority":"authority_name_title", "subject_name_type":"type_2", "subject_name_authority":"authority_name_title", "subject_name_namePart_type":"type_3", "subject_name_role_roleTerm_type":"type_4", "subject_name_role_roleTerm_authority":"authority_relator_role", "subject_geographicCode_authority":"thority", "classification_authority":"classification_authority", "classification_usage":"primary", "relatedItem_type":"item_type", "identifier_type":"identifier_type", "identifier_invalid":"yes", "location_physicalLocation_authority":"org_authority", "location_physicalLocation_type":"location_type", "location_url_access":"location_url_type", "location_url_usage":"location_url_usage", "location_holdingSimple_copyInformation_enumerationAndChronology_unitType":"unitType_type", "accessCondition_type":"accessCondition_type", "part_type":"part_type", "part_detail_type":"part_detail_type", "part_extent_unit":"part_extent_ unit", "part_date_encoding":"date_encoding", "part_date_point":"date_point", "part_date_keyDate":"yes", "part_date_qualifier":"date_qualifier", "part_text_type":"part_text_type", "recordInfo_recordIdentifier_source":"org_authority", "recordInfo_recordContentSource_authority":"org_authority", "recordInfo_recordCreationDate_encoding":"date_encoding", "recordInfo_recordCreationDate_point":"date_point", "recordInfo_recordCreationDate_keyDate":"yes", "recordInfo_recordCreationDate_qualifier":"date_qualifier", "recordInfo_recordChangeDate_encoding":"date_encoding", "recordInfo_recordChangeDate_point":"date_point", "recordInfo_recordChangeDate_keyDate":"yes", "recordInfo_recordChangeDate_qualifier":"date_qualifier", "recordInfo_languageOfCataloging_usage":"primary", "recordInfo_languageOfCataloging_languageTerm_type":"type_4", "recordInfo_languageOfCataloging_languageTerm_authority":"language_authority", "recordInfo_languageOfCataloging_scriptTerm_type":"type_4", "recordInfo_descriptionStandard":" descriptionStandard", "recordInfo_descriptionStandard_authority":"description_authority" }, "tree":[ { "xmlname":"titleInfo", "input_type":"node", "label":"Title info", "children":[ { "xmlname":"title", "input_type":"input_text", "label":"Title", "mandatory":1, "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"subTitle", "input_type":"input_text", "label":"Subtitle", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"partNumber", "input_type":"input_text", "label":"Part number", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_ text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"partName", "input_type":"input_text", "label":"Part name", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"otherType", "input_type":"input_text", "label":"Other type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":" Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"supplied", "input_type":"select", "label":"Supplied" }, { "xmlname":"usage", "input_type":"select", "label":"Usage" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" }, { "xmlname":"nameTitleGroup", "input_type":"input_text", "label":"Name title group" }, { "xmlname":"altFormat", "input_type":"input_text", "label":"Alternative format" }, { "xmlname":"altContent", "input_type":"input_text", "label":"Alternative content" } ] }, { "xmlname":"name", "input_type":"node", "label":"Name", "children":[ { "xmlname":"namePart", "input_type":"input_text", "mandatory":1, "label":"Name part", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"lang", "input_type":"input_text", " label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"displayForm", "input_type":"input_text", "label":"Display form", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"affiliation", "input_type":"input_text", "label":"Affiliation", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"role", "input_type":"node", "label":"Role", "children":[ { "xmlname":"roleTerm", "input_type":"input_text", "label":"Role term", "mandatory":1, "attributes":[ { "xmlname":"type", "input_ type":"select", "label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ] }, { "xmlname":"description", "input_type":"input_text", "label":"Description", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"etal", "input_type":"input_checkbox", "cardinality":"1", "label":"et al.", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":" input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"usage", "input_type":"select", "label":"Usage" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" }, { "xmlname":"nameTitleGroup", "input_type":"input_text", "label":"Name title group" } ] }, { "xmlname":"typeOfResource", " input_type":"select", "label":"Type of resource", "attributes":[ { "xmlname":"manuscript", "input_type":"select", "label":"Manuscript" }, { "xmlname":"collection", "input_type":"select", "label":"Collection" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"usage", "input_type":"select", "label":"Usage" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"genre", "input_type":"input_text", "label":"Genre", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"type", "input_type" :"input_text", "label":"Type" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"usage", "input_type":"select", "label":"Usage" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"originInfo", "input_type":"node", "label":"Origin info", "children":[ { "xmlname":"place", "input_type":"node", "label":"Place", "children":[ { "xmlname":"placeTerm", "input_type":"input_text", "label":"Place term", "attributes":[ { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label": "Value URI" } ] } ], "attributes":[ { "xmlname":"supplied", "input_type":"select", "label":"Supplied" } ] }, { "xmlname":"publisher", "input_type":"input_text", "label":"Publisher", "attributes":[ { "xmlname":"supplied", "input_type":"select", "label":"Supplied" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"dateIssued", "input_type":"input_datetime", "label":"Date issued", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":" transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"dateCreated", "input_type":"input_datetime", "label":"Date created", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"dateCaptured", "input_type":"input_datetime", "label":"Date captured", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", " label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"dateValid", "input_type":"input_datetime", "label":"Date valid", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"dateModified", "input_type":"input_datetime", "label":"Date modified", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname": "point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"copyrightDate", "input_type":"input_datetime", "label":"Copyright date", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { " xmlname":"dateOther", "input_type":"input_datetime", "label":"Date other", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"edition", "input_type":"input_text", "label":"Edition", "attributes":[ { "xmlname":"supplied", "input_type":"select", "label":"Supplied" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"insurance", "input_type":"select", " label":"Insurance" }, { "xmlname":"frequency", "input_type":"input_text", "label":"Frequency", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" }, { "xmlname":"eventType", "input_ type":"select", "label":"Event type" } ] }, { "xmlname":"language", "input_type":"node", "label":"Language", "children":[ { "xmlname":"languageTerm", "input_type":"input_text", "label":"Language term", "attributes":[ { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"scriptTerm", "input_type":"input_text", "label":"Script term", "attributes":[ { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":" Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"objectPart", "input_type":"input_text", "label":"Object part" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"usage", "input_type":"select", "label":"Usage" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"physicalDescription", "input_type":"node", "label":"Physical description", "children":[ { "xmlname":"form", "input_type": "input_text", "label":"Form", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"reformattingQuality", "input_type":"select", "label":"Reformatting quality" }, { "xmlname":"internetMediaType", "input_type":"input_text", "label":"Internet media type", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"extent", "input_type": "input_text", "label":"Extent", "attributes":[ { "xmlname":"supplied", "input_type":"select", "label":"Supplied" }, { "xmlname":"unit", "input_type":"input_text", "label":"Unit" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"digitalOrigin", "input_type":"select", "label":"Digital origin" }, { "xmlname":"note", "input_type":"input_text", "label":"Note", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"typeURI", "input_type":"input_text", "label":"Type URI" }, { "xmlname":"unit", "input_type":"input_text", "label":"Unit" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":" displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"type", "input_type":"select", "label":"Type" } ] } ], "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"abstract", "input_type":"input_textarea", "label":"Abstract", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"shareable", "input_type":"select", "label":"Shareable" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" }, { "xmlname":"altFormat", "input_type":"input_text", "label":"Alternative format" }, { "xmlname":"altContent", "input_type":"input_text", "label":"Alternative content" } ] }, { "xmlname":"tableOfContents", "input_type":"input_textarea", "label":"Table of contents", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"shareable", "input_type":"select", "label":" Shareable" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" }, { "xmlname":"altFormat", "input_type":"input_text", "label":"Alternative format" }, { "xmlname":"altContent", "input_type":"input_text", "label":"Alternative content" } ] }, { "xmlname":"targetAudience", "input_type":"input_text", "label":"Target Audience", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"note", "input_type":"input_text", "label":"Note", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"typeURI", "input_type":"input_text", "label":"Type URI" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"subject", "input_type":"node", "label":"Subject", "children":[ { "xmlname":"topic", "input_type":"input_text", "label":"Topic", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_ type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"geographic", "input_type":"input_text", "label":"Geographic", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"temporal", "input_type":"input_text", "label":"Temporal", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type": "input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" } ] }, { "xmlname":"titleInfo", "input_type":"node", "label":"Title info", "children":[ { "xmlname":"title", "input_type":"input_text", "label":"Title", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"subTitle", "input_type":"input_text", "label":"Subtitle", "attributes":[ { "xmlname" :"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"partNumber", "input_type":"input_text", "label":"Part number", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"partName", "input_type":"input_text", "label":"Part name", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":" script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" } ] }, { "xmlname":"name", "input_type":"node", "label":"Name", "children":[ { "xmlname":"namePart", "input_type":"input_text", "label":"Name part", "attributes":[ { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"displayForm", "input_type":"input_text", " label":"Display form", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"affiliation", "input_type":"input_text", "label":"Affiliation", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"role", "input_type":"node", "label":"Role", "children":[ { "xmlname":"roleTerm", "input_type":"input_text", "label":"Role term", "attributes":[ { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":" Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ] }, { "xmlname":"description", "input_type":"input_text", "label":"Description", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" } ] }, { "xmlname":"geographicCode", "input_type":"input_text", "label":"Geographic code", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"genre", "input_type":"input_text", "label":"Genre", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"hierarchicalGeoraphic", "input_type":"node", "label":"Hierarchical geographic", "children":[ { "xmlname":"continent", "input_type":"input_text", "label":"Continent", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"country", "input_type":"input_text", "label":"Country", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"province", "input_type":"input_text", "label":" Province", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"region", "input_type":"input_text", "label":"Region", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"state", "input_type":"input_text", "label":"State", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"territory", "input_type":"input_text", "label":"Territory", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":" Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"country", "input_type":"input_text", "label":"Country", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"city", "input_type":"input_text", "label":"City", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"island", "input_type":"input_text", "label":"Island", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname" :"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"area", "input_type":"input_text", "label":"Area", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"extraterrestrialArea", "input_type":"input_text", "label":"Extraterrestrial area", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"citySection", "input_type":"input_text", "label":"City section", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label": "Transliteration" } ] } ], "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" } ] }, { "xmlname":"cartographics", "sequence":1, "input_type":"node", "label":"Cartographics", "children":[ { "xmlname":"scale", "input_type":"input_text", "label":"Scale", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"projection", "input_type":"input_text", "label":"Projection", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":" coordinates", "input_type":"input_text", "label":"Coordinates", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ] }, { "xmlname":"occupation", "input_type":"input_text", "label":"Occupation", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { " xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"usage", "input_type":"select", "label":"Usage" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"classification", "input_type":"input_text", "label":"Classification", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"edition", "input_type":"input_text", "label":"Edition" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"usage", "input_type":"select", "label":"Usage" }, { "xmlname":"generator", "input_type":"input_text", "label":"Generator" } ] }, { "xmlname":"relatedItem", "input_type":"node", "label":"Related item", "hidden":1, "children":[ ], "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"type", "input_type":"select", "label":"Type" } ] }, { "xmlname":"identifier", "input_type":"input_text", "label":"Identifier", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":" transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"typeURI", "input_type":"input_text", "label":"Type URI" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"invalid", "input_type":"select", "label":"Invalid" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"location", "input_type":"node", "label":"Location", "children":[ { "xmlname":"physicalLocation", "input_type":"input_text", "label":"Physical location", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { " xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"shelfLocator", "input_type":"input_text", "label":"Shelf locator", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"url", "input_type":"input_text", "label":"URL", "attributes":[ { "xmlname":"dateLastAccessed", "input_type":"input_datetime", "label":"Date last accessed" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"note", "input_type":"input_text", "label":"Note" }, { "xmlname":"access", "input_type":"select", "label":"Access" }, { "xmlname":"usage", "input_ type":"select", "label":"Usage" } ] }, { "xmlname":"holdingSimple", "input_type":"node", "label":"Holding simple", "children":[ { "xmlname":"copyInformation", "sequence":1, "input_type":"node", "label":"Copy information", "children":[ { "xmlname":"form", "input_type":"input_text", "label":"Form", "repeatable":0, "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"subLocation", "input_type":"input_text", "label":"Sub location", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":" script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"shelfLocator", "input_type":"input_text", "label":"Shelf locator", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"electronicLocator", "input_type":"input_text", "label":"Electronic locator" }, { "xmlname":"note", "input_type":"input_text", "label":"Note", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { " xmlname":"type", "input_type":"select", "label":"Type" } ] }, { "xmlname":"enumerationAndChronology", "input_type":"input_text", "label":"Enumeration and chronology", "attributes":[ { "xmlname":"unitType", "input_type":"select", "label":"Unit type" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ] } ], "repeatable":0 }, { "xmlname":"holdingExternal", "extensible":1, "input_type":"node", "label":"Holding external", "children":[ ], "repeatable":0 } ], "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"invalid", "input_type":"select", "label":"Invalid" } , { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] }, { "xmlname":"accessCondition", "extensible":1, "input_type":"input_text", "label":"Access condition", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" }, { "xmlname":"altFormat", "input_type":"input_text", "label":"Alternative format" }, { "xmlname":"altContent", "input_type":"input_text", "label":"Alternative content" } ] }, { "xmlname":"part", "input_type":"node", "ordered":1, "label":"Part", "children":[ { " xmlname":"detail", "input_type":"node", "label":"Detail", "children":[ { "xmlname":"number", "input_type":"input_text", "label":"Number", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"caption", "input_type":"input_text", "label":"Caption", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"title", "input_type":"input_text", "label":"Title", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { " xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"level", "input_type":"input_text", "label":"Level" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"extent", "sequence":1, "input_type":"node", "label":"Extent", "children":[ { "xmlname":"start", "input_type":"input_text", "label":"Start", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"end", "input_type":"input_text", "label":"End", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", " label":"Transliteration" } ] }, { "xmlname":"total", "input_type":"input_text", "label":"Total" }, { "xmlname":"list", "input_type":"input_text", "label":"List", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"unit", "input_type":"select", "label":"Unit" } ] }, { "xmlname":"date", "input_type":"input_datetime", "label":"Date", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":" input_text", "label":"Transliteration" } ] }, { "xmlname":"text", "input_type":"input_text", "label":"Text", "attributes":[ { "xmlname":"xlink:href", "input_type":"input_text", "label":"Link" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"type", "input_type":"select", "label":"Type" } ] } ], "attributes":[ { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":" Alternative representation group" } ] }, { "xmlname":"extension", "extensible":1, "input_type":"node", "label":"Extension", "hidden":1, "attributes":[ { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" } ] }, { "xmlname":"recordInfo", "input_type":"node", "label":"Record info", "children":[ { "xmlname":"recordContentSource", "input_type":"input_text", "label":"Record content source", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"recordCreationDate", "input_type":"input_datetime", "label":"Record creation date", "attributes":[ { "xmlname":"encoding", " input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"recordChangeDate", "input_type":"input_datetime", "label":"Record change date", "attributes":[ { "xmlname":"encoding", "input_type":"select", "label":"Encoding" }, { "xmlname":"point", "input_type":"select", "label":"Point" }, { "xmlname":"keyDate", "input_type":"select", "label":"Key date" }, { "xmlname":"qualifier", "input_type":"select", "label":"Qualifier" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", " input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"recordIdentifier", "input_type":"input_text", "label":"Record identifier", "attributes":[ { "xmlname":"source", "input_type":"select", "label":"Source" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"recordOrigin", "input_type":"input_text", "label":"Record origin", "attributes":[ { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"languageOfCataloging", "input_type":"node", "label":"Language of cataloging", "children":[ { "xmlname":"languageTerm", "input_type":"input_text", "label":"Language term", "attributes":[ { "xmlname":"type", "input_type":"select", " label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] }, { "xmlname":"scriptTerm", "input_type":"input_text", "label":"Script term", "attributes":[ { "xmlname":"type", "input_type":"select", "label":"Type" }, { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", " input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"objectPart", "input_type":"input_text", "label":"Object part" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" }, { "xmlname":"usage", "input_type":"select", "label":"Usage" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" } ] }, { "xmlname":"descriptionStandard", "input_type":"select", "label":"Description standard", "attributes":[ { "xmlname":"authority", "input_type":"select", "label":"Authority" }, { "xmlname":"authorityURI", "input_type":"input_text", "label":"Authority URI" }, { "xmlname":"valueURI", "input_type":"input_text", "label":"Value URI" }, { "xmlname":"lang", "input_type":"input_text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" } ] } ], "attributes":[ { "xmlname":"lang", "input_type":"input_ text", "label":"Language" }, { "xmlname":"script", "input_type":"input_text", "label":"Script" }, { "xmlname":"transliteration", "input_type":"input_text", "label":"Transliteration" }, { "xmlname":"displayLabel", "input_type":"input_text", "label":"Display label" }, { "xmlname":"altRepGroup", "input_type":"input_text", "label":"Alternative representation group" } ] } ], "languages":{ "ne":{ "en":"Nepali", "de":"Nepalisch", "it":"Nepalese", "sr":"nepalski" }, "tr":{ "en":"Turkish", "de":"Türkisch", "it":"Turco", "sr":" turski" }, "ki":{ "en":"Kikuyu; Gikuyu", "de":"Kikuyu", "it":"Kikuyu", "sr":"Kikuyu; Gikuyu" }, "da":{ "en":"Danish", "de":"Dänisch", "it":"Danese", "sr":"danski" }, "gl":{ "en":"Galician", "de":"Galizisch", "it":"Galiziano", "sr":"galicijski" }, "my":{ "en":"Burmese", "de":"Burmesisch", "it":"Burmese", "sr":"burmanski" }, "ug":{ "en":"Uigur", "de":"Uigur", "it":"Uighur", "sr":"Uigur" }, "xx":{ "en":"Not applicable", "de":"Nicht anwendbar", "it":"Non applicabile", "sr":"Nije primenljivo" }, "ro" :{ "en":"Romanian", "de":"Rumänisch", "it":"Rumeno", "sr":"rumunski" }, "tn":{ "en":"Setswana", "de":"Sezuan", "it":"Tswana", "sr":"tvana" }, "ta":{ "en":"Tamil", "de":"Tamilisch", "it":"Tamil", "sr":"tamilski" }, "co":{ "en":"Corsican", "de":"Korsisch", "it":"Corso", "sr":"korzikanski" }, "rw":{ "en":"Kinyarwanda", "de":"Kijarwanda", "it":"Kinyarwanda", "sr":"kinjarvanda" }, "br":{ "en":"Breton", "de":"Bretonisch", "it":"Bretone", "sr":"bretonski" }, "bo":{ "en":"Tibetan", "de":"Tibetanisch", "it":"Tibetano", "sr":"tibetanski" }, "cy":{ "en":"Welch", "de":"Walisisch", "it":"Gallese", "sr":"velki" }, "st":{ "en":"Sesotho", "de":"Sesothisch", "it":"Sotho, Meridionale", "sr":"Sesotho" }, "ko":{ "en":"Korean", "de":"Koreanisch", "it":"Coreano", "sr":"korejski" }, "ak":{ "en":"Akan", "de":"Akan", "it":"Akan", "sr":"Akan" }, "cs":{ "en":"Czech", "de":"Tschechisch", "it":"Ceco", "sr":"?eki" }, "mo":{ "en":"Moldavian", "de":"Moldavisch", "it":"Moldavo", "sr":"Moldavian" }, "ps":{ "en":"Pashto, Pushto", "de":" Paschtu", "it":"Pushto", "sr":"puto" }, "ji":{ "en":"former Yiddish", "de":"Jiddish (veraltet, nun: yi)", "it":"Yiddish", "sr":"former Yiddish" }, "km":{ "en":"Cambodian", "de":"Kambodschanisch", "it":"Khmer", "sr":"kmerski" }, "av":{ "en":"Avaric", "de":"Avaric", "it":"Avaric", "sr":"avarski" }, "af":{ "en":"Afrikaans", "de":"Afrikaans", "it":"Afrikaans", "sr":"afrikans (burski)" }, "is":{ "en":"Icelandic", "de":"Isländisch", "it":"Islandese", "sr":"indijski (ostali)" }, "qu":{ "en":"Quechua", "de":"Quechua", "it":"Quechua", "sr":"ke?ua" }, "ky":{ "en":"Kirghiz", "de":"Kirgisisch", "it":"Kirghiso", "sr":"kirgiski" }, "mt":{ "en":"Maltese", "de":"Maltesisch", "it":"Maltese", "sr":"malteki" }, "ti":{ "en":"Tigrinya", "de":"Tigrinja", "it":"Tigre", "sr":"tigrinja" }, "ga":{ "en":"Irish", "de":"Irisch", "it":"Gaelico irlandese", "sr":"irski" }, "hy":{ "en":"Armenian ", "de":"Armenisch", "it":"Armeno", "sr":"armenski" }, "la":{ "en":"Latin", "de":"Lateinisch", "it":"Latino", "sr":"latinski" }, "bh":{ "en":" Bihari", "de":"Biharisch", "it":"Bihari", "sr":"biharski jezici" }, "ms":{ "en":"Malay", "de":"Malaysisch", "it":"Malese", "sr":"malajski" }, "ka":{ "en":"Georgian", "de":"Georgisch", "it":"Georgiano", "sr":"gruzijski" }, "oc":{ "en":"Occitan", "de":"Okzitanisch", "it":"Occitano", "sr":"oksitanski (po 1500)" }, "mi":{ "en":"Maori", "de":"Maorisch", "it":"Maori", "sr":"maorski" }, "sv":{ "en":"Swedish", "de":"Schwedisch", "it":"Svedese", "sr":"vedski" }, "it":{ "en":"Italian", "de":"Italienisch", "it":"Italiano", "sr":"italijanski" }, "hu":{ "en":"Hungarian", "de":"Ungarisch", "it":"Ungherese", "sr":"ma?arski" }, "fa":{ "en":"Persian", "de":"Persisch", "it":"Persiano", "sr":"novopersijski" }, "za":{ "en":"Zhuang", "de":"Zhuang", "it":"Zhuang", "sr":"?uang" }, "ng":{ "en":"Ndonga", "de":"Ndonga", "it":"Ndonga", "sr":"Ndonga" }, "dv":{ "en":"Divehi; Dhivehi; Maldivian", "de":"Dhivehi", "it":"Maldiviana", "sr":"maldivski" }, "se":{ "en":"Northern Sami", "de":"Nordsamisch", "it":"Sami del nord", "sr":"Northern Sami" }, "lu":{ "en":"Luba-Katanga", "de":"Kiluba", "it":"Luba-Katanga", "sr":"luba" }, "jv":{ "en":"Javanese", "de":"Javanesisch", "it":"Lingua Giavanese", "sr":"javanski" }, "kv":{ "en":"Komi", "de":"Komi", "it":"Komi", "sr":"Komi" }, "na":{ "en":"Nauru", "de":"Nauruisch", "it":"Nauru", "sr":"nauru" }, "ks":{ "en":"Kashmiri", "de":"Kaschmirisch", "it":"Kashmiri", "sr":"kamirski" }, "jw":{ "en":"Javanese", "de":"Javanisch", "it":"Giavanese", "sr":"Javanese" }, "hi":{ "en":"Hindi", "de":"Hindi", "it":"Hindi", "sr":"hindi" }, "pt":{ "en":"Portuguese", "de":"Portugiesisch", "it":"Portoghese", "sr":"portugalski" }, "mh":{ "en":"Marshallese", "de":"Marshallesische Sprache", "it":"Marshallese", "sr":"maralski" }, "ba":{ "en":"Bashkir", "de":"Baschkirisch", "it":"Bashkir", "sr":"bakirski" }, "kg":{ "en":"Kongo", "de":"Kongo", "it":"Congo", "sr":"kongo" }, "no":{ "en":"Norwegian", "de":"Norwegisch", "it":"Norvegese", "sr":"norveki" }, "lv":{ "en":"Latvian, Lettish", "de":"Lettisch", "it":"Lettone", "sr":" letonski" }, "os":{ "en":"Ossetian; Ossetic", "de":"Ossetisch", "it":"Osseta", "sr":"osetski" }, "ln":{ "en":"Lingala", "de":"Lingala", "it":"Lingala", "sr":"lingalski" }, "fr":{ "en":"French", "de":"Französisch", "it":"Francese", "sr":"francuski" }, "in":{ "en":"former Indonesian", "de":"Indonesisch", "it":"Indonesiano", "sr":"former Indonesian" }, "id":{ "en":"Indonesian", "de":"Indonesisch", "it":"Indonesiano", "sr":"indonezijski" }, "sr":{ "en":"Serbian", "de":"Serbisch", "it":"Serbo", "sr":"srpski" }, "si":{ "en":"Singhalese", "de":"Singhalesisch", "it":"Sinhalese", "sr":"sinalezijski" }, "vo":{ "en":"Volapuk", "de":"Volapük", "it":"Volapük", "sr":"volapk" }, "ff":{ "en":"Fulah", "de":"Fulah", "it":"Fulah", "sr":"Fulah" }, "om":{ "en":"(Afan) Oromo", "de":"Oromo", "it":"Oromo", "sr":"oromski" }, "fi":{ "en":"Finnish", "de":"Finnisch", "it":"Finlandese", "sr":"finski" }, "ab":{ "en":"Abkhazian", "de":"Abchasisch", "it":"Abkazia", "sr":"abhaski" }, "fj":{ "en":"Fiji", "de":"Fiji", "it":"Fijian", "sr":" fidi" }, "sn":{ "en":"Shona", "de":"Schonisch", "it":"Shona", "sr":"ona" }, "wo":{ "en":"Wolof", "de":"Wolof", "it":"Wolof", "sr":"volof" }, "li":{ "en":"Limburgan; Limburger; Limburgish", "de":"Limburgisch", "it":"Limburgan", "sr":"Limburgan; Limburger; Limburgish" }, "sd":{ "en":"Sindhi", "de":"Zinti", "it":"Sindhi", "sr":"sindi" }, "yi":{ "en":"Yiddish", "de":"Jiddish (früher: ji)", "it":"Yiddish", "sr":"jidi" }, "ii":{ "en":"Sichuan Yi; Nuosu", "de":"Sichuan Yi; Nuosu", "it":"Sichuan Yi; Nuosu", "sr":"Sichuan Yi; Nuosu" }, "ha":{ "en":"Hausa", "de":"Haussa", "it":"Hausa", "sr":"hausa" }, "gv":{ "en":"Manx", "de":"Manx", "it":"Mannese", "sr":"Manx" }, "lg":{ "en":"Ganda", "de":"Ganda", "it":"Ganda", "sr":"luganda" }, "pa":{ "en":"Punjabi", "de":"Pundjabisch", "it":"Panjabi", "sr":"Punjabi" }, "sl":{ "en":"Slovenian", "de":"Slowenisch", "it":"Sloveno", "sr":"slovena?ki" }, "am":{ "en":"Amharic", "de":"Amharisch", "it":"Amarico", "sr":"amharski" }, "bi":{ "en":"Bislama", "de":"Bislamisch", "it":"Bislama", "sr":"Bislama" }, "mr":{ "en":"Marathi", "de":"Marathi", "it":"Marathi", "sr":"marati" }, "ee":{ "en":"Ewe", "de":"Ewe", "it":"Ewe", "sr":"eve" }, "kj":{ "en":"Kuanyama; Kwanyama", "de":"Kuanyama", "it":"Kuanyama", "sr":"kikuju" }, "rm":{ "en":"Rhaeto-Romance", "de":"Rätoromanisch", "it":"Reto-Romanzo (Rumantsch grischun)", "sr":"retoromanski" }, "dz":{ "en":"Bhutani", "de":"Dzongkha, Bhutani", "it":"Dzongkha", "sr":"donka" }, "kn":{ "en":"Kannada", "de":"Kannada", "it":"Kannada", "sr":"kannada" }, "rn":{ "en":"Kirundi", "de":"Kirundisch", "it":"Rundi", "sr":"rundi" }, "eo":{ "en":"Esperanto", "de":"Esperanto", "it":"Esperanto", "sr":"esperanto" }, "fy":{ "en":"Frisian", "de":"Friesisch", "it":"Frisone", "sr":"Frisian" }, "ik":{ "en":"Inupiak", "de":"Inupiak", "it":"Inupiaq", "sr":"Inupiak" }, "mn":{ "en":"Mongolian", "de":"Mongolisch", "it":"Mongolo", "sr":"mongolski" }, "gd":{ "en":"Scots Gaelic", "de":"Schottisches Gälisch", "it":"Gaelico", "sr":"gelski (kotski gelski)" }, "nv":{ "en":"Navajo; Navaho", "de":"Navajo", "it":"Navajo", "sr":"navaho" }, "as":{ "en":"Assamese", "de":"Assamesisch", "it":"Assamese", "sr":"asamski" }, "ae":{ "en":"Avestan", "de":"Avestisch", "it":"Avestica", "sr":"avestijski jezici" }, "mg":{ "en":"Malagasy", "de":"Malagasisch", "it":"Malagasy", "sr":"malgaki" }, "tk":{ "en":"Turkmen", "de":"Turkmenisch", "it":"Turkmen", "sr":"turkmenski" }, "su":{ "en":"Sudanese", "de":"Sudanesisch", "it":"Sundanese", "sr":"sundski" }, "sc":{ "en":"Sardinian", "de":"Sardische Sprache", "it":"Sardo", "sr":"Sardinian" }, "ru":{ "en":"Russian", "de":"Russisch", "it":"Russo", "sr":"ruski" }, "ia":{ "en":"Interlingua", "de":"Interlingua", "it":"Interlingua (International Auxiliary Language Association)", "sr":"Interlingua" }, "nb":{ "en":"BokmÃ¥l, Norwegian; Norwegian BokmÃ¥l", "de":"Norwegisch BokmÃ¥l", "it":"Norvegese BokmÃ¥l", "sr":"bokmalski norveki" }, "ku":{ "en":"Kurdish", "de":"Kurdisch", "it":"Curdo", "sr":"kurdski" }, "cr":{ "en":"Cree", "de":"Cree", "it":"Cree", "sr":"kri" }, "lo":{ "en":" Laothian", "de":"Laotisch", "it":"Lao", "sr":"lao" }, "az":{ "en":"Azerbaijani", "de":"Aserbaidschanisch", "it":"Azero", "sr":"azerbejdanski" }, "vi":{ "en":"Vietnamese", "de":"Vietnamesisch", "it":"Vietnamita", "sr":"vijetnamski" }, "sg":{ "en":"Sangro", "de":"Sango", "it":"Sango", "sr":"sango" }, "bm":{ "en":"Bambara", "de":"Bambara", "it":"Bambara", "sr":"bambara" }, "aa":{ "en":"Afar", "de":"Afar", "it":"Lingue Afro-Asiatiche", "sr":"afar" }, "lb":{ "en":"Luxembourgish; Letzeburgesch", "de":"Luxemburgisch", "it":"Lussemburghese", "sr":"luksemburki" }, "nr":{ "en":"Ndebele, South; South Ndebele", "de":"SÃ¼d Ndebele", "it":"Sud Ndebele", "sr":"Ndebele, South; South Ndebele" }, "ts":{ "en":"Tsonga", "de":"Tsongaisch", "it":"Tsonga", "sr":"Tsonga" }, "ml":{ "en":"Malayalam", "de":"Malajalam", "it":"Malayalam", "sr":"malajalam" }, "kw":{ "en":"Cornish", "de":"Kornisch", "it":"Cornish", "sr":"kornvalski" }, "uz":{ "en":"Uzbek", "de":"Usbekisch", "it":"Uzbeco", "sr":"uzbekistanski" }, "kl":{ "en":"Greenlandic" , "de":"Kalaallisut (Grönland)", "it":"Kalaallisut", "sr":"Greenlandic" }, "ht":{ "en":"Haitian", "de":"Haitianisch", "it":"Haitiano", "sr":"Haitian" }, "bs":{ "en":"Bosnian", "de":"Bosnisch", "it":"Bosanski jezik", "sr":"bosanski" }, "iu":{ "en":"Inuktitut (Eskimo)", "de":"Inuktitut", "it":"Inuktitut", "sr":"Inuktitut (Eskimo)" }, "to":{ "en":"Tonga", "de":"Tongaisch", "it":"Tonga (Nyasa)", "sr":"tonga (arhipelag Tonga)" }, "yo":{ "en":"Yoruba", "de":"Joruba", "it":"Yoruba", "sr":"joruba" }, "cu":{ "en":"Church Slavic; Old Slavonic;", "de":"Kirchenslawisch", "it":"Slavo ecclesiastico", "sr":"crkvenoslovenski" }, "ch":{ "en":"Chamorro", "de":"Chamorro", "it":"Chamorro", "sr":"?amoro" }, "iw":{ "en":"former Hebrew", "de":"Hebräisch (veraltet, nun: he)", "it":"Ebraico", "sr":"former Hebrew" }, "eu":{ "en":"Basque", "de":"Baskisch", "it":"Basco", "sr":"baskijski" }, "wa":{ "en":"Walloon", "de":"Wallon", "it":"Wallon", "sr":"valonski" }, "gu":{ "en":"Gujarati", "de":"Gujaratisch", "it":"Gujarati", "sr":" guderati" }, "bg":{ "en":"Bulgarian", "de":"Bulgarisch", "it":"Bulgaro", "sr":"bugarski" }, "sq":{ "en":"Albanian", "de":"Albanisch", "it":"Albanese", "sr":"albanski" }, "pl":{ "en":"Polish", "de":"Polnisch", "it":"Polacco", "sr":"poljski" }, "ca":{ "en":"Catalan", "de":"Katalanisch", "it":"Catalano", "sr":"katalonski" }, "ay":{ "en":"Aymara", "de":"Aymara", "it":"Aymara", "sr":"ajmara" }, "sk":{ "en":"Slovak", "de":"Slowakisch", "it":"Slovacco", "sr":"slova?ki" }, "oj":{ "en":"Ojibwa", "de":"Ojibwe", "it":"Ojibwa", "sr":"o?ipva" }, "an":{ "en":"Aragonese", "de":"Aragonesisch", "it":"Aragonese", "sr":"aragonski" }, "ty":{ "en":"Tahitian", "de":"Tahitianisch", "it":"Tahitiano", "sr":"tahi?anski" }, "uk":{ "en":"Ukrainian", "de":"Ukrainisch", "it":"Ucraino", "sr":"ukrajinski" }, "es":{ "en":"Spanish", "de":"Spanisch", "it":"Spagnolo", "sr":"panski" }, "sw":{ "en":"Swahili", "de":"Suaheli", "it":"Swahili", "sr":"svahili" }, "kr":{ "en":"Kanuri", "de":"Kanuri", "it":"Kanuri", "sr":"kanuri" }, "tt":{ "en":" Tatar", "de":"Tatarisch", "it":"Tatar", "sr":"tatarski" }, "fo":{ "en":"Faeroese", "de":"Faröisch", "it":"Faroese", "sr":"Faeroese" }, "ss":{ "en":"Siswati", "de":"Swasiländisch", "it":"Swati", "sr":"svati" }, "or":{ "en":"Oriya", "de":"Orija", "it":"Oriya", "sr":"orida" }, "sh":{ "en":"Serbo-Croatian", "de":"Serbokroatisch (veraltet)", "it":"Shan", "sr":"Serbo-Croatian" }, "sa":{ "en":"Sanskrit", "de":"Sanskrit", "it":"Sanscrito", "sr":"sanskrt" }, "xh":{ "en":"Xhosa", "de":"Xhosa", "it":"Xhosa", "sr":"kshosa" }, "io":{ "en":"Ido", "de":"Ido", "it":"Ido", "sr":"Ido" }, "th":{ "en":"Thai", "de":"Thai", "it":"Thai", "sr":"tajlandski" }, "so":{ "en":"Somali", "de":"Somalisch", "it":"Somalo", "sr":"Somali" }, "et":{ "en":"Estonian", "de":"Estnisch", "it":"Estone", "sr":"estonski" }, "ie":{ "en":"Interlingue", "de":"Interlingue", "it":"Interlingue", "sr":"Interlingue" }, "tl":{ "en":"Tagalog", "de":"Tagalog", "it":"Tagalog", "sr":"Tagalog" }, "nd":{ "en":"Ndebele, North; North Ndebele", "de":"Nord isiNdebele", " it":"Nord Ndebele", "sr":"ndebele" }, "mk":{ "en":"Macedonian", "de":"Mazedonisch", "it":"Macedone", "sr":"makedonski" }, "en":{ "en":"English", "de":"Englisch", "it":"Inglese", "sr":"engleski" }, "lt":{ "en":"Lithuanian", "de":"Litauisch", "it":"Lituano", "sr":"litvanski" }, "de":{ "en":"German", "de":"Deutsch", "it":"Tedesco", "sr":"nema?ki" }, "gn":{ "en":"Guarani", "de":"Guarani", "it":"Guarani", "sr":"Guarani" }, "hr":{ "en":"Croatian", "de":"Kroatisch", "it":"Croato", "sr":"hrvatski" }, "be":{ "en":"Byelorussian", "de":"Belorussisch", "it":"Bielorusso", "sr":"beloruski" }, "zu":{ "en":"Zulu", "de":"Zulu", "it":"Zulu", "sr":"zulu" }, "ur":{ "en":"Urdu", "de":"Urdu", "it":"Urdu", "sr":"urdu" }, "cv":{ "en":"Chuvash", "de":"Tschuwasch", "it":"Ciuvascio", "sr":"?uvaki" }, "tw":{ "en":"Twi", "de":"Twi", "it":"Twi", "sr":"tvi" }, "hz":{ "en":"Herero", "de":"Herero", "it":"Herero", "sr":"herero" }, "ce":{ "en":"Chechen", "de":"Tschetschenisch", "it":"Lingua cecena", "sr":"?e?enski" }, "nn":{ "en":"Norwegian Nynorsk; Nynorsk, Norwegian", "de":"Norwegisch Nynorsk", "it":"Norvegese Nynorsk", "sr":"ninorski norveki" }, "bn":{ "en":"Bengali", "de":"Bengalisch", "it":"Bengali", "sr":"bengalski" }, "ja":{ "en":"Japanese", "de":"Japanisch", "it":"Giapponese", "sr":"japanski" }, "tg":{ "en":"Tajik", "de":"Tadschikisch", "it":"Tajik", "sr":"tadi?ki" }, "pi":{ "en":"Pali", "de":"Pali", "it":"Pali", "sr":"pali" }, "te":{ "en":"Tegulu", "de":"Tegulu", "it":"Telugu", "sr":"telugu" }, "he":{ "en":"Hebrew", "de":"Hebräisch", "it":"Ebraico", "sr":"hebrejski" }, "zh":{ "en":"Chinese", "de":"Chinesisch", "it":"Cinese", "sr":"kineski" }, "ig":{ "en":"Igbo", "de":"Igbo", "it":"Igbo", "sr":"Igbo" }, "sm":{ "en":"Samoan", "de":"Samoanisch", "it":"Samoano", "sr":"samoanski" }, "nl":{ "en":"Dutch", "de":"Holländisch", "it":"Neerlandese", "sr":"holandski" }, "ar":{ "en":"Arabic", "de":"Arabisch", "it":"Arabo", "sr":"arapski" }, "ny":{ "en":"Chichewa; Chewa; Nyanja", "de":"Chichewa; Chewa; Nyanja", "it":"Chichewa; Chewa; Nyanja", "sr":" njanda" }, "el":{ "en":"Greek", "de":"Griechisch", "it":"Greco moderno", "sr":"gr?ki (moderni 1453=)" }, "kk":{ "en":"Kazakh", "de":"Kasachisch", "it":"Kazakh", "sr":"kazahski" } } } ';
			     
    			       $scope.mods = angular.fromJson($scope.mods);
			       //console.log('mods2',$scope.mods);
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
    			$scope.uwmetalanguages = response.data.uwmetalanguages;
			$scope.uwmetadata = response.data.uwmetadata;
			$scope.valueURIs = $scope.getValueURIUwm();
		        if($scope.valueURIs != 'undefined' ){
			       if($scope.valueURIs.length != 0){ 
			                $scope.getClass($scope.valueURIs, 'uwmeta');
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
    
    
    $scope.getValueURIMods = function(pid){
        
         var classes = [];
         $scope.mods
	 for (var i = 0; i < $scope.mods.length; ++i) {
	     if( $scope.mods[i].xmlname == 'classification'){
	         var authorityURI = (function () { return; })(); //set undefined
	         var valueURI     = (function () { return; })(); //set undefined
		 for (var j = 0; j < $scope.mods[i].attributes.length; ++j){
		     if(typeof $scope.mods[i].attributes[j].xmlname != 'undefined'){
			    if($scope.mods[i].attributes[j].xmlname == 'authorityURI'){
			        authorityURI = $scope.mods[i].attributes[j].ui_value;
			    }
			    if($scope.mods[i].attributes[j].xmlname == 'valueURI'){
			        valueURI = $scope.mods[i].attributes[j].ui_value;
			    }
			    if(typeof authorityURI != 'undefined'){
                                  if( ( authorityURI == 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification' ) && ( typeof valueURI != 'undefined' ) ){
				       classes.push(valueURI);
				  }
			    }
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
            var promise = MetadataService.getClassifications(valueURIs);
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
        console.log('geoTabActivated');
        $scope.geoTabActivated = true;
    }

}); 

/*
var METemplateSaveAsModalCtrl = function ($scope, $rootScope, $modalInstance, FrontendService, promiseTracker) {
     
     $scope.massedit = {};
     $scope.templates = {};
     $scope.massedit.templatename = '';
     $scope.alerts = '';
     
     $scope.save = function () {
           

          $modalInstance.close();
     }
     
     $scope.setTemplateName = function (templateName) {
               
          $scope.massedit.templatename = templateName;
    }
     
     
     $scope.cancel = function () {
           $modalInstance.dismiss('cancel');
     };
  
}
*/
var CreateBookmarkModalCtrl = function ($scope, $modalInstance, BookmarkService ) {
   
     $scope.bookmark_name = '';
     
     
     
     $scope.OK = function (bookmark_name) {
	     
             $scope.createBookmark(bookmark_name);
	     console.log('bookmark_name3:',bookmark_name);  
	     console.log('bookmark_name3:',$scope.bookmark_name);
	     //$modalInstance.close($scope.bookmark_name);
	     $modalInstance.dismiss('OK');
     };
     $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
     };
     $scope.hitEnter = function(evt){
    	   if(angular.equals(evt.keyCode,13)){
	         $scope.createBookmark($scope.bookmark_name);
	         console.log('enter');
	   }
     };
     

     
     $scope.createBookmark = function (bookmark_name) {
            console.log('addToBookmark:',bookmark_name);
            
	    var promise = BookmarkService.createBookmark(bookmark_name);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			console.log('createBookmark', response.data);
			BookmarkService.getBookmarks(BookmarkService);
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
     
     
}


var AddToBookmarkModalCtrl = function ($scope, $modalInstance, BookmarkService, currentBookmarkId, pid ) {
  

  $scope.bookmarks = BookmarkService.bookmarks;
  $scope.currentBookmarkId = currentBookmarkId;
  
  console.log('AddToBookmarkModalCtrl');
  
  
  $scope.setBookmark = function (currentBookmarkId) {
       console.log('setBookmark', currentBookmarkId);  
       BookmarkService.currentBookmarkId = currentBookmarkId;
       $scope.currentBookmarkId = currentBookmarkId;
  }

  
   $scope.addToBookmark = function () {

            var pidJson = angular.toJson(pid);
            var currentBookmarkIdJson = angular.toJson($scope.currentBookmarkId);
            var promise = BookmarkService.addToBookmark(pidJson, currentBookmarkIdJson);
            $scope.loadingTracker.addPromise(promise);
            promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
			console.log('createBookmark', response.data);
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
   $scope.OK = function () {
	
          $scope.addToBookmark();
	  $modalInstance.dismiss('OK');
   };
   $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
   };
  
}

var AddToCurrentBookmarkCtrl = function ($scope, $modalInstance, text ) {
  
   $scope.text = text;    
  
   $scope.OK = function () {
	  $modalInstance.dismiss('OK');
   };

  } 