angular.module('directoryService', ['Base64'])
.factory('DirectoryService', function($http, Base64) {
	
	return {
	    getOrgUnits: function(parent_id, values_namespace) {
	         //return the promise directly.
	         return $http({
	             method  : 'GET',
	             url     : $('head base').attr('href')+'proxy/get_directory_get_org_units',
	             params  : { parent_id: parent_id, values_namespace: values_namespace }
	         	//headers : are by default application/json
	         });
	    },
	    
	    getStudy: function(spl, ids, values_namespace) {
	         return $http({
	             method  : 'GET',
	             url     : $('head base').attr('href')+'proxy/get_directory_get_study',
	             params  : { spl: spl, ids: ids, values_namespace: values_namespace }
	         });
	    },
	    
	    getStudyName: function(spl, ids) {
	         return $http({
	             method  : 'GET',
	             url     : $('head base').attr('href')+'proxy/get_directory_get_study_name',
	             params  : { spl: spl, ids: ids }
	         });
	    },
	    
	    signin: function(username, password) {

	         return $http({
	             method  : 'GET',
	             url     : $('head base').attr('href')+'signin',
	             headers: {'Authorization': 'Basic ' + Base64.encode(username + ':' + password)}
	         });
	    }
	}
});