angular.module('frontendService', [])
.factory('FrontendService', function($http) {
	
	return {
		
		updateSelection: function(selection){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'selection',
				data    : { selection: selection }
			});	        
		},
		
		getSelection: function(selection){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'selection'
			});	        
		},
	        //TODO move to masseedit service! 
	        MEapllychanges: function(owner, items){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/apllychanges',
				data    : { owner: owner, items: items }
			});	        
		},
	        MEagentAction: function(jobId, jobAction, currPageInPaginator){
		       return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/jobs/action',
				data    : { jobId: jobId, jobAction: jobAction, currPageInPaginator: currPageInPaginator }
			});	        
		},
	        MEagentDelete: function(jobId, currPageInPaginator){
		       return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'massedit/jobs/delete',
				data    : { jobId: jobId, currPageInPaginator: currPageInPaginator }
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
				url     : $('head base').attr('href')+'massedit/jobs/details/refresh_alerts',
				data    : { jobId: jobId}
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
				data    : { user: user, templatename: templatename, selections: selections, datastructure: datastructure }
			});	        
		},
	        deleteMassTemplate: function(owner, fordeletion){
			return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'massedit/template/delete',
				data    : { owner: owner, fordeletion: fordeletion }
			});	        
		},
	 	loadMassTemplate: function(template){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/template/load',
				data    : { template: template }
			});	        
		},
	        getSort: function(){
			return 'uw.general.title,SCORE';
		},
	        viewObject: function(pid, pidExtended){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'view/'+pid,
				data  : { pidExtended: pidExtended }
			});
		},
	        //?????
	        viewObject2: function(pid, pidExtended){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'view/'+pid,
				params  : { pidExtended: pidExtended }
			});
		},
	        rightsGetUsers: function(query){
		  	return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'get_users/',
				params  : { query: query }
			});
		},
	 	getFacultyIdFromDepatment: function(depatmentId){
			console.log('abc', depatmentId);
		        return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'get_faculty_id_from_department',
				params  : { id: depatmentId }
			});
		},
		
		
	}
});
