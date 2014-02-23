angular.module('metadataService', [])
.factory('MetadataService', function($http) {
	
	return {
		getUwmetadataFromObject: function(pid) {
	         //return the promise directly.
	         return $http({
	             method  : 'GET',
	             url     : $('head base').attr('href')+'proxy/get_object_uwmetadata/'+pid
	         	//headers : are by default application/json
	         });
	    },
	
		getUwmetadataTree: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'uwmetadata/tree'
	        });	        
	   },
		
		getLanguages: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'metadata/languages'
	        });	        
	   },
	   
	   saveUwmetadataToObject: function(pid, uwmetadata){
		   return $http({
			   method  : 'POST',
	           url     : $('head base').attr('href')+'object/'+pid+'/uwmetadata',
	           data    : { uwmetadata: uwmetadata}
		   });	        
	   }
	}
});