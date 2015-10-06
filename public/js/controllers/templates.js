var ConfirmDeleteModalCtrl = function ($scope, $modalInstance) {

	$scope.ok = function () {		
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};

app.controller('TemplatesCtrl',  function($scope, $rootScope, $modal, $location, DirectoryService, MetadataService, promiseTracker) {
    
    // we will use this to track running ajax requests to show spinner
    //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
    //$scope.loadingTracker = promiseTracker();
    $scope.loadingTracker = $rootScope.loadingTracker;
	
    $scope.alerts = [];
	
    $scope.templates = [];        
    
    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
            
    $scope.initdata = '';
    $scope.current_user = '';
			
    $scope.init = function (initdata) {
		
        $scope.initdata = angular.fromJson(initdata);
        console.log('initdata template',$scope.initdata);
        $scope.current_user = $scope.initdata.current_user;		
        $scope.getAllTemplates();    	
    };
    
    $scope.deleteTemplate = function (tid) {

    	var modalInstance = $modal.open({
            templateUrl: $('head base').attr('href')+'views/partials/confirm_delete.html',
            controller: ConfirmDeleteModalCtrl
    	});
    	
    	modalInstance.result.then(function () {
    		var promise = MetadataService.deleteTemplate(tid);
            $scope.loadingTracker.addPromise(promise);
            promise.then(
             	function(response) { 
             		$scope.alerts = response.data.alerts;
             		for(var i = 0 ; i < $scope.templates.length; i++){
             			if($scope.templates[i]._id == tid){
             				$scope.templates.splice(i,1);
             			}             			
             		}             		
             		$scope.form_disabled = false;
             	}
             	,function(response) {
             		$scope.alerts = response.data.alerts;
             		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
             		$scope.form_disabled = false;
             	}
            );
	    });
    };	
	     
 $scope.getAllTemplates = function() {
     $scope.form_disabled = true;
     
     var promise = MetadataService.getAllTemplates();
     $scope.loadingTracker.addPromise(promise);
     promise.then(
      	function(response) { 
      		$scope.alerts = response.data.alerts;
      		$scope.templates = response.data.templates;
		$scope.form_disabled = false;
      	}
      	,function(response) {
      		$scope.alerts = response.data.alerts;
      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		$scope.form_disabled = false;
      	}
     );
    
 };   
    
   $scope.editTemplete = function(tid){
      
     var promise = MetadataService.loadTemplate(tid);
     $scope.loadingTracker.addPromise(promise);
     promise.then(
      	function(response) { 
      		$scope.alerts = response.data.alerts;
		if(typeof response.data.mods !== 'undefined' ){
		    window.location = $('head base').attr('href')+'templates/mods/modseditor/'+tid;
		}
		if(typeof response.data.uwmetadata !== 'undefined' ){
		    window.location = $('head base').attr('href')+'uwmetadata_template_editor/'+tid;
		}
		$scope.form_disabled = false;
      	}
      	,function(response) {
      		$scope.alerts = response.data.alerts;
      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
      		$scope.form_disabled = false;
      	}
     );
   }
 
   $scope.addTemplete = function(){
           
          var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/modals/new_template.html',
                     controller: AddTemplateModalCtrl
          });
   }
 
 
});

var AddTemplateModalCtrl = function ($scope, $modalInstance ) {
  
 
   $scope.OK = function (data) {
	  
        if(data == 'uwmetadata'){
	    window.location = $('head base').attr('href')+'uwmetadata_template_editor';
	}
	if(data == 'mods'){
	    window.location = $('head base').attr('href')+'templates/mods/modseditor';
	}
        $modalInstance.dismiss('OK');
   };
   
      $scope.hitEnter = function(evt){
    	   if(angular.equals(evt.keyCode,13)){
	          $scope.addToBookmark();
                  $modalInstance.dismiss('OK');
	   }
   };
   $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
   };

} 

