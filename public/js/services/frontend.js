angular.module('frontendService', [])
.factory('FrontendService', function($http) {
	
	return {
		
		updateSelection: function(selection){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'selection',
				data  : { selection: selection }
			});	        
		},
		
		getSelection: function(selection){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'selection'
			});	        
		},
	        MEapllychanges: function(owner, items){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/apllychanges',
				data  : { owner: owner, items: items }
			});	        
		},
	        MEagentAction: function(jobId, jobAction, currPageInPaginator){
		       return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/jobs/action',
				data  : { jobId: jobId, jobAction: jobAction, currPageInPaginator: currPageInPaginator }
			});	        
		},
	        MEagentDelete: function(jobId, currPageInPaginator){
		       return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'massedit/jobs/delete',
				data  : { jobId: jobId, currPageInPaginator: currPageInPaginator }
			});	        
		},
	        MEagentDeleteAll: function(){
		       return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'massedit/jobs/delete_all'
			});	        
		},
	        MEjobsRefreshActButt: function(){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'massedit/jobs/refresh_action_button'
			});	        
		},
	        MEjobsDetailsRefreshAlerts: function(jobId){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/jobs/detail/refresh_alerts',
				data  : { jobId: jobId}
			});	        
		},
		getUwmdatatree: function(){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'proxy/get_uwmetadata_tree'
			});	        
		},
	        saveAsMassTemplate: function(user, templatename, selections, datastructure){
			return $http({
				method  : 'PUT',
				url     : $('head base').attr('href')+'massedit/template/saveas',
				data  : { user: user, templatename: templatename, selections: selections, datastructure: datastructure }
			});	        
		},
	        deleteMassTemplate: function(owner, fordeletion){
			return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'massedit/template/delete',
				data  : { owner: owner, fordeletion: fordeletion }
			});	        
		},
	 	loadMassTemplate: function(template){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/template/load',
				data  : { template: template }
			});	        
		},
	}
});
