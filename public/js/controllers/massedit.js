app.controller('MasseditCtrl',  function($scope, $modal, $location, DirectoryService, SearchService, FrontendService, promiseTracker, Massedit) {

    $scope.flaged = 1;
    
    $scope.currentPage = 1; // starting page
    
    $scope.maxSize = 10; // pages in paginator
    
    $scope.limit = 10; // records per page
    //$scope.from = 1;
    
    $scope.sort = 'uw.general.title,SCORE';
    //$scope.reverse = 0;
    
    $scope.uwmFields = [];
    
    $scope.alerts = [];
    
    // get uwm tree for field list
    //var tree;
    var promise = FrontendService.getUwmdatatree();
    $scope.loadingTracker.addPromise(promise); 
    promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
			$scope.uwm = response.data;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
    );
    // we will use this to track running ajax requests to show spinner
    $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
	
    $scope.alerts = [];
	
    $scope.selection = [];

    $scope.objects = [];
	
    $scope.initdata = '';
    
    $scope.current_user = '';
	
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
    	$scope.saveSelection();
    };
    
    $scope.selectVisible = function(){
	for( var i = 0 ; i < Massedit.datastructuredisplay.length ; i++ ){
	      if(Massedit.selection.indexOf(Massedit.datastructuredisplay[i].PID) == -1){
		    Massedit.selection.push(Massedit.datastructuredisplay[i].PID);
	      }
	}
	$scope.saveSelection();
    };

    $scope.selectAll = function(){
         Massedit.selection = [];
	 for (var i = 0 ; i < Massedit.datastructure.length  ; i++) {
		Massedit.selection.push(Massedit.datastructure[i].PID);
	 }
	 $scope.saveSelection();
    }
    
    $scope.saveSelection = function() {
	var promise = FrontendService.updateSelection(Massedit.selection);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
	    );
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
                        $scope.updateDataStructureDisplay(page);
	      		 $scope.form_disabled = false;
			
	      	},
	      	function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
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
    	      $scope.saveSelection();
	}

    };
    
    
    $scope.setPage = function (page) {
    	    
            $scope.updateDataStructureDisplay(page);	
    	    $scope.currentPage = page;
    };

    // related to Massedit.updateDataStructureDisplay in massEditService
    $scope.updateDataStructureDisplay = function (page) {

	    Massedit.datastructuredisplay = [];
	    var start  = (page-1)* $scope.limit ;
	    var max = (page-1)* $scope.limit +  $scope.limit - 1;  // = $scope.limit*page -1 
	    for (var i = start; i <= max  ; i++) {
	         if('undefined' !== typeof Massedit.datastructure[i] ){ 
		       Massedit.datastructuredisplay.push(Massedit.datastructure[i]);
		 }
	    }
    };
    
    $scope.init = function (initdata) {
       try { 
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
	                $scope.saveSelection();
		        $scope.updateDataStructureDisplay(1);
		        // for remove-column row
		        Massedit.changesFirst = Massedit.datastructure[0].changes;
		  }else if( (typeof $scope.initdata.tmpl_datastructure  !== 'undefined') && (typeof $scope.initdata.tmpl_selection  !== 'undefined') ){
		        //massedit template loading
		        Massedit.datastructure = $scope.initdata.tmpl_datastructure;
		        Massedit.selection = $scope.initdata.tmpl_selection;
		        $scope.saveSelection();
		        $scope.updateDataStructureDisplay(1);
		        Massedit.changesFirst = Massedit.datastructure[0].changes;
		        Massedit.current_template =  $scope.initdata.tmpl_name;
		  }else{
		        //initial empty template with selected objects
		        $scope.loadSelection(1);
		  }
    	      } 
    	  }
          catch(err) {
	     console.log("Loading from csv error: ", err);
	     var modalInstance = $modal.open({
                 templateUrl: $('head base').attr('href')+'views/partials/massedit/alertMsgMassedit.html',
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
		     $scope.updateDataStructureDisplay($scope.currentPage);
		}  
	   }
	   var idx = Massedit.selection.indexOf(pid);
	   if(idx !== -1){
	          Massedit.selection.splice(idx,1);
	   }
	  
	   $scope.saveSelection();
     };
     

    

 
 
  // do I need this in massedit???
  $scope.createCollection = function () {

	  var modalInstance = $modal.open({
            templateUrl: $('head base').attr('href')+'views/partials/create_collection.html',
            controller: CollModalCtrl,
            resolve: {
		      current_user: function(){
		        return $scope.current_user;
		      },
		      selection: function(){
			    return Massedit.selection;
			  }
		    }
	  });
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
	 return datastructureFlaged;
    };
  
   $scope.apllychanges = function () {
     
          var modalInstance = $modal.open({
                templateUrl: $('head base').attr('href')+'views/partials/massedit/yesnoMassedit.html',
                controller: MEyesnoApplyModalCtrl,
                resolve: {
                          text: function(){
		                      return 'Selected changes will be applied. Do you like to continue?';
		                         },
                          username: function(){
		                      return  $scope.current_user.username;
		                         },
                          flaged: function(){
		                      return  $scope.getDatastructureFlaged();
		                         }
	                 }
          }); 
     
     
     
     
     
     
     
     /*
     
         $scope.saveSelection();
         var promise = FrontendService.MEapllychanges($scope.current_user.username, $scope.getDatastructureFlaged());
         $scope.loadingTracker.addPromise(promise); 
         promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	                window.location = $('head base').attr('href');
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
         );

     */
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
		          $scope.uwmFields.push(field);
		     //}
		 }
                $scope.getAllUwmFields(child.children);
           }
	}
  };
  
  $scope.recordsPerPage = function (recordsPerPage) { 
      
       $scope.limit = recordsPerPage;
       $scope.updateDataStructureDisplay(1);
  }
  
  
    $scope.addField = function (field) {
       
	     $scope.currentField = field;
             Massedit.currentField =  $scope.currentField;
             var modalInstance = $modal.open({
             templateUrl: $('head base').attr('href')+'views/partials/massedit/addfield.html',
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
                  templateUrl: $('head base').attr('href')+'views/partials/massedit/yesnoMassedit.html',
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
                   templateUrl: $('head base').attr('href')+'views/partials/massedit/templateSaveAs.html',
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
                     templateUrl: $('head base').attr('href')+'views/partials/massedit/templateLoad.html',
                     controller: METemplateLoadModalCtrl,
            }); 
	   

     };
     
     $scope.addRecord = function (record) {

            var modalInstance = $modal.open({
                   templateUrl: $('head base').attr('href')+'views/partials/massedit/addrecord.html',
                   controller: MEAddRecordModalCtrl,
	           resolve: {
                         recordsPerPage: function(){
		                             return $scope.limit;
		                         }
	                 }
            }); 
     };
     $scope.templateDelete = function () {  
                       
            
	    var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/partials/massedit/templateDelete.html',
                     controller: METemplateDeleteModalCtrl,
            }); 
	   

     };
     
     $scope.editRecord = function (PID) {
       
             if('undefined' !== typeof Massedit.datastructure[0].changes){
		  if(Massedit.datastructure[0].changes.length > 0){
                        var modalInstance = $modal.open({
                               templateUrl: $('head base').attr('href')+'views/partials/massedit/editrecord.html',
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
                 templateUrl: $('head base').attr('href')+'views/partials/massedit/alertMsgMassedit.html',
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
                  templateUrl: $('head base').attr('href')+'views/partials/massedit/alertMsgMassedit.html',
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
                 $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
                 var promise = FrontendService.saveAsMassTemplate(Massedit.current_user.username,  Massedit.current_template, Massedit.selection, Massedit.datastructure);
                 $scope.loadingTracker.addPromise(promise); 
                 promise.then(
	     	      function(response) {
	      		     $scope.alerts = response.data.alerts;
	      	      }
	      	      ,function(response) {
		             if('undefined' !== typeof response.data.alerts){
			  	    $scope.alerts = response.data.alerts;
			            $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
			     }

	      	      }
                 );
	   }else{
                 $scope.templateSaveAs();
	   }
     }
     
});


var MEAddFieldModalCtrl = function ($scope, $modalInstance, $location, FrontendService, ObjectService, promiseTracker, Massedit, current_field) {

       $scope.changesFirst = [];
	
       $scope.massedit = Massedit;

       $scope.current_field = current_field;
       
       $scope.display = {current_field: current_field};
       $scope.massedit = {fieldvalue: ''};
       
       $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
       
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

var MEyesnoDelAllModalCtrl = function ($scope, $modalInstance, $location, promiseTracker, FrontendService, Massedit, text ) {

     $scope.text = text;
     
     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
           };
     $scope.OK = function () {
                Massedit.selection = [];
	        Massedit.datastructure = [];
	        Massedit.datastructuredisplay = [];
	        Massedit.changesFirst = [];
	        $scope.saveSelection();
		$modalInstance.dismiss('OK');
            };
     $scope.saveSelection = function() {
           
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
            var promise = FrontendService.updateSelection(Massedit.selection);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
	    );
    }    
}

