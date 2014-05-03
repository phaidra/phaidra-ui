
var CollModalCtrl = function ($scope, $modalInstance, FrontendService, ObjectService, promiseTracker, current_user, selection) {
		
	
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
	
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');	

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


