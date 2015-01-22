var myMassEditService = angular.module('massEditService', ['metadataService', 'frontendService', 'ajoslin.promise-tracker']);

myMassEditService.factory('Massedit', function( MetadataService,FrontendService , promiseTracker) {

                                       var self = this;
                                       this.getTitles = function (Massedit, newPid) {
                                                           for( var i = 0 ; i < Massedit.datastructuredisplay.length ; i++ ){
                                                                 if(typeof newPid !== 'undefined'){ 
                                                                         if(Massedit.datastructuredisplay[i].PID == newPid){
                                                                              var loadingTracker = promiseTracker('loadingTrackerFrontend'); 
                                                                              var promise = MetadataService.get_object_tripl(newPid, 1);
                                                                              loadingTracker.addPromise(promise); 
                                                                              promise.then(
                                                                                     function(response) { 
                                                                                              Massedit.alerts = response.data.alerts;
                                                                                              self.updatePidTripl(Massedit, response.data);
                                                                                     }
                                                                                    ,function(response) {
                                                                                             Massedit.alerts = response.data.alerts;
                                                                                             Massedit.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                                                                                     }
                                                                              );
                                                                              Massedit.loadingTracker = loadingTracker;  
                                                                        }
                                                                  }else{
                                                                        var loadingTracker = promiseTracker('loadingTrackerFrontend');
                                                                        var promise = MetadataService.get_object_tripl(Massedit.datastructuredisplay[i].PID, 1);
                                                                        loadingTracker.addPromise(promise); 
							              promise.then(
                                                                                     function(response) { 
                                                                                              Massedit.alerts = response.data.alerts;
                                                                                              self.updatePidTripl(Massedit, response.data);
                                                                                      }
                                                                                     ,function(response) {
                                                                                              Massedit.alerts = response.data.alerts;
                                                                                              Massedit.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                                                                                      }
                                                                         );
                                                                         Massedit.loadingTracker = loadingTracker; 
                                                                 }
                                                           }
                                        }
                                        this.updatePidTripl = function (Massedit, responseData) {

                                                                  if(typeof responseData.result !== 'undefined' && responseData.result !== null){
                                                                           if(responseData.result.length !== 0 ){
                                                                                var titleWithPid = self.parseTripl(responseData);					  
                                                                                for( var i = 0 ; i < Massedit.datastructuredisplay.length ; i++ ){
                                                                                     if(Massedit.datastructuredisplay[i].PID == titleWithPid.PID){
                                                                                            Massedit.datastructuredisplay[i].title = titleWithPid.title;
                                                                                     } 
                                                                                }
                                                                           }
                                                                           else{
                                                                                 console.log("response.data.result length is zero!");
                                                                           }
                                                                    }
                                                                    else{
                                                                          console.log("response.data.result is undefined or null!");  
                                                                    }
                                        }
                                        this.parseTripl = function (tripData) {

                                                                 var titleWithPid = {};
                                                                 var title = '';
                                                                 var titleLanguage = self.getTitleInLanguage(tripData.result); 
                                                                 var pid = self.getPidTripl(titleLanguage[0]);                  
                                                                 var rawTitle = titleLanguage[2];
                                                                 // because of '@' in the string
                                                                 var titleSplitWithEt = rawTitle.split("@");
                                                                 for( var j = 0 ; j < titleSplitWithEt.length - 1 ; j++ ){
                                                                       var temp;
                                                                       if(j == titleSplitWithEt.length - 2){
                                                                               temp = titleSplitWithEt[j];
                                                                       }else{
                                                                               temp = titleSplitWithEt[j]+'@';
                                                                       }
                                                                       title = title+temp;
                                                                 }
                                                                 //remove quotation marks at the beginig and end of the title
                                                                 title = title.substring(1);
                                                                 title = title.substring(0, title.length - 1);
                                                                 titleWithPid.PID = pid;
                                                                 titleWithPid.title = title;

                                                                 return titleWithPid;
                                        }
                                        this.getPidTripl = function (object) {
                                                                 var pid = /o:[0-9]+/.exec(object); 
                                                                 return pid[0];
                                        }
                                        this.getTitleInLanguage = function (titlesRes) {

                                                                        var titleInLanguage; 
                                                                        for( var i = 0 ; i < titlesRes.length ; i++ ){
                                                                              var titleArr = titlesRes[i][2].split("@");
                                                                              if(titleArr[titleArr.length-1] == 'eng'){
                                                                                    titleInLanguage = titlesRes[i];
                                                                                    break;
                                                                              }
                                                                              if(titleArr[titleArr.length-1] == 'deu'){
                                                                                    titleInLanguage = titlesRes[i];
                                                                              }
                                                                        }
                                                                        if(typeof titleInLanguage === 'undefined' ){
                                                                              titleInLanguage = titlesRes[0];  
                                                                        }
 
                                                                        return titleInLanguage;					       
                                        }
                                       return {
                                               fieldvalue: "", 
                                               currentField: "",
                                               initdata: "",
                                               titleDisplay: "",
                                               records: [], 
                                               datastructure: [],
                                               changesFirst: [],
                                               alerts: [],
                                               sortOrder: 1,
                                               loadingTracker: function() {},
                                               limit: "",
                                               selection: [],
                                               // add/update  new field with corresponding value to the datastructure in all records
                                               dataStructureUpdate: function(fieldvalue, fieldname, datastructure) {
                                                                       if('undefined' !== typeof fieldname ){
                                                                            var fieldExist = 0;
                                                                            if('undefined' !== typeof datastructure[0].changes ){
                                                                                  for(var m = 0 ; m < datastructure[0].changes.length ; m++) {
                                                                                        if(datastructure[0].changes[m].field === fieldname){
                                                                                              fieldExist = 1;
                                                                                        } 
                                                                                  }
                                                                            } 
                                                                            loop1:
                                                                            for( var j = 0 ; j < datastructure.length ; j++ ){
                                                                                   if('undefined' !== typeof datastructure[j].changes && datastructure[j].changes.length > 0){
                                                                                       loop2:
                                                                                       for(var k = datastructure[j].changes.length - 1; k >= 0; k--) {
                                                                                           if(fieldExist){
                                                                                                if(datastructure[j].changes[k].field === fieldname){
                                                                                                    datastructure[j].changes[k].value = fieldvalue;
                                                                                                }
                                                                                           }
                                                                                           else{
                                                                                                   var newfield = {};
                                                                                                   newfield.field = fieldname;
                                                                                                   newfield.value = fieldvalue;
                                                                                                   datastructure[j].changes.push(newfield);
                                                                                                   continue loop1;
                                                                                           }
                                                                                       }
                                                                                   }else{
                                                                                         var changes = [];
                                                                                         var newfield = {};
                                                                                         newfield.field = fieldname;
                                                                                         newfield.value = fieldvalue;
                                                                                         changes.push(newfield);
                                                                                         datastructure[j].changes = changes;
                                                                                   }
                                                                            } 
                                                                       }
                                                                       return datastructure;
                                                                  },
                                              updateDataStructureDisplay: function(page, Massedit, newPid) {
                                                                                var start  = (page-1)*Massedit.limit ;
                                                                                var max = (page-1)*Massedit.limit + Massedit.limit - 1;
                                                                                Massedit.datastructuredisplay = [];
                                                                                for (var i = start; i <= max  ; i++) {
                                                                                      if('undefined' !== typeof Massedit.datastructure[i] ){  
                                                                                             Massedit.datastructuredisplay.push(Massedit.datastructure[i]);
                                                                                      }
                                                                                }
                                                                                if(Massedit.titleDisplay){
                                                                                      self.getTitles(Massedit, newPid);
                                                                                }
                                                                          },
                                              saveSelection: function(Massedit) {
                                                                  console.log('Masseditselection: ',Massedit.selection);
						                var promise = FrontendService.updateSelection(Massedit.selection);
                                                                  var loadingTracker = promiseTracker('loadingTrackerFrontend'); 
                                                                  loadingTracker.addPromise(promise);
                                                                  promise.then(
                                                                         function(response) { 
                                                                                Massedit.alerts = response.data.alerts;
                                                                                Massedit.form_disabled = false;
                                                                         }
                                                                        ,function(response) {
                                                                                Massedit.alerts = response.data.alerts;
                                                                                if(typeof Massedit.alerts  !== 'undefined'){
                                                                                        Massedit.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                                                                                }
                                                                                Massedit.form_disabled = false;
                                                                         }
                                                                 );
                                                                 Massedit.loadingTracker = loadingTracker; 	  
					                  }                             
                                              }
                                   }
                     );
