app.controller('MasseditCtrl',  function($scope, $rootScope, $modal, FrontendService, promiseTracker, Massedit) {

    $scope.flaged = 1;

    $scope.currentPage = 1; // starting page

    $scope.maxSize = 10; // pages in paginator

    $scope.limit =   10; // records per page
    Massedit.limit = 10;

    $scope.sort = 'uw.general.title,SCORE';

    $scope.sortOrder = 0 ;

    $scope.uwmFields = [];

    $scope.alerts = [];

    // get uwm tree for field list
    var promise = FrontendService.getUwmdatatree();
    $scope.loadingTracker.addPromise(promise); 
    promise.then(
                 function(response) { 
                         $scope.alerts = response.data.alerts;
                         $scope.uwm = response.data;
                 }
                ,function(response) {
                         $scope.alerts = response.data.alerts;
                         if(typeof $scope.alerts  !== 'undefined'){
                              $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                         }
                         $scope.form_disabled = false;
                 }
    );
    // we will use this to track running ajax requests to show spinner
    //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
    //$scope.loadingTracker = promiseTracker();
    $scope.loadingTracker = $rootScope.loadingTracker;
    
    $scope.alerts = [];

    $scope.selection = [];

    $scope.objects = [];

    $scope.initdata = '';

    $scope.current_user = '';

    $scope.titleDisplay = true;

    $scope.massedit = Massedit;

    $scope.saveAsCsv = angular.toJson(Massedit.datastructure);


    $scope.preparforsaving = function(index) {
           $scope.saveAsCsv = angular.toJson(Massedit.datastructure);
    };

    $scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
    };

    $scope.selectNone = function(){

        Massedit.selection = [];
        Massedit.saveSelection(Massedit);
    };

    $scope.selectVisible = function(){
        for( var i = 0 ; i < Massedit.datastructuredisplay.length ; i++ ){
              if(Massedit.selection.indexOf(Massedit.datastructuredisplay[i].PID) == -1){
                     Massedit.selection.push(Massedit.datastructuredisplay[i].PID);
              }
        }
        Massedit.saveSelection(Massedit);
    };

    $scope.selectAll = function(){
         Massedit.selection = [];
         for (var i = 0 ; i < Massedit.datastructure.length  ; i++) {
                 Massedit.selection.push(Massedit.datastructure[i].PID);
         }
         Massedit.saveSelection(Massedit);
    }

    $scope.loadSelection = function(page) {
          var promise = FrontendService.getSelection();
          $scope.loadingTracker.addPromise(promise);
          promise.then(
                function(response) { 
                         $scope.alerts = response.data.alerts;
                         Massedit.selection = response.data.selection;
                         if(!('undefined' === typeof Massedit.selection)){
                             if(Massedit.selection != null){
                                   Massedit.selection.sort();
                                   for (var j = 0; j < Massedit.selection.length  ; j++) {
                                        var selectedObject = {};
                                        selectedObject.PID = Massedit.selection[j];
                                        Massedit.datastructure.push(selectedObject);
                                   }
                             }
                         }
                         Massedit.updateDataStructureDisplay(page, Massedit);
                         $scope.form_disabled = false;
                 },
                 function(response) {
                         $scope.alerts = response.data.alerts;
                         if(typeof $scope.alerts  !== 'undefined'){
                               $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                         }
                         $scope.form_disabled = false;
                 }
         );
    }

    $scope.toggleObject = function(pid) {
        if( ('undefined' !== typeof Massedit.selection) && (Massedit.selection != null) ){
              var idx = Massedit.selection.indexOf(pid);
              if(idx == -1){
                     Massedit.selection.push(pid);
              }else{
                     Massedit.selection.splice(idx,1); 
              }
              Massedit.saveSelection(Massedit);
        }

    };

    $scope.setPage = function (page) {

            Massedit.updateDataStructureDisplay(page, Massedit);
            $scope.currentPage = page;
    };

    $scope.init = function (initdata) {
       try { 
	     Massedit.titleDisplay = true;
             $scope.initdata = angular.fromJson(initdata);

             $scope.current_user = $scope.initdata.current_user;

             Massedit.current_user = $scope.current_user;
             Massedit.templates = $scope.initdata.templates;

             if($scope.current_user){
                   Massedit.datastructure = [];
                   if( (typeof $scope.initdata.csv  !== 'undefined') && ($scope.initdata.csv !== 'empty') ){
                         //reading data from csv 
                         Massedit.selection = [];
                         var csvRows = $scope.initdata.csv.split('#mycsvseparator');
                         var columnNames = csvRows[0].split(',');
                         for( var i = 1 ; i < csvRows.length - 1 ; i++ ){
                               var csvRow = csvRows[i].split(',');
                               var record = {};
                               record.PID = csvRow[0];
                               Massedit.selection.push(csvRow[0]);
                               record.changes = [];
                               for( var j = 1 ; j < csvRow.length ; j++ ){
                                      var change = {};
                                      change.field = columnNames[j];
                                      change.value = csvRow[j];
                                      record.changes.push(change);
                               }
                               Massedit.datastructure.push(record);
                        }
                        Massedit.saveSelection(Massedit);
                        Massedit.updateDataStructureDisplay(1, Massedit);
                        // for remove-column row
                        Massedit.changesFirst = Massedit.datastructure[0].changes;
                  }else{
                       //initial empty template with selected objects and set datastructuredisplay
                       $scope.loadSelection(1);
                  }
              } 
          }
          catch(err) {
             var modalInstance = $modal.open({
                 templateUrl: $('head base').attr('href')+'views/modals/massedit/alertMsgMassedit.html',
                 controller: MEAlertsLoadCsvModalCtrl,
                 resolve: {
                           text: function(){
                                   return 'Csv file format error.\n Plese check your CSV file and try again.';
                               }
                          }
                });
          }
    };

    $scope.deleteRecord = function (pid) {

            for (var i = 0 ; i < Massedit.datastructure.length  ; i++) {
                 if(Massedit.datastructure[i].PID === pid){
                      Massedit.datastructure.splice(i, 1);
                      Massedit.updateDataStructureDisplay($scope.currentPage, Massedit);
                 }
            }
            var idx = Massedit.selection.indexOf(pid);
            if(idx !== -1){
                  Massedit.selection.splice(idx,1);
            }

            Massedit.saveSelection(Massedit);
     };

    $scope.getDatastructureFlaged = function () {

         var datastructureFlaged = [];
         for( var i = 0 ; i < Massedit.selection.length ; i++ ){
             for( var j = 0 ; j < Massedit.datastructure.length ; j++ ){
                   if(Massedit.selection[i] === Massedit.datastructure[j].PID){
                         datastructureFlaged.push(Massedit.datastructure[j]);
                   }
             }
         }
         if($scope.titleDisplay){
              //datastructureFlaged = $scope.getAllTitles(datastructureFlaged); // uncomment to save all titles in log
         }

         // remove titles from datastructureFlaged ! Uncomment this if need to save titles direct in log
        for( var i = 0 ; i < datastructureFlaged.length ; i++ ){
              datastructureFlaged[i].title = null;
        }
 
        return datastructureFlaged;
    };

    $scope.getAllTitles = function (datastructureFlaged) {

         Massedit.datastructuredisplay = datastructureFlaged;     
         Massedit.limit = datastructureFlaged.length;
	 Massedit.updateDataStructureDisplay(1, Massedit);
         datastructureFlaged = Massedit.datastructuredisplay;

         return datastructureFlaged;
    }

   $scope.apllychanges = function () {

          var modalInstance = $modal.open({
                templateUrl: $('head base').attr('href')+'views/modals/massedit/yesnoMassedit.html',
                controller: MEyesnoApplyModalCtrl,
                resolve: {
                          text:     function(){
                                         return 'Selected changes will be applied. Do you like to continue?';
                                              },
                          username: function(){
                                         return  $scope.current_user.username;
                                              },
                          flaged:   function(){
                                         return  $scope.getDatastructureFlaged();
                                              }
                        }
          });
  };

  $scope.removeField = function (field) {

       for (var g = 0; g < Massedit.datastructure.length; g++) {
            for(var k = Massedit.datastructure[g].changes.length - 1; k >= 0; k--){
	          if(Massedit.datastructure[g].changes[k].field === field){
			 Massedit.datastructure[g].changes.splice(k, 1);
	          }	   
            }
       }
  };

  $scope.getFields = function () {

        $scope.uwmFields = [];
        // seting if undefined when to fast clicking on choose field button
        if(typeof $scope.uwm  !== 'undefined'){
              $scope.getAllUwmFields($scope.uwm.tree);
        }
  };

  $scope.getAllUwmFields = function (tree) {  
       if('undefined' !== typeof tree ){
           for (var i = 0; i < tree.length; i++) {
                var child = tree[i];
                if('Node' !== child.datatype){
                      //if($scope.uwmFields.indexOf(child.xmlns) == -1) {
                           var field = {};
                           field.xmlname = child.xmlname;
                           field.xmlns   = child.xmlns;
                           field.help_id = child.help_id;
                           if(field.help_id == 'helpmeta_37'){
                                field.xmlname = field.xmlname+'#rights';
                           }
                           if(field.help_id == 'helpmeta_4'){
                                field.xmlname = field.xmlname+'#general';
                           }
                           $scope.uwmFields.push(field);
                     //}
                }
                $scope.getAllUwmFields(child.children);
           }
      }
  };

  $scope.recordsPerPage = function (recordsPerPage) { 

       $scope.limit   = recordsPerPage;
       Massedit.limit = recordsPerPage;
       Massedit.updateDataStructureDisplay(1, Massedit);
  }

    $scope.addField = function (field) {

             $scope.currentField = field;
             Massedit.currentField =  $scope.currentField;
             var modalInstance = $modal.open({
             templateUrl: $('head base').attr('href')+'views/modals/massedit/addfield.html',
             controller: MEAddFieldModalCtrl,
             resolve: {
                       current_field: function(){
                                       return $scope.currentField;
                                                }
                      }
            });
     };

     $scope.deleteAll = function () {  

          var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/modals/massedit/yesnoMassedit.html',
                  controller: MEyesnoDelAllModalCtrl,
                  resolve: {
                            text: function(){
                                       return "Are you sure you want to delete\n all records from template?";
                                            }
                           }
             });
     }

     $scope.templateSaveAs = function () {  

            var modalInstance = $modal.open({
                   templateUrl: $('head base').attr('href')+'views/modals/massedit/templateSaveAs.html',
                   controller: METemplateSaveAsModalCtrl,
                   resolve: {
                            selection: function(){
                                            return Massedit.selection;
                                                 }
                   }
           }); 

     };

     $scope.templateLoad = function () {  

            var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/modals/massedit/templateLoad.html',
                     controller: METemplateLoadModalCtrl,
            });
     };

     $scope.addRecord = function (record) {

            var modalInstance = $modal.open({
                   templateUrl: $('head base').attr('href')+'views/modals/massedit/addrecord.html',
                   controller: MEAddRecordModalCtrl
            }); 
     };

     $scope.templateDelete = function () {

            var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/modals/massedit/templateDelete.html',
                     controller: METemplateDeleteModalCtrl,
            });
     };

     $scope.editRecord = function (PID) {

             if('undefined' !== typeof Massedit.datastructure[0].changes){
                   if(Massedit.datastructure[0].changes.length > 0){
                        var modalInstance = $modal.open({
                               templateUrl: $('head base').attr('href')+'views/modals/massedit/editrecord.html',
                               controller: MEEditRecordModalCtrl,
                               resolve: {
                                      PID: function(){
                                                return PID;
                                                     }
                               }
                        }); 
                   }else{
                        $scope.popupNoFields();
                   }
            }else{
                  $scope.popupNoFields();
            }
     };
     $scope.popupNoFields = function () {
           var modalInstance = $modal.open({
                 templateUrl: $('head base').attr('href')+'views/modals/massedit/alertMsgMassedit.html',
                 controller: MEAlertsModalCtrl,
                 resolve: {
                           text: function(){
                                      return 'Add fields first!';
                                           }
                          }
                });
     };

     $scope.csvfileselected = {

        onSubmit : function(form) {
        var csvFile = $( "#fileupload" ).val();
              if((csvFile === "") || (csvFile === 'undefined')){
              var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/modals/massedit/alertMsgMassedit.html',
                  controller: MEAlertsModalCtrl,
                  resolve: {
                            text: function(){
	      	                      return 'Please select CSV file first!';
	      	                           }
	                   }
                  }); 
	      form.preventDefault();
	   }
        }
     }  
         
     $scope.templateSave = function () { 
     
       	   if('undefined' !== typeof Massedit.current_template){ 
                  //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
		 //$scope.loadingTracker = promiseTracker();
                 $scope.loadingTracker = $rootScope.loadingTracker;
		 var promise = FrontendService.saveAsMassTemplate(Massedit.current_user.username,  Massedit.current_template, Massedit.selection, Massedit.datastructure);
                 $scope.loadingTracker.addPromise(promise); 
                 promise.then(
	     	      function(response) {
	      		     $scope.alerts = response.data.alerts;
	      	      }
	      	      ,function(response) {
		             if('undefined' !== typeof response.data.alerts){
			  	    $scope.alerts = response.data.alerts;
			            if(typeof $scope.alerts  !== 'undefined'){
				           $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status}); 
				    }
			     }

	      	      }
                 );
	   }else{
                 $scope.templateSaveAs();
	   }
     }
    
     $scope.displayTitle = function () { 
    
         if($scope.titleDisplay == true){
    	        Massedit.titleDisplay = false;
         }else{
    		Massedit.titleDisplay = true;
    	 }
    	 if(Massedit.titleDisplay){
	      Massedit.updateDataStructureDisplay($scope.currentPage, Massedit);
	 }
    }
    $scope.sortPID = function() {
	  
         //  ascending = 1, descending = 0
	 if($scope.sortOrder == 1){
    		    Massedit.datastructure.sort($scope.compareRecordsPID);
		    $scope.sortOrder = 0;
    	 }else{
    		    Massedit.datastructure.sort($scope.compareRecordsPID);
		    Massedit.datastructure.reverse();
		    $scope.sortOrder = 1;
    	 }	 
	 
	 Massedit.updateDataStructureDisplay($scope.currentPage, Massedit);
    };
    
    $scope.sortTitle = function() { 
	  
         //  ascending = 1, descending = 0
	 if($scope.sortOrder == 1){
    		    Massedit.datastructure.sort($scope.compareRecordsTitle);
		    $scope.sortOrder = 0;
    	 }else{
    		    Massedit.datastructure.sort($scope.compareRecordsTitle);
		    Massedit.datastructure.reverse();
		    $scope.sortOrder = 1;
    	 }	 
	 
	 Massedit.updateDataStructureDisplay($scope.currentPage, Massedit);
    };
    
    $scope.compareRecordsPID = function(a,b) {
         
       var numberA = a.PID.slice(2); // remove o:
       var numberB = b.PID.slice(2);
       if (parseInt(numberA, 10) < parseInt(numberB, 10))  return -1;
       if (parseInt(numberA, 10) > parseInt(numberB, 10))  return 1;
       return 0;
    };
    
    $scope.compareRecordsTitle = function(a,b) {
         
       if (a.title < b.title)  return -1;
       if (a.title > b.title)   return 1;
       return 0;
    };
      
});


