var app = angular.module('frontendApp', ['ngAnimate', 'ui.bootstrap', 'ui.bootstrap.modal', 'ui.sortable', 'ajoslin.promise-tracker', 'pasvaz.bindonce', 'directoryService', 'metadataService', 'searchService', 'frontendService', 'objectService', 'massEditService', 'massEditJobsService', 'bookmarkService', 'vocabularyService', 'uiGmapgoogle-maps','ui.select', 'ngSanitize']);

app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

app.run(function($rootScope, promiseTracker) {
  $rootScope.loadingTracker = promiseTracker();
});

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
  //      key: <%= $config->{google_maps_api_key} %>,
    	key:'AIzaSyBWE_bAtgkm1RuWkrW7jBrYV1JBiPUZDAs',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

app.directive('bindOnce', function() {
    return {
        scope: true,
        link: function( $scope, $element ) {
            setTimeout(function() {
                $scope.$destroy();
            }, 0);
        }
    }
});

var SigninModalCtrl = function ($scope, $rootScope, $modalInstance, DirectoryService, FrontendService, promiseTracker) {
		
    $scope.user = {username: '', password: ''};
    $scope.alerts = [];		
	
    // we will use this to track running ajax requests to show spinner
    //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');	
    //$scope.loadingTracker = promiseTracker();	
    $scope.loadingTracker = $rootScope.loadingTracker;
    
    $scope.closeAlert = function(index) {
    	       $scope.alerts.splice(index, 1);
    };
    
    $scope.hitEnterSignin = function(evt){
    	if(angular.equals(evt.keyCode,13) 
    			&& !(angular.equals($scope.user.username,null) || angular.equals($scope.user.username,''))
    			&& !(angular.equals($scope.user.password,null) || angular.equals($scope.user.password,''))
    			)
    	$scope.signin();
    };
    	
	$scope.signin = function () {
		
	      $scope.form_disabled = true;
		
	      var promise = DirectoryService.signin($scope.user.username, $scope.user.password);		
    	      $scope.loadingTracker.addPromise(promise);
    	      promise.then(
    		function(response) { 
    			$scope.form_disabled = false;
    			$scope.alerts = response.data.alerts;
    			$scope.alerts.push({type: 'success', msg: 'Signed in'});
    			$modalInstance.close();
    			var red = $('#signin').attr('data-redirect');
    			if(red){
    				window.location = red;
    			}else{
    				window.location.reload();
    			}
    		}
    		,function(response) {
    			$scope.form_disabled = false;
    			$scope.alerts = response.data.alerts;
            }
        );
		return;
		
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};


var CollModalCtrl = function ($scope, $rootScope, $modalInstance, FrontendService, ObjectService, promiseTracker, current_user, selection) {
			
	$scope.alerts = [];
	$scope.current_user = current_user;
	$scope.selection = selection;
	$scope.modaldata = { title: '', description: ''};	
	$scope.uwmetadata = 
    [
        {
            "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
            "xmlname": "general",
            "children": [
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "identifier",
                    "ui_value": "",
                    "datatype": "CharacterString"
                },
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "title",
                    "ui_value": "",
                    "value_lang": "de",
                    "datatype": "LangString"
                },
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "language",
                    "ui_value": "xx",
                    "datatype": "Language"
                },
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "description",
                    "ui_value": "",
                    "value_lang": "de",
                    "datatype": "LangString"
                }
            ]
        },
        {
            "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
            "xmlname": "lifecycle",
            "children": [
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "upload_date",
                    "ui_value": "",
                    "datatype": "DateTime"
                },
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "status",
                    "ui_value": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/voc_2/44",
                    "datatype": "Vocabulary"
                },
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "contribute",
                    "children": [
                        {
                            "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                            "xmlname": "role",
                            "ui_value": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/voc_3/46",
                            "datatype": "Vocabulary"
                        },
                        {
                            "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                            "xmlname": "entity",
                            "children": [
                                {
                                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/entity",
                                    "xmlname": "firstname",
                                    "ui_value": "",
                                    "datatype": "CharacterString"
                                },
                                {
                                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/entity",
                                    "xmlname": "lastname",
                                    "ui_value": "",
                                    "datatype": "CharacterString"
                                }
                            ],
                            "data_order": "0",
                            "ordered": 1
                        }
                    ],
                    "data_order": "0",
                    "ordered": 1
                }
            ]
        },
        {
            "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
            "xmlname": "rights",
            "children": [
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "cost",
                    "ui_value": "0",
                    "datatype": "Boolean"
                },
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "copyright",
                    "ui_value": "1",
                    "datatype": "Boolean"
                },
                {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "license",
                    "ui_value": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/voc_21/1",
                    "datatype": "License"
                }
            ]
        }
    ];		
	
        //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
        //$scope.loadingTracker = promiseTracker();
        $scope.loadingTracker = $rootScope.loadingTracker;
	
	$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
    
    $scope.hitEnterCreate = function(evt){
    	if(angular.equals(evt.keyCode,13)){
    		$scope.createCollection();
    	}
    };
    	
    $scope.createCollection = function () {
		
		$scope.form_disabled = true;
		
		// general -> title
		$scope.uwmetadata[0].children[1].ui_value = $scope.modaldata.title;
		// general -> description
		$scope.uwmetadata[0].children[3].ui_value = $scope.modaldata.description;
		
		// lifecycle -> contribute -> entity -> firstname
		$scope.uwmetadata[1].children[2].children[1].children[0].ui_value = $scope.current_user.firstname;
		// lifecycle -> contribute -> entity -> lastname
		$scope.uwmetadata[1].children[2].children[1].children[1].ui_value = $scope.current_user.lastname;
		
		var members = [];
		
		for (var i = 0 ; i < $scope.selection.length; i++){
			members.push({ pid: $scope.selection[i], pos: i});
		}

		var promise = ObjectService.createCollection($scope.uwmetadata, members);		
    	$scope.loadingTracker.addPromise(promise);
    	promise.then(
    		function(response) { 
    			$scope.form_disabled = false;
    			$scope.alerts = response.data.alerts;
    			$modalInstance.close();
    			window.location = $('head base').attr('href')+'collection/'+response.data.pid;
    		}
    		,function(response) {
    			$scope.form_disabled = false;
    			$scope.alerts = response.data.alerts;
            }
        );
		return;
		
     };

     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
     };
};

