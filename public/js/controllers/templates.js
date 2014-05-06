var ConfirmDeleteModalCtrl = function ($scope, $modalInstance) {

	$scope.ok = function () {		
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};

app.controller('TemplatesCtrl',  function($scope, $modal, $location, DirectoryService, MetadataService, promiseTracker) {
    
	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	
	$scope.alerts = [];
	
	$scope.templates = [];        
    
    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };
            
	$scope.initdata = '';
	$scope.current_user = '';
			
	$scope.init = function (initdata) {
		$scope.initdata = angular.fromJson(initdata);
		$scope.current_user = $scope.initdata.current_user;		
    	$scope.getMyTemplates();    	
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
	
    /*
    $scope.deleteTemplate = function(tid){
    	$scope.form_disabled = true;
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
    };
    */
     
 $scope.getMyTemplates = function() {
	 $scope.form_disabled = true;
     var promise = MetadataService.getMyTemplates();
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
       
});