var MEAddFieldModalCtrl = function ($scope, $rootScope, $modalInstance, FrontendService, ObjectService, promiseTracker, Massedit, current_field) {

       $scope.changesFirst = [];
	
       $scope.massedit = Massedit;

       $scope.current_field = current_field;
       
       $scope.display = {current_field: current_field};
       $scope.massedit = {fieldvalue: ''};
       
       //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
       //$scope.loadingTracker = promiseTracker();
       $scope.loadingTracker = $rootScope.loadingTracker;
       
       $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
   
       $scope.setValue = function () {
	        $scope.form_disabled = true;
               
		Massedit.fieldvalue = $scope.massedit.fieldvalue;		

		Massedit.datastructure = Massedit.dataStructureUpdate($scope.massedit.fieldvalue, current_field, Massedit.datastructure); 
		Massedit.changesFirst = Massedit.datastructure[0].changes;
		
		$modalInstance.close();
		
		return;
		
       };
       
}; 

var MEyesnoDelAllModalCtrl = function ($scope, $modalInstance, FrontendService, Massedit, text ) {

     $scope.text = text;
     
     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
           };
     $scope.OK = function () {
                Massedit.selection = [];
	        Massedit.datastructure = [];
	        Massedit.datastructuredisplay = [];
	        Massedit.changesFirst = [];
	        Massedit.saveSelection(Massedit);
	        $modalInstance.dismiss('OK');
            };
	    
	    
}