var MEyesnoApplyModalCtrl = function ($scope, $modalInstance, $location, promiseTracker, FrontendService, Massedit, text, username, flaged ) {

     $scope.text = text;
     
     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
           };
     $scope.OK = function () {
          $scope.saveSelection();
          var promise = FrontendService.MEapllychanges(username, flaged);
          $scope.loadingTracker.addPromise(promise); 
          promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	                window.location = $('head base').attr('href');
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
          );
	  $modalInstance.dismiss('OK');  
     };
     $scope.saveSelection = function() {
            
            $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
            var promise = FrontendService.updateSelection(Massedit.selection);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
	    );
    }    
}

var METemplateSaveAsModalCtrl = function ($scope, $modalInstance, $location, FrontendService, promiseTracker, Massedit, selection) {
     
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

	  $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
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
			         $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
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

var METemplateLoadModalCtrl = function ($scope, $modalInstance, $location, FrontendService, promiseTracker, Massedit) {
  
    $scope.massedit = Massedit;
    $scope.templates = Massedit.templates;
    $scope.massedit.templatename = '';
    
    // depricated delete it!
    $scope.load2 = function () {
           $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
           var promise = FrontendService.loadMassTemplate(Massedit.current_user.username,  $scope.massedit.templatename);
           $scope.loadingTracker.addPromise(promise); 
           promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
			Massedit.current_template = $scope.massedit.templatename;
	      	}
	      	,function(response) {
		        if('undefined' !== typeof response.data.alerts){
			  	 $scope.alerts = response.data.alerts;
			         $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
			}

	      	}
          );
	  $modalInstance.close();
    };
    
    $scope.setTemplateName = function (templateName) {
          
          $scope.massedit.templatename = templateName;
    }
    
    
    $scope.load = {
      onSubmit : function(form) {
	if($scope.massedit.templatename === "" ){
	      var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/partials/massedit/alertMsgMassedit.html',
                  controller: MEAlertsModalCtrl,
                  resolve: {
                            text: function(){
		                      return 'Please select one template';
		                   }
	                   }
                  }); 
	      form.preventDefault();
	}
      }
    }
    
    
    $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
    };
}

