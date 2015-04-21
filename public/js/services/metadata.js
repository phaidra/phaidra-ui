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
	    getModsFromObjectTest: function(pid) {
	         //return the promise directly.
	         return $http({
	             method  : 'GET',
	             url     : $('head base').attr('href')+'proxy/get_object_mods_test/'+pid
	         	//headers : are by default application/json
	         });
	    },
	    getUwmetadataTree: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'proxy/get_uwmetadata_tree'
	        });	        
	    },
		
	    getLanguages: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'proxy/get_uwmetadata_languages'
	        });	        
	    },
	   
	    saveUwmetadataToObject: function(pid, uwmetadata){
		   return $http({
			   method  : 'POST',
	           url     : $('head base').attr('href')+'proxy/save_object_uwmetadata/'+pid,
	           data    : { uwmetadata: uwmetadata }
		   });	        
	    },

	    saveTemplateAs: function(title, uwmetadata){
		   return $http({
			   method  : 'PUT',
	           url     : $('head base').attr('href')+'template',
	           data    : { title: title, uwmetadata: uwmetadata }
		   });	        
	    },

	    saveTemplate: function(tid, uwmetadata){
	    	return $http({
	    		method  : 'POST',
	    		url     : $('head base').attr('href')+'template/'+tid,
	    		data    : { uwmetadata: uwmetadata }
	    	});	        
	    },
	    
	   deleteTemplate: function(tid){
			return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'template/'+tid
			});	        
		},
	    
	   loadTemplate: function(tid){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'template/'+tid
			});	        
	    },
	    
	   getMyTemplates: function(){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'templates/my'
			});	        
	   },
	   
	   getGeo: function(bagid) {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'bag/'+bagid+'/geo'
	        });
	   },
           //delete it
	   saveGeo: function(bagid, geo){
			   return $http({
				   method  : 'POST',
				   url     : $('head base').attr('href')+'bag/'+bagid+'/geo/',
				   data    : { geo: geo }
			   });
	   },
	 
	   get_object_tripl: function(q, limit){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'proxy/get_object_tripl/',
				params  : { q: q, limit: limit }
			});	        
	   },
	   getClassifications: function(valueuris) {
		    return $http({
		        method  : 'POST',
		        url     : $('head base').attr('href')+'view/getclassifications',
		        params  : { valueuris: valueuris }
		    });
	   }
	   
	}
});