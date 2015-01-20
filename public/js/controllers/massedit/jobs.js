app.controller('MasseditJobsCtrl',  function($scope, $timeout, FrontendService, promiseTracker) {  

      $scope.statusActions = [];

      $scope.jobs = [];
      $scope.jobsDisplay = [];
      $scope.maxSize = 10; // pages in paginator
      $scope.recordsPerPageNum = 10;
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

         $scope.jobs = init_data.jobsArray;
         $scope.updateButtonColors();
         $scope.sortStartAt();	
         $scope.setPage(1);


         setInterval($scope.getActionButtonStatus, $scope.refreshInterval);

    }

    $scope.updateButtonColors = function () {

           for (var i = 0 ; i < $scope.jobs.length  ; i++) {
               switch($scope.jobs[i].job_status) {
                   case 'not processed':
                        $scope.jobs[i].action = 'Start processing';
                        $scope.jobs[i].action_color  = 'btn-default';
                        $scope.jobs[i].status_color  = 'massedit-white';
                        break;
                   case 'processed':
                        $scope.jobs[i].action = 'Done';
                        $scope.jobs[i].action_color  = 'massedit-green';
                        $scope.jobs[i].status_color  = 'massedit-green';
                        break;
                   case 'processing':
                        $scope.jobs[i].action = 'Abort';
                        $scope.jobs[i].action_color  = 'btn-warning';
                        $scope.jobs[i].status_color  = 'massedit-chartreuse';
                        break;
                   case 'aborted':
                        $scope.jobs[i].action = 'Resume';
                        $scope.jobs[i].action_color  = 'btn-default';
                        $scope.jobs[i].status_color  = 'massedit-orange';
                        break;
                   case 'failed':
                        $scope.jobs[i].action = 'Resume';
                        $scope.jobs[i].action_color  = 'btn-default';
                        $scope.jobs[i].status_color  = 'massedit-red';
                        break;
                   default:
                        $scope.jobs[i].action = 'Force resume';
                        $scope.jobs[i].action_color  = 'massedit-orange';
                        $scope.jobs[i].status_color  = 'massedit-gray';
             }
          }
    }



    $scope.getActionButtonStatus = function () { 

         var promise =  FrontendService.MEagentRefreshActButt();
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

           for (var i = 0 ; i < $scope.jobs.length  ; i++) {
              for (var j = 0 ; j <jobsArray.length  ; j++) {
                    if($scope.jobs[i].id == jobsArray[j].id){
                         $scope.jobs[i].job_status = jobsArray[j].job_status;
                    }
              }
          }
          $scope.updateButtonColors();
     }



    $scope.recordsPerPage = function (recordsPerPage) { 

       $scope.recordsPerPageNum = recordsPerPage;
       $scope.setPage(1);
    }


    $scope.setPage = function (page) {

        $scope.currentPageInPaginator = page;
        var start  = (page-1)*$scope.recordsPerPageNum ;
        var max = (page-1)*$scope.recordsPerPageNum + $scope.recordsPerPageNum - 1;						      
        $scope.jobsDisplay = [];
        for (var i = start; i <= max  ; i++) {
               if('undefined' !== typeof  $scope.jobs[i] ){  
                          $scope.jobsDisplay.push($scope.jobs[i]);
               }
        }
    }

    $scope.sortStartAt = function() {  

         //  ascending = 1, descending = 0
        if($scope.sortOrder == 1){
                    $scope.jobs.sort($scope.compareRecordsStartAt);
        }else{
                    $scope.jobs.sort($scope.compareRecordsStartAt);
                    $scope.jobs.reverse();
        } 
        $scope.setPage($scope.currentPageInPaginator);
    };

    $scope.sortStartAtClick = function() {  

         //  ascending = 1, descending = 0
        if($scope.sortOrder == 1){
                     $scope.jobs.sort($scope.compareRecordsStartAt);
                     $scope.sortOrder = 0;
        }else{
                     $scope.jobs.sort($scope.compareRecordsStartAt);
                     $scope.jobs.reverse();
                     $scope.sortOrder = 1;
        } 
        $scope.setPage($scope.currentPageInPaginator);
    };

    $scope.sortIdClick = function() {  

         //  ascending = 1, descending = 0
         if($scope.sortOrder == 1){
                     $scope.jobs.sort($scope.compareRecordsID);
                     $scope.sortOrder = 0;
         }else{
                     $scope.jobs.sort($scope.compareRecordsID);
                     $scope.jobs.reverse();
                     $scope.sortOrder = 1;
         } 
         $scope.setPage($scope.currentPageInPaginator);
    };

    $scope.sortJobStatusClick = function() {  

         //  ascending = 1, descending = 0
         if($scope.sortOrder == 1){
                    $scope.jobs.sort($scope.compareRecordsJobStatus);
                    $scope.sortOrder = 0;
         }else{
                    $scope.jobs.sort($scope.compareRecordsJobStatus);
                    $scope.jobs.reverse();
                    $scope.sortOrder = 1;
         } 
         $scope.setPage($scope.currentPageInPaginator);
    };
    $scope.sortOwnerClick = function() {  

         //  ascending = 1, descending = 0
        if($scope.sortOrder == 1){
                    $scope.jobs.sort($scope.compareRecordsOwner);
                    $scope.sortOrder = 0;
        }else{
                   $scope.jobs.sort($scope.compareRecordsOwner);
                   $scope.jobs.reverse();
                   $scope.sortOrder = 1;
        } 
        $scope.setPage($scope.currentPageInPaginator);
    };
    $scope.sortInstanceClick = function() {  

         //  ascending = 1, descending = 0
         if($scope.sortOrder == 1){
                     $scope.jobs.sort($scope.compareRecordsInstance);
                     $scope.sortOrder = 0;
         }else{
                     $scope.jobs.sort($scope.compareRecordsInstance);
                     $scope.jobs.reverse();
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
            var promise = FrontendService.MEagentDeleteAll();
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
            $scope.loadingTracker.addPromise(promise); 
            promise.then(
                 function(response) { 
                        $scope.jobs = [];
                        $scope.setPage(1);
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

          for (var i = 0 ; i < $scope.jobs.length  ; i++) {
               if($scope.jobs[i].id == jobId){
                      $scope.jobs.splice(i, 1);
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