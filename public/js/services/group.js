angular.module('groupsService', ['ajoslin.promise-tracker'])
.factory('GroupsService', function($http,$rootScope) {
        
         return {
                    addGroup: function(group_name){
                        return $http({
                                method  : 'POST',
                                url     : $('head base').attr('href')+'groups/add',
                                data    : { group_name: group_name }
                        });             
                    },
                    groups: [], 
                    groupsDisplay: []
                 
                }
});