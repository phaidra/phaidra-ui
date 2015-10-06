angular.module('metadataService', [])
.factory('MetadataService', function($http) {
	
	return {
	   
	    getModsTree: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'proxy/get_mods_tree'
	        });
	    },
	    getUwmetadataTree: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'proxy/get_uwmetadata_tree'
	        });	        
	    },
            getLicenses: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'get_licenses'
	        });	        
	    },	
	 
	    getLanguages: function() {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'proxy/get_uwmetadata_languages'
	        });	        
	    }, 
	    getUwmetadataFromObject: function(pid) {
	         //return the promise directly.
	         return $http({
	             method  : 'GET',
	             url     : $('head base').attr('href')+'object/'+pid+'/uwmetadata'
	         	//headers : are by default application/json
	         });
	    },
	    getModsFromObject: function(pid){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'object/'+pid+'/mods',
			});	 
	    },
	    saveUwmetadataObject: function(pid, uwmetadata){
		 	return $http({
		 		method  : 'POST',
		 		url     : $('head base').attr('href')+'object/'+pid+'/uwmetadata',
		 		data    : { uwmetadata: uwmetadata }
		 	});
            },
	    saveModsObject: function(pid, mods){
		 	return $http({
		 		method  : 'POST',
		 		url     : $('head base').attr('href')+'object/'+pid+'/mods',
		 		data    : { mods: mods }
		 	});
            },
	    saveUwmetadataTemplateAs: function(title, uwmetadata){
		   return $http({
		   method  : 'PUT',
	           url     : $('head base').attr('href')+'template/create',
	           data    : { title: title, uwmetadata: uwmetadata }
		   });	        
	    },

	    saveUwmetadataTemplate: function(tid, uwmetadata){
	    	return $http({
	    		method  : 'POST',
	    		url     : $('head base').attr('href')+'template/'+tid,
	    		data    : { uwmetadata: uwmetadata }
	    	});	        
	    },
	    saveModsTemplateAs: function(title, mods){
			   return $http({
				method  : 'PUT',
		               url     : $('head base').attr('href')+'template/create',
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
				url     : $('head base').attr('href')+'template/get/all'
			});	        
	   },	 
	   getGeoObject: function(pid) {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'object/'+pid+'/geo'
	        });
	   },
	   //getGeoTemplate: function(tid) {
	   //     return $http({
	   //         method  : 'GET',
	   //         url     : $('head base').attr('href')+'template/'+tid+'/geo'
	   //     });
	   //},
	   saveGeoObject: function(pid, geo){
			        console.log('meta saveGeoObject pid:',pid);
			        console.log('meta saveGeoObject geo:',geo);
	                       return $http({
				       method  : 'POST',
				      url     : $('head base').attr('href')+'object/'+pid+'/geo',
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
				url     : $('head base').attr('href')+'proxy/get_object_tripl',
				params  : { q: q, limit: limit }
			});	        
	   },
	   getClassificationsFromUris: function(valueuris) {
		    return $http({
		        method  : 'POST',
		        url     : $('head base').attr('href')+'classification/get_classif_from_uris',
		        params  : { valueuris: valueuris }
		    });
	   },
	  //get clasificiation data from mods 
	  getModsClassifiLabes: function(mods) {
		    return $http({
		        method  : 'post',
		        url     : $('head base').attr('href')+'classification/mods/labels',
		        data    : { mods: mods }
		    });
	  },
	  getClassifications: function(){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'classification/get_user_classif'
			});
	  },
	  toggleClassification: function(uri){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'classification/toggle_classif',
				data    : { uri: uri }
			});
	 },
	 saveObjectClassifications: function(classif) {
		    return $http({
		        method  : 'post',
		        url     : $('head base').attr('href')+'classification/save_object',
		        data    : { classif: classif }
	 	    });
	 },
	 saveRightsObject: function(pid, rights) {
		    return $http({
		        method  : 'post',
		        url     : $('head base').attr('href')+'object/'+pid+'/rights',
		        data    : { rights: rights }
	 	    });
	 },
	 getRightsObject: function(pid) {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'object/'+pid+'/rights'
	        });
	 },
	 getDublincore: function(pid) {
	        return $http({
	            method  : 'GET',
	            url     : $('head base').attr('href')+'dublincore/'+pid
	        });
	 },
	 
      }
});