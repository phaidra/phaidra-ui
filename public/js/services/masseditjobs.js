var myMassEditJobsService = angular.module('massEditJobsService', ['ajoslin.promise-tracker']);

myMassEditJobsService.factory('MasseditJobs', function( ) {
                                                  
                                                  return {
                                                          jobs: [],			                                   
			                                   recordsPerPageNum: "",			                                   
                                                          jobsDisplay: [],			          
                                                          setPage: function(MasseditJobs, page) {
							      	                   
                                                                        var start  = (page-1)*MasseditJobs.recordsPerPageNum ;
                                                                        var max = (page-1)*MasseditJobs.recordsPerPageNum + MasseditJobs.recordsPerPageNum - 1;						      
                                                                        MasseditJobs.jobsDisplay = [];
                                                                        for (var i = start; i <= max  ; i++) {
                                                                              if('undefined' !== typeof  MasseditJobs.jobs[i] ){  
                                                                                     MasseditJobs.jobsDisplay.push(MasseditJobs.jobs[i]);
                                                                              }
                                                                        }
							     }
                                                 }
                                             }
		             );

