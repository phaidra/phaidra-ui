var app = angular.module('frontendApp', ['ngAnimate', 'ui.bootstrap', 'ui.bootstrap.modal', 'ui.sortable', 'ajoslin.promise-tracker', 'directoryService', 'metadataService', 'searchService', 'frontendService', 'objectService']);

var SigninModalCtrl = function ($scope, $modalInstance, DirectoryService, FrontendService, promiseTracker) {
		
	$scope.user = {username: '', password: ''};
	$scope.alerts = [];		
	
	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');	

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


app.controller('FrontendCtrl', function($scope, $modal, $log, DirectoryService, promiseTracker) {
    
	// we will use this to track running ajax requests to show spinner	
	$scope.loadingTracker = promiseTracker.register('loadingTrackerFrontend');
	
    $scope.alerts = [];        
    $scope.query = '';   
    
	$scope.initdata = '';
	$scope.current_user = '';
			
	$scope.init = function (initdata) {
		$scope.initdata = angular.fromJson(initdata);
		$scope.current_user = $scope.initdata.current_user;
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
    };
    
    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
    
    $scope.signin_open = function () {

    	var modalInstance = $modal.open({
            templateUrl: $('head base').attr('href')+'views/partials/loginform.html',
            controller: SigninModalCtrl
    	});
    };
    
    $scope.init = function () {
    	if($('#signin').attr('data-open') == 1){
    		$scope.signin_open();
    	}
    };
      
});