var MEyesnoApplyModalCtrl = function ($scope, $rootScope, $modalInstance, promiseTracker, FrontendService, Massedit, text, username, flaged) {

     $scope.text = text;
     
     $scope.loadingTracker = Massedit.loadingTracker;

     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
           };
     $scope.OK = function () {
          Massedit.saveSelection(Massedit);

	  var promise = FrontendService.MEapllychanges(username, flaged);
          //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');// show 'MEapllychanges' tracker even if tracking over Massedit is disabled .....
	  //$scope.loadingTracker = promiseTracker();
	  $scope.loadingTracker = $rootScope.loadingTracker;
	  $scope.loadingTracker.addPromise(promise); 
          promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	                 window.location = $('head base').attr('href')+'massedit/jobs';
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		if(typeof $scope.alerts  !== 'undefined'){
			    $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status}); 
			}
	      		$scope.form_disabled = false;
	      	}
          );

	  $modalInstance.dismiss('OK');  
     };    
}

var METemplateSaveAsModalCtrl = function ($scope, $rootScope, $modalInstance, FrontendService, promiseTracker, Massedit, selection) {
     
     $scope.massedit = Massedit;
     $scope.templates = Massedit.templates;
     $scope.massedit.templatename = '';
     $scope.alerts = '';
     
     $scope.save = function () {
           
           // push template into massedit.templates if not already exist
          var templateExists = false;
          for (var j = 0 ; j <  Massedit.templates.length  ; j++) {
	      if(Massedit.templates[j] === $scope.massedit.templatename){
		  templateExists = true;
	      }
	  }
          if(! templateExists){
	        Massedit.templates.push($scope.massedit.templatename);
	  }

	  //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	   //$scope.loadingTracker = promiseTracker();
           $scope.loadingTracker = $rootScope.loadingTracker;
	   var promise = FrontendService.saveAsMassTemplate(Massedit.current_user.username,  $scope.massedit.templatename, selection, Massedit.datastructure);
           $scope.loadingTracker.addPromise(promise); 
           promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
			Massedit.current_template = $scope.massedit.templatename;
	      	}
	      	,function(response) {
		        if('undefined' !== typeof response.data.alerts){
			  	 $scope.alerts = response.data.alerts;
			         if(typeof $scope.alerts  !== 'undefined'){
				     $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
				 }
			}

	      	}
          );
          $modalInstance.close();
     }
     
     $scope.setTemplateName = function (templateName) {
               
          $scope.massedit.templatename = templateName;
    }
     
     
     $scope.cancel = function () {
           $modalInstance.dismiss('cancel');
     };
  
}

