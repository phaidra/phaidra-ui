angular.module('searchService', [])
.factory('SearchService', function($http) {
	
	return {
		
		getUserObjects: function(username){
			var user = username ? username : '';
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'proxy/objects/' + user
			});	        
		}
	}
});