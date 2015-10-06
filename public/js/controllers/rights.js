app.controller('RightsCtrl', function($scope, $rootScope, $modal, $location, $timeout, MetadataService, FrontendService, DirectoryService, promiseTracker) {
  
      $scope.departmentNamespace = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_department/';   
      $scope.facultyNamespace    = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_faculty/';
  
      $scope.rights_date_end = '';
      $scope.RUser = {}; 
      $scope.rightsQuery = '';      
      
      $scope.queryUsers = [];

      $scope.alerts = [];
      $scope.fields = [];
      $scope.languages = [];
      $scope.initdata = '';
      $scope.tree = {};
      
      $scope.faculties_array = [];
      $scope.rights_username_array = [];

      $scope.validation_date = {};

      
    $scope.initRights = function (initdata) {
	     
             $scope.resetEditor();
             var promise = MetadataService.getUwmetadataTree();
             $scope.loadingTracker.addPromise(promise);
             promise.then(
    		   function(response) {
    			$scope.alerts = response.data.alerts;
    			$scope.languages = response.data.languages;
			$scope.tree = response.data.tree;
                        console.log('initRights tree:',$scope.tree);
			$scope.fields = response.data.tree;
    			$scope.getFaculties($scope.fields); // creates faculties_array
			$scope.getRightsObject(); // needs faculties_array
			$scope.load_init(); // needs faculties_array
    		  }
    		 ,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	 }
    	     );
      
             $scope.initdata = angular.fromJson(initdata);
    	     console.log('geo init12321:',$scope.initdata);
	     $scope.current_user = $scope.initdata.current_user;
    	     $scope.pid = $scope.initdata.pid;
	  
    };
    
    $scope.resetEditor = function() {
    	  $scope.alerts = [];
	  $scope.languages = [];
	  $scope.fields = [];
    };
  
    $scope.getFaculties = function(fields){
         var faculties = {};
         for (i = 0; i < fields.length; ++i) {
	     if(fields[i].xmlname == 'organization'){
	         for (j = 0; j < fields[i].children.length; ++j) {
		         if(fields[i].children[j].xmlname == 'orgassignment'){
			         for (k = 0; k < fields[i].children[j].children.length; ++k) {
				       if(fields[i].children[j].children[k].xmlname == 'faculty'){
					           faculties = fields[i].children[j].children[k];
			               }
				 }
			 }
		 }
	     }
         }
         $scope.faculties = faculties;
    }
         
    $scope.load_init = function(){
    	var i = 0;
        for(i = 0; i < $scope.faculties_array.length; ++i) {
	        $scope.$watch('faculties_array['+i+'].faculty', $scope.faculty_update_handler, true);
	}
    };

    
    $scope.faculty_update_handler = function(faculty_node){
	
    	if(!faculty_node){
	    return;
    	}

	// we don't want to update select-boxes when they are only being rendered
	if($scope.form){
		if($scope.form.$pristine){	
			return;
		}
	}
                     
        //orgassignment  faculty_node
        var faculty_parent = $scope.get_namespace_parent(null, $scope.tree, 'faculty');   
        var faculty_namespace;
	var department_namespace;
	for (i = 0; i < faculty_parent.children.length; ++i) {  
	     if(faculty_parent.children[i].xmlname == 'faculty'){
	          faculty_namespace = faculty_parent.children[i].vocabularies[0].namespace;
	     }
	     if(faculty_parent.children[i].xmlname == 'department'){
	          department_namespace = faculty_parent.children[i].vocabularies[0].namespace;
	     }
	}  
	
	var faculty_id = faculty_node.substring(faculty_namespace.length);
	var promise = DirectoryService.getOrgUnits(faculty_id, department_namespace);
    	$scope.loadingTracker.addPromise(promise);
    	promise.then(
    		     function(response) {
			       $scope.alerts = response.data.alerts;
    			       var termsWithLabels = [];
			       for (i = 0; i < response.data.terms.length; ++i) {
				    var temp = {};
				    temp.uri = {};
				    temp.labels = {};
				    temp.uri = response.data.terms[i].uri;
				    temp.labels = response.data.terms[i];
				    termsWithLabels.push(temp);
			       }
			       for (i = 0; i < $scope.faculties_array.length; ++i) {
				   if($scope.faculties_array[i].faculty == faculty_node){
				        $scope.faculties_array[i].departments = [];
				        angular.copy(termsWithLabels, $scope.faculties_array[i].departments);
					
				   }
			       }
    		      }
    		     ,function(response) {
           		       $scope.alerts = response.data.alerts;
           		       $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	      }
    	           );
     };
    


    $scope.get_namespace_parent = function (parent, children, namespace) {
    	
        var i = 0;
        for (i = 0; i < children.length; ++i) {
                if(children[i].xmlname === namespace){
    			return parent;
    		}
    		if(children[i].children){
    			var ret_parent = $scope.get_namespace_parent(children[i], children[i].children, namespace);
                        if(ret_parent){
    				return ret_parent;
    			}
    		}
    	}
    }

   $scope.getRightsObject = function() {
        var promise = MetadataService.getRightsObject($scope.pid);
    	$scope.loadingTracker.addPromise(promise);
    	promise.then(
        	function(response) {
        		$scope.alerts = response.data.alerts;
			$scope.convertRightsData(response.data);
        		$scope.form_disabled = false;
			for (i = 0; i < $scope.faculties_array.length; ++i) {
	                       $scope.$watch('faculties_array['+i+'].faculty', $scope.faculty_update_handler, true);
	                }
        	}
               ,function(response) {
		        $scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           		$scope.form_disabled = false;
           	}
        );
      
    }
    
    $scope.convertRightsData = function(rightsData) {
         if(typeof rightsData.metadata.rights.username != 'undefined'){
              for (i = 0; i < rightsData.metadata.rights.username.length; ++i) {
	           var username = {};
	           if(typeof rightsData.metadata.rights.username[i].expires != 'undefined'){
	                username.dt_end = rightsData.metadata.rights.username[i].expires;
		        username.id     = rightsData.metadata.rights.username[i].value;
	           }else{
	                username.id = rightsData.metadata.rights.username[i];
	           }
	           $scope.rights_username_array.push(username);
	      }
	}      
        if(typeof rightsData.metadata.rights.faculty != 'undefined'){     
             for (i = 0; i < rightsData.metadata.rights.faculty.length; ++i) {
	          var institution = {};
	          if(typeof rightsData.metadata.rights.faculty[i].expires != 'undefined'){
	               institution.dt_end  = rightsData.metadata.rights.faculty[i].expires;
	               var facultyUri = $scope.facultyNamespace+rightsData.metadata.rights.faculty[i].value;
		       institution.faculty = facultyUri;
	          }else{
	               var facultyUri = $scope.facultyNamespace+rightsData.metadata.rights.faculty[i];
		       institution.faculty = facultyUri;
	          }
	          $scope.faculties_array.push(institution);
	     }
	}     
	if(typeof rightsData.metadata.rights.department != 'undefined'){
	      for (i = 0; i < rightsData.metadata.rights.department.length; ++i) {
	          var institution = {};
	          if(typeof rightsData.metadata.rights.department[i].expires != 'undefined'){
	               institution.dt_end = rightsData.metadata.rights.department[i].expires;
	               var departmentUri = $scope.departmentNamespace+rightsData.metadata.rights.department[i].value;
		       institution.selectedDepartment = departmentUri;
		       $scope.getFacultyFromDepartment(institution);
	          }else{
		       var departmentUri = $scope.departmentNamespace+rightsData.metadata.rights.department[i];
		       institution.selectedDepartment = departmentUri;
		       $scope.getFacultyFromDepartment(institution);
	          }
	          $scope.faculties_array.push(institution);
	     }
	}
    }
    
    
    $scope.getFacultyFromDepartment = function(institution) {
         
         var departmentArray = institution.selectedDepartment.split('/');
	 var departmentId = departmentArray.pop();
	 var promise = FrontendService.getFacultyIdFromDepatment(departmentId);
    	 $scope.loadingTracker.addPromise(promise);
    	 promise.then(
        	function(response) {
        		$scope.alerts = response.data.alerts;
        		$scope.form_disabled = false;
			institution.faculty = $scope.facultyNamespace+response.data.parent_id;
        	}
               ,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           		$scope.form_disabled = false;
           	}
        );
    }
    
    
    $scope.saveRights = function() {
        
	var rights = {};
	rights.metadata = {};
	rights.metadata.rights = {};
	rights.metadata.rights.username = [];
	rights.metadata.rights.faculty = [];
	rights.metadata.rights.department = [];
	//usernames
	for (i = 0; i < $scope.rights_username_array.length; ++i) {
	    if(typeof $scope.rights_username_array[i].dt_end === 'undefined'){
	          rights.metadata.rights.username.push($scope.rights_username_array[i].id);
	    }else if($scope.rights_username_array[i].dt_end == ''){
	          rights.metadata.rights.username.push($scope.rights_username_array[i].id);
	    }else{
	         var user = {};
	         user.value   = $scope.rights_username_array[i].id;
	         user.expires = $scope.rights_username_array[i].dt_end;
	         rights.metadata.rights.username.push(user);
	    }
	}
	//faculties & departments
	for (i = 0; i < $scope.faculties_array.length; ++i) {
	    if(typeof $scope.faculties_array[i].dt_end === 'undefined'){
	          if(typeof $scope.faculties_array[i].selectedDepartment === 'undefined'){
			     var idArray = $scope.faculties_array[i].faculty.split('/');
		             rights.metadata.rights.faculty.push(idArray.pop());
		  }else if($scope.faculties_array[i].selectedDepartment == ''){
			     var idArray = $scope.faculties_array[i].faculty.split('/');
		             rights.metadata.rights.faculty.push(idArray.pop());  
		  }else if($scope.faculties_array[i].selectedDepartment == null){
		    	     if($scope.faculties_array[i].faculty != null && $scope.faculties_array[i].faculty != ''){
			            var idArray = $scope.faculties_array[i].faculty.split('/');
		                    rights.metadata.rights.faculty.push(idArray.pop());
			     }
		  }else{
			     var idArray = $scope.faculties_array[i].selectedDepartment.split('/');
		             rights.metadata.rights.department.push(idArray.pop());
		  }
	    }else{
	         if(typeof $scope.faculties_array[i].selectedDepartment === 'undefined'){
		    	var faculty = {};
			var idArray =  $scope.faculties_array[i].faculty.split('/');
			faculty.value   = idArray.pop();
			if(typeof $scope.faculties_array[i].dt_end !== 'undefined'){
			      if($scope.rights_username_array[i].dt_end != ''){
			             faculty.expires = $scope.faculties_array[i].dt_end;
			      }
			}
			rights.metadata.rights.faculty.push(faculty);
		  
		 }else if($scope.faculties_array[i].selectedDepartment == null){  
		        if($scope.faculties_array[i].faculty != null){
		              var faculty = {};
			      var idArray =  $scope.faculties_array[i].faculty.split('/');
			      faculty.value   = idArray.pop();
			      if(typeof $scope.faculties_array[i].dt_end !== 'undefined'){
			             if($scope.rights_username_array[i].dt_end != ''){
			                    faculty.expires = $scope.faculties_array[i].dt_end;
			             }
			      }
			      rights.metadata.rights.faculty.push(faculty);
			}
		   
		 }else{
		        var department = {};
			var idArray =  $scope.faculties_array[i].selectedDepartment.split('/');
			department.value = idArray.pop();
			if(typeof $scope.faculties_array[i].dt_end !== 'undefined'){
			     if($scope.rights_username_array[i].dt_end != ''){ 
			              department.expires = $scope.faculties_array[i].dt_end;
			     }
			}
			rights.metadata.rights.department.push(department);
		  }
	    }
	}
        var promise = MetadataService.saveRightsObject($scope.$parent.pid, rights);
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
    
    $scope.addNewUser = function(RUser, date) {
      	  
	      var newUser = {};
	      RUser =  angular.fromJson(RUser);
	      newUser.id = RUser.uid;
	      newUser.value = RUser.value;
	      newUser.dt_end = date;
	      $scope.rights_username_array.push(newUser);
	      
	      //clear inputs after adding user
	      $scope.rightsQuery = '';
	      $scope.RUser = '';
	      $scope.rights_date_end = '';
    }
    
    
    $scope.deleteUser = function(index) {
            
             $scope.rights_username_array.splice(index, 1);	    
    }
    
    $scope.addNewFaculty = function() {
      	   
	     var initialValueFaculty = {};
	     initialValueFaculty.faculty = '';
	     $scope.faculties_array.push(initialValueFaculty);

	     var i = 0;
    	     for (i = 0; i < $scope.faculties_array.length; ++i) {
	          $scope.$watch('faculties_array['+i+'].faculty', $scope.faculty_update_handler, true);
	     }	     
    
    }
    $scope.deleteFaculty = function(index) {

	     $scope.faculties_array.splice(index, 1);
    }
    
    $scope.addNewTime = function() {
      	 
         var initialValueFaculty = {};
	 initialValueFaculty.faculty = '';
	 $scope.faculties_array.push(initialValueFaculty);
      
    }
    
    

  $scope.today = function() {
      //$scope.validation_date.dt_start = new Date();
      $scope.validation_date.dt_end = new Date();
  };
  $scope.today();

  $scope.clear = function () {
      //$scope.validation_date.dt_start = null;
      $scope.validation_date.dt_end = null;
  };

  $scope.open_start = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
  $scope.open_end = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
  //////////////////////////////////////
  // Disable weekend selection
  //$scope.disabled = function(date, mode) {
  //   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  //};

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();


  
  
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
       if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);
            for (var i=0;i<$scope.events.length;i++){
                 var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
                 if (dayToCheck === currentDay) {
                      return $scope.events[i].status;
                }
            }
      }
      return '';
  };
   
  $scope.getUsers = function(query) {
        var promise = FrontendService.rightsGetUsers(query);
        $scope.loadingTracker.addPromise(promise);
        promise.then(
    		function(response) {
			$scope.queryUsers = response.data.accounts;
			if($scope.queryUsers.length >= 49){
			    var last = {};
			    last.value = 'There are more results. Please make your query longer!';
			    $scope.queryUsers.push(last);
			}
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	);
  }
  
  
});