var METemplateLoadModalCtrl = function ($scope, $rootScope, $modalInstance, $modal, FrontendService, promiseTracker, Massedit) {
  
    $scope.massedit = Massedit;
    $scope.templates = Massedit.templates;
    $scope.massedit.templatename = '';
    
    
    $scope.setTemplateName = function (templateName) {
          
          $scope.massedit.templatename = templateName;
    }
    
    $scope.load = function () {

	   if($scope.massedit.templatename == ""){   
	             var modalInstance = $modal.open({
                        templateUrl: $('head base').attr('href')+'views/modals/massedit/alertMsgMassedit.html',
                        controller: MEAlertsModalCtrl,
                        resolve: {
                            text: function(){
		                      return 'Please select one template';
		                           }
	                        }
                     });  
	   }else{
		//$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
                 //$scope.loadingTracker = promiseTracker();
                 $scope.loadingTracker = $rootScope.loadingTracker;
		 var promise = FrontendService.loadMassTemplate($scope.massedit.templatename);
                 $scope.loadingTracker.addPromise(promise);
                 promise.then(
                        function(response) { 
			    var loaded_template = response.data.loaded_template; 
                             Massedit.datastructure = loaded_template.tmpl_datastructure;
                             Massedit.selection = loaded_template.tmpl_selection;
			      Massedit.saveSelection(Massedit); 
                             Massedit.updateDataStructureDisplay(1, Massedit);
                             Massedit.changesFirst = Massedit.datastructure[0].changes;
                             Massedit.current_template =  loaded_template.tmpl_name;    
			    $scope.alerts = response.data.alerts;
                             $scope.form_disabled = false;
                        }
                       ,function(response) {
                             $scope.alerts = response.data.alerts;
                             if(typeof $scope.alerts  !== 'undefined'){
                                  $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                             }
                             $scope.form_disabled = false;
	      	      }
	        );
		$modalInstance.close(); 
           } 
    }
     
    $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
    };
}

