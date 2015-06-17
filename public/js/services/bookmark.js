angular.module('bookmarkService', ['ajoslin.promise-tracker'])
.factory('BookmarkService', function($http,$rootScope) {
     return {
                createBookmark: function(bookmarkname){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'bookmark/create',
				params  : { bookmarkname: bookmarkname }
			});
		},
	 	getBookmark: function(){
			return $http({
				method  : 'GET',
				url     : $('head base').attr('href')+'bookmark/get',
			});
		},
	 	addToBookmark: function(pid, currentBookmarkId){
		        return $http({
				method  : 'POST',
				url     : $('head base').attr('href')+'bookmark/addto',
				data    : { pid: pid, currentBookmarkId: currentBookmarkId },
			});
		},
	 	deleteBookmark: function(bookmarkId){
			return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'bookmark/delete',
				data    : { bookmarkId: bookmarkId },
			});
		},
	 	deleteAllBookmark: function(){
			return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'bookmark/deleteall',
			});
		},
	        deleteBookmarkPid: function(bookmarkId, pid){
			return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'bookmark/deletepid',
				data    : { bookmarkId: bookmarkId, pid: pid },
			});
		},
	 	deleteAllBookmarkPid: function(bookmarkId){
			return $http({
				method  : 'DELETE',
				url     : $('head base').attr('href')+'bookmark/deleteallpid',
				data    : { bookmarkId: bookmarkId },
			});
		},
	        currentBookmark: "",
	        bookmarks: [],
	        bookmarksWithId: [],
	        bookmarksdisplay: [],
	        alerts: [],
	        bookmarkPids: [],
	        bookmarkpidsdisplay: [],
	        updateBookmarksDisplay: function(FrontendService, page, limit) {
                                                                                 var start  = (page-1)*limit ;
                                                                                 var max = (page-1)*limit + limit - 1;
                                                                                 FrontendService.bookmarksdisplay = [];     
                                                                                 for (var i = start; i <= max  ; i++) {
                                                                                      if('undefined' !== typeof FrontendService.bookmarks[i] ){  
                                                                                            FrontendService.bookmarksdisplay.push(FrontendService.bookmarks[i]);
                                                                                      }
                                                                                 }
                                                                               },
	        updateBookmarkPidsDisplay: function(FrontendService, page, limit) {
                                                                                   var start  = (page-1)*limit ;
                                                                                   var max = (page-1)*limit + limit - 1;
                                                                                   FrontendService.bookmarkpidsdisplay = [];     
                                                                                   for (var i = start; i <= max  ; i++) {
                                                                                       if('undefined' !== typeof FrontendService.bookmarkPids && FrontendService.bookmarkPids != null){
										               if('undefined' !== typeof FrontendService.bookmarkPids[i] ){
                                                                                                  FrontendService.bookmarkpidsdisplay.push(FrontendService.bookmarkPids[i]);
                                                                                             }
										        }
                                                                                   }
                                                                                 },
	        getBookmarks: function(FrontendService) {
                                                           var promise = FrontendService.getBookmark();
    	                                                   var loadingTracker = $rootScope.loadingTracker; 
							    loadingTracker.addPromise(promise);
    	                                                   promise.then(
    		                                                        function(response) {
    			                                                              FrontendService.alerts = response.data.alerts;
			                                                              FrontendService.bookmarks = response.data.bookmarks;
    		                                                        }
    		                                                       ,function(response) {
           		                                                              FrontendService.alerts = response.data.alerts;
           		                                                              if(typeof FrontendService.alerts == 'undefined'){
			                                                                      FrontendService.alerts = [];
			                                                              }
			                                                              FrontendService.alerts.unshift({type: 'danger', msg: "Error code "+response.status});           	                                                                   }
    	                                                                );
	                                                },   
     }
});