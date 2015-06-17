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

	    saveUwmetaTemplateAs: function(title, uwmetadata){
		   return $http({
		   method  : 'PUT',
	           url     : $('head base').attr('href')+'template',
	           data    : { title: title, uwmetadata: uwmetadata }
		   });	        
	    },

	    saveUwmetaTemplate: function(tid, uwmetadata){
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
	    
	   getAllTemplates: function(){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'templates/get_all'
			});	        
	   },	 
	   getGeo: function(pid) {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'object/'+pid+'/geo'
	        });
	   },
	   saveGeoObject: function(pid, geo){
			        console.log('meta saveGeoObject pid:',pid);
			        console.log('meta saveGeoObject geo:',geo);
	                       return $http({
				       method  : 'POST',
				      url     : $('head base').attr('href')+'object/'+pid+'/geo/',
				      data    : { geo: geo }
			       });
	   },
	   saveGeoTemplate: function(tid, geo){
		 	return $http({
		 		method  : 'POST',
		 		url     : $('head base').attr('href')+'template/'+tid,
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
		        url     : $('head base').attr('href')+'view/classifications/get',
		        params  : { valueuris: valueuris }
		    });
	   },
	   get_mods: function(pid){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'object/'+pid+'/mods/',
			});	 
	   },
	   saveModsTemplateAs: function(title, mods){
			   return $http({
				method  : 'PUT',
		               url     : $('head base').attr('href')+'template',
		               data    : { title: title, mods: mods }
			   });
           },
	   saveModsTemplate: function(tid, mods){
		 	return $http({
		 		method  : 'POST',
		 		url     : $('head base').attr('href')+'template/'+tid,
		 		data    : { mods: mods }
		 	});
           },
	   getModsTree: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'proxy/get_mods_tree'
	        });
	   },
	   getModsClassifications: function(mods) {
		    return $http({
		        method  : 'POST',
		        url     : $('head base').attr('href')+'mods/classifications',
		        data    : { mods: mods }
		    });
	  },

	   
	}
});