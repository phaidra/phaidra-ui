app.controller('GroupsCtrl',  function($scope, $modal, $location, GroupsService, promiseTracker ) {
  
     //$scope.group_name;
        
   $scope.groups = [];
   $scope.groupsDisplay = []; 
   
   $scope.sortOrder = 1;
   $scope.currentPage = 1; // starting page
   $scope.maxSize = 10; // pages in paginator
   $scope.limit =   10; // records per page
   
   $scope.init = function (initdata) {
               
               //here!!!!!!!!!!!
               //TODO move group data load from init to separate call over service
               $scope.initdata = decodeURIComponent(initdata)
               console.log('initdata1 groups:',$scope.initdata);
               $scope.initdata = angular.fromJson($scope.initdata);
               console.log('initdata2 groups:',$scope.initdata);
               
               if($scope.initdata.json.groups){
                     $scope.groups = $scope.initdata.json.groups;
               }
               for (var i = 0; i <= $scope.limit-1 ; i++) {
               //if('undefined' !== typeof $scope.bookmarks[i] ){
               if('undefined' !== typeof $scope.groups && $scope.groups != null){
                   if('undefined' !== typeof $scope.groups[i] ){
                        //$scope.bookmarksdisplay.push($scope.bookmarks[i]);
                        $scope.groupsDisplay.push($scope.groups[i]);
                  }
               }
        }
   }
   
   $scope.sort = function() {
        /*  
         //  ascending = 1, descending = 0
         if($scope.sortOrder == 1){
                    BookmarkService.bookmarkPids.sort($scope.compareRecordsPID);
                    $scope.sortOrder = 0;
         }else{
                    BookmarkService.bookmarkPids.sort($scope.compareRecordsPID);
                    BookmarkService.bookmarkPids.reverse();
                    $scope.sortOrder = 1;
         }
         BookmarkService.updateBookmarkPidsDisplay(BookmarkService, $scope.currentPage, $scope.limit);
       */
   };
   
   $scope.setPage = function (page) {
       
       $scope.currentPage = page;
       
       var start  = (page-1)*$scope.limit ;
       var max = (page-1)*$scope.limit + $scope.limit - 1;
       $scope.groupsDisplay = [];
       for (var i = start; i <= max  ; i++) {
             //if('undefined' !== typeof $scope.bookmarks[i] ){
             if('undefined' !== typeof $scope.groups[i] ){
                     //$scope.bookmarksdisplay.push($scope.bookmarks[i]);
                     $scope.groupsDisplay.push($scope.groups[i]);
             }
       }
       
  }
  $scope.recordsPerPage = function (recordsPerPage) { 

        $scope.limit   = recordsPerPage;
        $scope.setPage(1);
  }
   
  $scope.addGroup = function () {
           
              var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/modals/groups/new_group.html',
                     controller: AddNewGroupModalCtrl,                     
              });
   }
   
   
});

var AddNewGroupModalCtrl = function ($scope, $modalInstance, GroupsService) {
        
       $scope.group_name = '';
        
       $scope.addGroup = function (group_name) {
               
             console.log('adding group group_name:',group_name);
             var promise = GroupsService.addGroup(group_name);
             $scope.loadingTracker.addPromise(promise);
             promise.then(
                    function(response) { 
                           $scope.alerts = response.data.alerts;
                           console.log('adding group.');
                           response.data;
                           $scope.form_disabled = false;
                   }
                  ,function(response) {
                           $scope.alerts = response.data.alerts;
                           $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                           $scope.form_disabled = false;
                   }
             );
       }
       
       $scope.OK = function (group_name) {
            $scope.addGroup(group_name);
            $modalInstance.dismiss('OK');
       };
   
       $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
       };
   
       $scope.hitEnter = function(evt,group_name){
           if(angular.equals(evt.keyCode,13)){
                  $scope.addGroup(group_name);
                  $modalInstance.dismiss('OK');
           }
       };
        
}