var MEAddRecordModalCtrl = function ($scope, $modal, $modalInstance, FrontendService, Massedit ) {
  
      
      $scope.massedit = Massedit;
      $scope.massedit.newPID = '';
      $scope.massedit.newrecord = [];
      
      $scope.addValue = function () {
	   if( ('undefined' !== typeof $scope.massedit.newPID) && ($scope.massedit.newPID !== "") ){
	       var newRecord = {};
	       newRecord.PID = $scope.massedit.newPID;
	       if('undefined' !== typeof $scope.massedit.datastructure[0] ){
		    if('undefined' !== typeof $scope.massedit.datastructure[0].changes){
		            var changes = [];
	                    for (var j = 0 ; j < $scope.massedit.datastructure[0].changes.length  ; j++) {
		                  var change = {};
		                  change.field = $scope.massedit.datastructure[0].changes[j].field;
		                  change.value = $scope.massedit.newrecord[$scope.massedit.datastructure[0].changes[j].field];
		                  changes.push(change);
	                    }
	                    newRecord.changes = changes;
		    }
	       }
	       Massedit.datastructure.unshift(newRecord);
               
	       // alerts from massEditService
	       Massedit.alerts = [];
	       
	       Massedit.updateDataStructureDisplay(1, Massedit, $scope.massedit.newPID);
	       
	       $scope.alerts = Massedit.alerts;
	       
	       Massedit.selection.push($scope.massedit.newPID);
	       Massedit.saveSelection(Massedit);
	       // paginator set to first after adding new record
	       
	       $( "ul.pagination li" ).removeClass( "active" );
	       $( "ul.pagination li:nth-child(1)" ).addClass( "disabled" );
	       $( "ul.pagination li:nth-child(2)" ).addClass( "disabled" );
	       $( "ul.pagination li:nth-child(3)" ).addClass( "active" );
	       
	       $( "ul.pagination li:nth-last-child(1)" ).removeClass( "disabled" );
	       $( "ul.pagination li:nth-last-child(2)" ).removeClass( "disabled" );
	       $scope.sortOrder = 1; // after adding new record first sort will be always ascending
	       $modalInstance.close();
	  }else{
	       var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/modals/massedit/alertMsgMassedit.html',
                  controller: MEAlertsModalCtrl,
                  resolve: {
                            text: function(){
		                      return 'PID can\'t be empty';
		                   }
	                   }
                  }); 
	  }
     };
     
     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
     };
    
  
  
}
 
