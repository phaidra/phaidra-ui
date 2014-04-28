angular.module('searchService', [])
.factory('SearchService', function($http) {
	
	return {
		
		getUserObjects: function(username, from, limit, sort, reverse){
			var user = username ? username : '';
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'proxy/objects/' + user,
				params  : { from: from, limit: limit, sort: sort, reverse: reverse }
			});	        
		},
		
		search: function(query, from, limit, sort, reverse){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'proxy/search',
				params  : { q: query, from: from, limit: limit, sort: sort, reverse: reverse }
			});	        
		}
	}
});