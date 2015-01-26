app.controller('MasseditJobsCtrl',  function($scope, $timeout, $modal, FrontendService, promiseTracker, MasseditJobs) {  

      $scope.statusActions = [];

      $scope.masseditjobs = MasseditJobs;
      MasseditJobs.jobs = [];
      MasseditJobs.jobsDisplay = [];
      $scope.maxSize = 10; // pages in paginator
      MasseditJobs.recordsPerPageNum = 10;
      $scope.currentPageInPaginator = 1;
      $scope.sortOrder = 0 ;
      $scope.refreshInterval =  7000; // status refresh interval


    $scope.init = function (initdata) {

         $scope.statusActions['Not processed'] = 'Start processing';
         $scope.statusActions['Processed']     = 'Done';
         $scope.statusActions['Processing']    = 'Abort';
         $scope.statusActions['Aborted']       = 'Resume';

         var init_data = angular.fromJson(initdata);
         $scope.setPage(init_data.currPageInPaginator);
         $scope.currentPageInPaginator = init_data.currPageInPaginator;

         MasseditJobs.jobs = init_data.jobsArray;
         $scope.updateButtonColors();
         $scope.sortStartAt();	
         $scope.setPage(1);


         setInterval($scope.getActionButtonStatus, $scope.refreshInterval);

    }

    $scope.updateButtonColors = function () {

           for (var i = 0 ; i < MasseditJobs.jobs.length  ; i++) {
               switch(MasseditJobs.jobs[i].job_status) {
                   case 'not processed':
                        MasseditJobs.jobs[i].action = 'Start processing';
                        MasseditJobs.jobs[i].action_color  = 'btn-default';
                        MasseditJobs.jobs[i].status_color  = 'massedit-white';
                        break;
                   case 'processed':
                        MasseditJobs.jobs[i].action = 'Done';
                        MasseditJobs.jobs[i].action_color  = 'massedit-green';
                        MasseditJobs.jobs[i].status_color  = 'massedit-green';
                        break;
                   case 'processing':
                        MasseditJobs.jobs[i].action = 'Abort';
                        MasseditJobs.jobs[i].action_color  = 'btn-warning';
                        MasseditJobs.jobs[i].status_color  = 'massedit-chartreuse';
                        break;
                   case 'aborted':
                        MasseditJobs.jobs[i].action = 'Resume';
                        MasseditJobs.jobs[i].action_color  = 'btn-default';
                        MasseditJobs.jobs[i].status_color  = 'massedit-orange';
                        break;
                   case 'failed':
                        MasseditJobs.jobs[i].action = 'Resume';
                        MasseditJobs.jobs[i].action_color  = 'btn-default';
                        MasseditJobs.jobs[i].status_color  = 'massedit-red';
                        break;
                   default:
                        MasseditJobs.jobs[i].action = 'Force resume';
                        MasseditJobs.jobs[i].action_color  = 'massedit-orange';
                        MasseditJobs.jobs[i].status_color  = 'massedit-gray';
             }
          }
    }



    $scope.getActionButtonStatus = function () { 

         var promise =  FrontendService.MEjobsRefreshActButt();
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
            $scope.loadingTracker.addPromise(promise); 
            promise.then(
                  function(response) { 
                         $scope.refreshActionButton(response.data.jobsArray);
                         $scope.alerts = response.data.alerts;
                         $scope.form_disabled = false;
                  }
                  ,function(response) {
                         $scope.alerts = response.data.alerts;
                         if(typeof($scope.alerts) != "undefined"){
                             $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                         }
                         $scope.form_disabled = false;
                 }
           );
     }

     $scope.refreshActionButton = function (jobsArray) {

           for (var i = 0 ; i < MasseditJobs.jobs.length  ; i++) {
              for (var j = 0 ; j <jobsArray.length  ; j++) {
                    if(MasseditJobs.jobs[i].id == jobsArray[j].id){
                         MasseditJobs.jobs[i].job_status   = jobsArray[j].job_status;
			  MasseditJobs.jobs[i].job_progress = jobsArray[j].job_progress;
                    }
              }
          }
          $scope.updateButtonColors();
     }



    $scope.recordsPerPage = function (recordsPerPage) { 

       MasseditJobs.recordsPerPageNum = recordsPerPage;
       $scope.setPage(1);
    }


    $scope.setPage = function (page) {

        $scope.currentPageInPaginator = page;
        MasseditJobs.setPage(MasseditJobs, page);
	
	
	/*
	 $scope.currentPageInPaginator = page;
	var start  = (page-1)*$scope.recordsPerPageNum ;
        var max = (page-1)*$scope.recordsPerPageNum + $scope.recordsPerPageNum - 1;						      
        $scope.jobsDisplay = [];
        for (var i = start; i <= max  ; i++) {
               if('undefined' !== typeof  $scope.jobs[i] ){  
                          $scope.jobsDisplay.push($scope.jobs[i]);
               }
        }
        */
    }

    $scope.sortStartAt = function() {  

         //  ascending = 1, descending = 0
        if($scope.sortOrder == 1){
                    MasseditJobs.jobs.sort($scope.compareRecordsStartAt);
        }else{
                    MasseditJobs.jobs.sort($scope.compareRecordsStartAt);
                    MasseditJobs.jobs.reverse();
        } 
        $scope.setPage($scope.currentPageInPaginator);
    };

    $scope.sortStartAtClick = function() {  

         //  ascending = 1, descending = 0
        if($scope.sortOrder == 1){
                     MasseditJobs.jobs.sort($scope.compareRecordsStartAt);
                     $scope.sortOrder = 0;
        }else{
                     MasseditJobs.jobs.sort($scope.compareRecordsStartAt);
                     MasseditJobs.jobs.reverse();
                     $scope.sortOrder = 1;
        } 
        $scope.setPage($scope.currentPageInPaginator);
    };

    $scope.sortIdClick = function() {  

         //  ascending = 1, descending = 0
         if($scope.sortOrder == 1){
                     MasseditJobs.jobs.sort($scope.compareRecordsID);
                     $scope.sortOrder = 0;
         }else{
                     MasseditJobs.jobs.sort($scope.compareRecordsID);
                     MasseditJobs.jobs.reverse();
                     $scope.sortOrder = 1;
         } 
         $scope.setPage($scope.currentPageInPaginator);
    };

    $scope.sortJobStatusClick = function() {  

         //  ascending = 1, descending = 0
         if($scope.sortOrder == 1){
                    MasseditJobs.jobs.sort($scope.compareRecordsJobStatus);
                    $scope.sortOrder = 0;
         }else{
                    MasseditJobs.jobs.sort($scope.compareRecordsJobStatus);
                    MasseditJobs.jobs.reverse();
                    $scope.sortOrder = 1;
         } 
         $scope.setPage($scope.currentPageInPaginator);
    };
    $scope.sortOwnerClick = function() {  

         //  ascending = 1, descending = 0
        if($scope.sortOrder == 1){
                    MasseditJobs.jobs.sort($scope.compareRecordsOwner);
                    $scope.sortOrder = 0;
        }else{
                   MasseditJobs.jobs.sort($scope.compareRecordsOwner);
                   MasseditJobs.jobs.reverse();
                   $scope.sortOrder = 1;
        } 
        $scope.setPage($scope.currentPageInPaginator);
    };
    $scope.sortInstanceClick = function() {  

         //  ascending = 1, descending = 0
         if($scope.sortOrder == 1){
                     MasseditJobs.jobs.sort($scope.compareRecordsInstance);
                     $scope.sortOrder = 0;
         }else{
                     MasseditJobs.jobs.sort($scope.compareRecordsInstance);
                     MasseditJobs.jobs.reverse();
                     $scope.sortOrder = 1;
         } 
         $scope.setPage($scope.currentPageInPaginator);
    };

    $scope.compareRecordsInstance = function(a,b) { 

       if (a.instance < b.instance)  return -1;
       if (a.instance > b.instance)   return 1;
       return 0;
    };

    $scope.compareRecordsOwner = function(a,b) {

       if (a.owner < b.owner)  return -1;
       if (a.owner > b.owner)   return 1;
       return 0;
    };
    $scope.compareRecordsJobStatus = function(a,b) {

       if (a.job_status < b.job_status)  return -1;
       if (a.job_status > b.job_status)   return 1;
       return 0;
    };
    $scope.compareRecordsID = function(a,b) {

       if (a.id < b.id)  return -1;
       if (a.id > b.id)   return 1;
       return 0;
    };
    $scope.compareRecordsStartAt = function(a,b) {

       if (a.start_at < b.start_at)  return -1;
       if (a.start_at > b.start_at)   return 1;
       return 0;
    };
    $scope.viewJobs = function (jobId) {

            window.location = $('head base').attr('href')+'massedit/jobs/details/'+jobId;
    }

    $scope.jobAction = function (jobId, jobAction) {

            var promise =  FrontendService.MEagentAction(jobId, jobAction, $scope.currentPageInPaginator);
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
            $scope.loadingTracker.addPromise(promise); 
            promise.then(
                 function(response) { 
                         $scope.alerts = response.data.alerts;
                         $scope.form_disabled = false;
                 }
                ,function(response) {
                         $scope.alerts = response.data.alerts;
                         if(typeof($scope.alerts) != "undefined"){
                               $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                         }
                         $scope.form_disabled = false;
                 }
           );
    }

    $scope.deleteAllJobs = function () {
            
             var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/partials/massedit/yesnoMassedit.html',
                  controller: deleteAllJobsModalCtrl,
                  resolve: {
                            text: function(){
                                       return "You are going to delete\n all jobs in log. Unprocessed jobs will be lost. Do you like to continue?";
                                            }
                           }
             });
    }

    $scope.deleteJob= function (jobId) {

            var promise = FrontendService.MEagentDelete(jobId, $scope.currentPageInPaginator);
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
            $scope.loadingTracker.addPromise(promise); 
            promise.then(
                 function(response) { 
                         $scope.removeJobFromInternalArray(jobId);
                         $scope.setPage($scope.currentPageInPaginator);
                         $scope.alerts = response.data.alerts;
                         $scope.form_disabled = false;
                 }
                ,function(response) {
                        $scope.alerts = response.data.alerts;
                        if(typeof($scope.alerts) != "undefined"){
                                $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                        }
                        $scope.form_disabled = false;
                }
           ); 
    }

    $scope.removeJobFromInternalArray = function (jobId) {

          for (var i = 0 ; i < MasseditJobs.jobs.length  ; i++) {
               if(MasseditJobs.jobs[i].id == jobId){
                      MasseditJobs.jobs.splice(i, 1);
                      break;
               }
          }
    }

    $scope.toLocal= function (time) {

         var utcSeconds = time;
         var date = new Date(0); 
         date.setUTCSeconds(utcSeconds);
         date = date.toString();
         return date;
    }

});


var deleteAllJobsModalCtrl = function ($scope, $modalInstance, $location, FrontendService, MasseditJobs,  promiseTracker, text) {
  
       $scope.text = text; 
       
       $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
           };
       
       $scope.OK = function () {
	
	    var promise = FrontendService.MEagentDeleteAll();
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
            $scope.loadingTracker.addPromise(promise); 
            promise.then(
                 function(response) { 
                        MasseditJobs.jobs = [];
			 MasseditJobs.jobsDisplay = [];
                        MasseditJobs.setPage(1);
                        $scope.alerts = response.data.alerts;
                        $scope.form_disabled = false;
                 }
                ,function(response) {
                         $scope.alerts = response.data.alerts;
                         if(typeof($scope.alerts) != "undefined"){
                               $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                         }
                         $scope.form_disabled = false;
                }
           );
	    $modalInstance.dismiss('OK');
       }
  
}