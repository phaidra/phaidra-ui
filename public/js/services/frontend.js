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
		getUwmdatatree: function(){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'proxy/get_uwmetadata_tree'
			});	        
		},
	       saveAsMassTemplate: function(user, templatename, selections, datastructure){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/saveastemplate',
				data  : { user: user, templatename: templatename, selections: selections, datastructure: datastructure }
			});	        
		},
	        loadMassTemplate: function(owner, template){
	             alert(template);
		     return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/loadtemplate',
				data  : { owner: owner, template: template }
			});	        
		},
	       deleteMassTemplate: function(owner, fordeletion){
			return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'massedit/deletetemplate',
				data  : { owner: owner, fordeletion: fordeletion }
			});	        
		},
	}
});
