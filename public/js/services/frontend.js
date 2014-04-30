angular.module('frontendService', [])
.factory('FrontendService', function($http) {
	
	return {
		
		updateSelection: function(ids){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'selection',
				data  : { ids: ids }
			});	        
		}
		
	}
});