var MEAddRecordModalCtrl = function ($scope, $modal, $modalInstance, promiseTracker, FrontendService, $location, Massedit, recordsPerPage ) {
  
      
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

	       Massedit.datastructuredisplay = Massedit.updateDataStructureDisplay(1, Massedit.datastructure,recordsPerPage);
	       Massedit.selection.push($scope.massedit.newPID);
	       $scope.saveSelection();
	       $modalInstance.close();
	  }else{
	       var modalInstance = $modal.open({
                  templateUrl: $('head base').attr('href')+'views/partials/massedit/alertMsgMassedit.html',
                  controller: MEAlertsModalCtrl,
                  resolve: {
                            text: function(){
		                      return 'PID can\'t be empty';
		                   }
	                   }
                  }); 
	  }
     };
     
     $scope.saveSelection = function() {
    	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
        var promise = FrontendService.updateSelection(Massedit.selection);
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
	    );
    }
     
     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
     };
  
  
}

var METemplateDeleteModalCtrl = function ($scope, $modalInstance, $location, FrontendService, promiseTracker, Massedit) {
     
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
           
           $scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
           var promise = FrontendService.deleteMassTemplate(Massedit.current_user.username, $scope.massedit.forDeletion);
           $scope.loadingTracker.addPromise(promise); 
           promise.then(
	     	function(response) { 
	      		$scope.alerts = response.data.alerts;
	      	}
	      	,function(response) {
		        if('undefined' !== typeof response.data.alerts){
			  	 $scope.alerts = response.data.alerts;
			         $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
			}

	      	}
          );
          $modalInstance.close();
       
     }
     
     
     $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
     };
}

var MEEditRecordModalCtrl = function ($scope, $modalInstance, $location, Massedit, PID) {
    
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

var MEAlertsModalCtrl = function ($scope, $modalInstance, $location, FrontendService, text ) {
   
     $scope.text = text;
     
     $scope.OK = function () {
		$modalInstance.dismiss('OK');
	};
     
}

var MEAlertsLoadCsvModalCtrl = function ($scope, $modalInstance, $location, FrontendService, text ) {
   
     $scope.text = text;
     
     $scope.OK = function () {
		$modalInstance.dismiss('OK');
		window.location = window.location;
	};
     
}

