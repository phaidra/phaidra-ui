/*
 
Sevas, api pre grupy:

* uzivatel musi byt prihlaseny, takze posielat basic auth alebo token

Uzivatelove grupy:
GET https://services.phaidra-sandbox.univie.ac.at/api/groups

Result:
{
  "alerts": [],
  "groups": [
    {
      "created": 1443529100,
      "name": "xxx",
      "updated": 1443529100,
      "groupid": "2BF2E33E-66A4-11E5-A027-6E978F0EBC48"
    },
    {
      "created": 1443529100,
      "name": "1111",
      "updated": 1443529100,
      "groupid": "2BCB96C6-66A4-11E5-A027-6E978F0EBC48"
    },
    {
      "created": 1443529100,
      "name": "rasta",
      "updated": 1443777146,
      "groupid": "2BDB116E-66A4-11E5-A027-6E978F0EBC48"
    },
    {
      "created": 1443529100,
      "name": "ttt",
      "updated": 1443529100,
      "groupid": "2BE683AA-66A4-11E5-A027-6E978F0EBC48"
    }
  ]
}

=======================

Nacitat grupu:
GET https://services.phaidra-sandbox.univie.ac.at/api/group/2BDB116E-66A4-11E5-A027-6E978F0EBC48

Result:
{
  "group": {
    "owner": "hudakr4",
    "_id": {
      "$oid": "560a818c427c9a9850000076"
    },
    "name": "rasta",
    "old_groupid": "3111",
    "created": 1443529100,
    "members": [
      {
        "name": "Gerhard Gonter",
        "username": "gg"
      },
      {
        "name": "Lubica Hudakova",
        "username": "zelenkl7"
      },
      {
        "name": "Gerda Beidl",
        "username": "a4212500"
      }
    ],
    "groupid": "2BDB116E-66A4-11E5-A027-6E978F0EBC48",
    "updated": 1443777146
  },
  "alerts": []
}

=======================

Pridat grupu:
POST https://services.phaidra-sandbox.univie.ac.at/api/group/add
param: name=xyz

Result:
{
  "group": "C0EAC4F0-6E8A-11E5-80D9-D44E4BD7491C",
  "alerts": []
}


=======================

Zmazat grupu:
POST https://services.phaidra-sandbox.univie.ac.at/api/group/<groupid>/remove

=======================

Pridat clenov (aj ked ty to budes asi volat po jednom):
POST https://services.phaidra-sandbox.univie.ac.at/api/group/<groupid>/members/add

Request (form param 'members'):
{ "members": ["hudakr4","folcanm4"] }

=======================
Zmazat clenov (aj ked ty to budes asi volat po jednom):
POST https://services.phaidra-sandbox.univie.ac.at/api/group/<groupid>/members/remove

Request (form param 'members'):
{ "members": ["hudakr4","folcanm4"] }


-- 
Rastislav Hudak                             rastislav.hudak@univie.ac.at
Vienna University Computer Center           Phone: +43-1-4277-140 84
Ebendorferstraße 10, A-1010 Wien, Austria   Fax: +43-1-4277-143 38


 */
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