app.controller('FrontendCtrl', function($scope, $rootScope, $modal, $log, DirectoryService, promiseTracker, FrontendService, Massedit, BookmarkService) {
    
   
    // we will use this to track running ajax requests to show spinner	
    //$scope.loadingTracker = promiseTracker.register('loadingTrackerFrontend');
    //$scope.loadingTracker = promiseTracker.register();
    $scope.disableBookmark = true;
    $scope.loadingTracker = $rootScope.loadingTracker;
    $scope.alerts = [];
    $scope.query = '';
    $scope.pid = '';
    
    $scope.initdata = '';
    $scope.current_user = '';
			
    $scope.init = function (initdata) {
                $scope.initdata = angular.fromJson(initdata);
		
		$scope.current_user = $scope.initdata.current_user;
		$scope.baseurl = $('head base').attr('href');
		//$scope.initdataTemp = initdataTemp;
    };
    
    $scope.gotoJobsList = function() {
        
         window.location = $('head base').attr('href')+'massedit/jobs';
    };
    
    $scope.gotoMassedit = function() {
        
         Massedit.selection = [];
         Massedit.saveSelection(Massedit);
         window.location = $('head base').attr('href')+'massedit';
    };
    
    $scope.hitEnterSearch = function(evt){    	
    	if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.query,null) || angular.equals($scope.query,''))){
    		window.location = $('head base').attr('href')+'search?q='+encodeURIComponent($scope.query);
    	}
    };
    
    $scope.search = function(){    	
    	if(!(angular.equals($scope.query,null) || angular.equals($scope.query,''))){
    		window.location = $('head base').attr('href')+'search?q='+encodeURIComponent($scope.query);
    	}
    	//if(!(angular.equals($scope.query,null) || angular.equals($scope.query,''))){
    	//	window.location = $('head base').attr('href')+'search?q='+encodeURIComponent($scope.query);
    	//}
    };

    
    
    
    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
    
    $scope.signin_open = function () {
    	var modalInstance = $modal.open({
            templateUrl: $('head base').attr('href')+'views/modals/loginform.html',
            controller: SigninModalCtrl
    	});
    };
    
    $scope.init = function () {
    	
        if($('#signin').attr('data-open') == 1){
    		$scope.signin_open();
    	}
	
    };
    
    $scope.editBookmark = function(){
          window.location = $('head base').attr('href')+'bookmark/edit';
    }
    $scope.createBookmark = function(){
           
          var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/modals/bookmark/create_bookmark.html',
                     controller: CreateBookmarkModalCtrl,                     
          });
   }
   $scope.addToBookmark = function(){
          console.log('addToBookmark pid:',$scope.pid);
          var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/modals/bookmark/add_to_bookmark.html',
                     controller: AddToBookmarkModalCtrl,
		     resolve: {	  
                           pid: function(){
                                         return $scope.pid;
                                           },	  
                           }
		     
          });
   }
   
   $scope.addToCurrentBookmark = function(){
       console.log('currentBookmarkId345:',BookmarkService.currentBookmarkId);
       if(typeof BookmarkService.currentBookmarkId == 'undefined' || BookmarkService.currentBookmarkId == ''){
	      var modalInstance = $modal.open({
                   templateUrl: $('head base').attr('href')+'views/modals/popup_alert.html',
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
            var promise = BookmarkService.addToBookmark(pidJson, currentBookmarkIdJson);
            $scope.loadingTracker.addPromise(promise);
            promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
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
   
   $scope.gotoObjects = function(){
         window.location = $('head base').attr('href')+'search';
   }
   
   $scope.gotoTemplates = function(){
         window.location = $('head base').attr('href')+'templates';
   }
   
   $scope.gotoSubmit = function(){
         window.location = $('head base').attr('href')+'submit';
   }
   
    
});

var CreateBookmarkModalCtrl = function ($scope, $modalInstance, BookmarkService ) {
   
     $scope.bookmark_name = '';
     
     $scope.OK = function (bookmark_name) {
             $scope.createBookmark(bookmark_name);
	     $modalInstance.dismiss('OK');
     };
     $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
     };
 
     $scope.createBookmark = function (bookmark_name) {
            
	    var promise = BookmarkService.createBookmark(bookmark_name);
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
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
     
     $scope.hitEnter = function(evt, bookmark_name){
           if(angular.equals(evt.keyCode,13)){
                  $scope.createBookmark(bookmark_name);
                  $modalInstance.dismiss('OK');
           }
     };
     
}


var AddToBookmarkModalCtrl = function ($scope, $modalInstance, BookmarkService, pid) {
      
     $scope.disabled = undefined;
     $scope.enable = function() {
          $scope.disabled = false;
     };
     $scope.disable = function() {
          $scope.disabled = true;
     };
     $scope.clear = function() {
         $scope.bookmark.selected = undefined;
     };
  
     $scope.bookmarks = BookmarkService.bookmarks;
  
     $scope.compareRecordsBookmarkName = function(a,b) {
           var valueA = a.bookmarkname; 
           var valueB = b.bookmarkname;
           if (valueA < valueB)  return -1;
           if (valueA > valueB)  return 1;
           return 0;
     };

     $scope.bookmarks.sort($scope.compareRecordsBookmarkName);

     $scope.addToBookmark = function () {
            BookmarkService.currentBookmarkId = $scope.bookmarks.selected.id;
            console.log('bookmarkId111:',$scope.bookmarks.selected.id);
	    var pidJson = angular.toJson(pid);
            var currentBookmarkIdJson = angular.toJson($scope.bookmarks.selected.id);
            var promise = BookmarkService.addToBookmark(pidJson, currentBookmarkIdJson);
            $scope.loadingTracker.addPromise(promise);
            promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
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
   
       $scope.hitEnter = function(evt){
    	   if(angular.equals(evt.keyCode,13)){
	          $scope.addToBookmark();
                  $modalInstance.dismiss('OK');
	   }
       };
  
}

var AddToCurrentBookmarkCtrl = function ($scope, $modalInstance, text ) {
  
   $scope.text = text;    
  
   $scope.OK = function () {
	  $modalInstance.dismiss('OK');
   };

} 
