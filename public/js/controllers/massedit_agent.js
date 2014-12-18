app.controller('MasseditAgentCtrl',  function($scope, $modal, $location, $timeout, DirectoryService, SearchService, FrontendService, MetadataService, promiseTracker, Massedit) {
  

      $scope.statusActions = [];
     
      //$scope.initdata = '';
      $scope.jobs = [];
      $scope.jobsDisplay = [];
      $scope.maxSize = 10; // pages in paginator
      $scope.recordsPerPageNum = 10;
      $scope.currentPageInPaginator = 1;
  
  
  
    $scope.init = function (initdata) {
    
         $scope.statusActions['Not processed'] = 'Start processing';
         $scope.statusActions['Processed']     = 'Done';
         $scope.statusActions['Processing']    = 'Abort';
         $scope.statusActions['Aborted']       = 'Resume';
    
         var init_data = angular.fromJson(initdata);
         console.log("init_data: ", init_data);
	 console.log("currPageInPaginator: ", init_data.currPageInPaginator);
	 $scope.setPage(init_data.currPageInPaginator);
         $scope.currentPageInPaginator = init_data.currPageInPaginator;
	 
	 $scope.jobs = init_data.jobsArray;
	 for (var i = 0 ; i < $scope.jobs.length  ; i++) {
              console.log("switch: ", $scope.jobs[i].job_status);
	      switch($scope.jobs[i].job_status) {
                   case 'not processed':
                        $scope.jobs[i].action = 'Start processing';
                        $scope.jobs[i].color  = 'massedit-white';
                        break;
                   case 'processed':
                        $scope.jobs[i].action = 'Done';
                        $scope.jobs[i].color  = 'massedit-green';
                        break;
	           case 'processing':
                        $scope.jobs[i].action = 'Abort';
                        $scope.jobs[i].color  = 'massedit-yellow';
                        break;
	           case 'aborted':
                        $scope.jobs[i].action = 'Resume';
                        $scope.jobs[i].color  = 'massedit-orange';
                        break;
		   case 'failed':
                        $scope.jobs[i].action = 'Resume';
                        $scope.jobs[i].color  = 'massedit-red';
                        break;
                   default:
		        $scope.jobs[i].action = 'Status not available';
			$scope.jobs[i].color  = 'massedit-gray';
             }   
	 }
	 $scope.setPage(1);
    }
    
    $scope.recordsPerPage = function (recordsPerPage) { 
      
       $scope.recordsPerPageNum = recordsPerPage;
       $scope.setPage(1);
   }
    
    
    $scope.setPage = function (page) {
    
	$scope.currentPageInPaginator = page;
        var start  = (page-1)*$scope.recordsPerPageNum ;
	var max = (page-1)*$scope.recordsPerPageNum + $scope.recordsPerPageNum - 1;
	//console.log("setPage ",$scope.recordsPerPageNum);								      
	$scope.jobsDisplay = [];
	for (var i = start; i <= max  ; i++) {
	       //console.log("looping job");
	       if('undefined' !== typeof  $scope.jobs[i] ){  
                          $scope.jobsDisplay.push($scope.jobs[i]);
			  //console.log("adding job");
	       }
        }	
    }
    
    $scope.viewJobs = function (jobId) {
             //alert(jobId);
            //console.log("statusActions: ", $scope.statusActions['Aborted']);
            window.location = $('head base').attr('href')+'massedit_agent_details/'+jobId;//  massedit_agent_details => massedit_agent_job_view
    }
    
    $scope.jobAction = function (jobId) {
             alert(jobId);
	     //window.location = $('head base').attr('href')+'massedit_agent_job_action/'+jobId;
	     
	    console.log("currentPageInPaginator: ", $scope.currentPageInPaginator); 
	    var promise = FrontendService.MEagentAction(jobId, $scope.currentPageInPaginator);
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
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
            
	    
	    //console.log("statusActions: ", $scope.statusActions['Aborted']);
            //window.location = $('head base').attr('href')+'massedit_agent_details/'+jobId;
    }
    
    
    $scope.deleteAll= function () {
       
    }
    
    $scope.deleteJob= function (jobId) {
       
            var promise = FrontendService.MEagentDelete(jobId, $scope.currentPageInPaginator);
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	    $scope.loadingTracker.addPromise(promise); 
            promise.then(
	     	function(response) { 
	      		alert(jobId);
		        //$scope.removeJobFromInternalArray(jobId);
		        //$scope.setPage($scope.currentPageInPaginator);
		        $scope.alerts = response.data.alerts;
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		alert('fff');
		        $scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
           ); 
           
    }
    
    $scope.removeJobFromInternalArray = function (jobId) {
          
         
    }
    
    $scope.toLocal= function (time) {
      
        console.log("time:", time); 
        var utcSeconds = time;
        var date = new Date(0); 
        date.setUTCSeconds(utcSeconds);
	date = date.toString();
	return date;
    }
    
  
});