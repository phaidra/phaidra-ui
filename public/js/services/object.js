angular.module('objectService', [])
.factory('ObjectService', function($http) {
	
	return {
		
		createCollection: function(uwmetadata, members){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'/proxy/collection/create',
				data  : { uwmetadata: uwmetadata, members: members }
			});	        
		}
	}
});