var METemplateDeleteModalCtrl = function ($scope, $rootScope, $modalInstance, FrontendService, promiseTracker, Massedit) {
     
     $scope.massedit = Massedit;
     $scope.templates = Massedit.templates;
     $scope.massedit.forDeletion = [];
     
     $scope.forDeletion = function (template) {
           
           // check button
           var templateExists = false;
	   var index = '';
           for (var j = 0 ; j <  $scope.massedit.forDeletion.length  ; j++) {
	      if($scope.massedit.forDeletion[j] === template){
		  templateExists = true;
		  index = j;
	      }
	  }
          if(templateExists){
	        $scope.massedit.forDeletion.splice(index, 1);
	  }else{
	        $scope.massedit.forDeletion.push(template);
	  }
     }
     
     $scope.delete = function () {
          
           // delete template from Massedit.templates 
           for(var i = Massedit.templates.length - 1; i >= 0; i--){
	        for (var j = 0 ; j <  $scope.massedit.forDeletion.length  ; j++) {
	              if(Massedit.templates[i] ===  $scope.massedit.forDeletion[j]){
		             Massedit.templates.splice(i, 1);
	              }
	        }
	  }
           
           //$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	   //$scope.loadingTracker = promiseTracker();
           $scope.loadingTracker = $rootScope.loadingTracker;
	   var promise = FrontendService.deleteMassTemplate(Massedit.current_user.username, $scope.massedit.forDeletion);
           $scope.loadingTracker.addPromise(promise); 
           promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	      	}
	      	,function(response) {
		        if('undefined' !== typeof response.data.alerts){
			  	 $scope.alerts = response.data.alerts;
			         if(typeof $scope.alerts  !== 'undefined'){
				       $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status}); 
				 }
			}

	      	}
          );
          $modalInstance.close();
       
     }
     
     
     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
     };
}

var MEEditRecordModalCtrl = function ($scope, $modalInstance, Massedit, PID) {
    
     $scope.massedit = Massedit;
     $scope.PID = PID;

     // initialize $scope.massedit.editedcurrently
     $scope.massedit.editedcurrently = {};
     for (var i = 0 ; i < $scope.massedit.datastructure.length  ; i++) {
             if($scope.massedit.datastructure[i].PID === $scope.PID){
	           for (var j = 0 ; j < $scope.massedit.datastructure[i].changes.length  ; j++) {
		        $scope.massedit.editedcurrently[ $scope.massedit.datastructure[i].changes[j].field ] = $scope.massedit.datastructure[i].changes[j].value ;
		  }
	    }
     } 
     
     
     $scope.setValue = function () {
       
	   for (var i = 0 ; i < $scope.massedit.datastructure.length  ; i++) {
	        if($scope.massedit.datastructure[i].PID === $scope.PID){
		   for (var j = 0 ; j < $scope.massedit.datastructure[i].changes.length  ; j++) {  
		        if('undefined' !== typeof $scope.massedit.editedcurrently[$scope.massedit.datastructure[i].changes[j].field]){
			     Massedit.datastructure[i].changes[j].value = $scope.massedit.editedcurrently[$scope.massedit.datastructure[i].changes[j].field];
			}
		   }  
		}  
	  }
	   $modalInstance.close();
     };
     
     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
     };
  
}

var MEAlertsModalCtrl = function ($scope, $modalInstance, FrontendService, text ) {
   
     $scope.text = text;
     
     $scope.OK = function () {
		$modalInstance.dismiss('OK');
	};
     
}

var MEAlertsLoadCsvModalCtrl = function ($scope, $modalInstance, FrontendService, text ) {
   
     $scope.text = text;
     
     $scope.OK = function () {
		$modalInstance.dismiss('OK');
		//window.location = window.location;
	};
     
}
