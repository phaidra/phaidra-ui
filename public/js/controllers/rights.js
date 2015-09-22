app.controller('RightsCtrl', function($scope, $rootScope, $modal, $location, $timeout, MetadataService, FrontendService, DirectoryService, promiseTracker) {
  
      $scope.departmentNamespace = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_department/';   
      $scope.facultyNamespace    = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_faculty/';
  
      $scope.rights_date_end = '';
      $scope.RUser = {}; 
      $scope.rightsQuery = '';      
      $scope.queryUsers = [];
      $scope.rightsUID = '';
      
     
      
      $scope.userQuery = [];
      $scope.userQuery[0] = '';
      $scope.alerts = [];
      $scope.fields = [];
      $scope.languages = [];
      $scope.initdata = '';
      $scope.tree = {};
      
      //$scope.faculties = {};
      //$scope.departments = {};
      $scope.faculties_array = [];
      //$scope.rights_username = {};
      $scope.rights_username_array = [];
      //$scope.validation_date_array = [];
      $scope.validation_date = {};

      
      $scope.initRights = function (initdata) {
	     console.log('initRights ');
	     
	     var initialValueUser1 = {};
	     var initialValueUser2 = {};
	     initialValueUser1.id = '';
	     initialValueUser2.id = '';
	     ////$scope.rights_username_array.push(initialValueUser1);
	     ////$scope.rights_username_array.push(initialValueUser2);
	     var initialValueFaculties = {};
	     //initialValueFaculties.faculty = '-- please choose --';
	     //var selectedDepartment = '';
	     //initialValueFaculties.selectedDepartment = selectedDepartment;
	     
	     ////$scope.faculties_array.push(initialValueFaculties);
	     
	     
	     $scope.getUwmetadataTree();
	     
	     if(typeof $scope.mode == 'undefined'){
	          $scope.mode = 'object';
	     }
	     console.log('rights init mode:',$scope.mode);
             if($scope.mode == 'template'){
	          ////$scope.getGeoTemplate();
	          //$scope.tid = $scope.$parent.tid;
	          //$scope.placemarks = $scope.$parent.placemarks;
	     }
	     if($scope.mode == 'object'){
	         //console.log('init object getgeo'); 
	          //$scope.getRightsObject();
	     }
	     
             //console.log('geo init placemarks0:',$scope.$parent);
             //console.log('geo init placemarks1:',$scope.$parent.placemarks);
             console.log('rights init edit_mode:',$scope.edit_mode);
	     console.log('rights init edit:',$scope.edit);
	     
             $scope.initdata = angular.fromJson(initdata);
    	     //console.log('geo init12321:',$scope.initdata);
	     $scope.current_user = $scope.initdata.current_user;
    	     $scope.pid = $scope.initdata.pid;
	  
    };
      $scope.resetEditor = function() {
    	  $scope.alerts = [];
	  $scope.languages = [];
	  $scope.fields = [];
      };
  
      $scope.getUwmetadataTree = function(){
    	$scope.resetEditor();
        var promise = MetadataService.getUwmetadataTree();
        $scope.loadingTracker.addPromise(promise);
        promise.then(
    		function(response) {
    			$scope.alerts = response.data.alerts;
    			$scope.languages = response.data.languages;
    			$scope.fields = response.data.tree;
			$scope.tree = response.data.tree;
    			$scope.getFaculties($scope.fields);
			$scope.getRightsObject();
			//$scope.load_init();
			$scope.load_init();
			console.log('getUwmetadataTree fields', $scope.fields);
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	);
    };
    $scope.getFaculties = function(fields){

      var faculties = {};
      for (i = 0; i < fields.length; ++i) {
	   if(fields[i].xmlname == 'organization'){
	         for (j = 0; j < fields[i].children.length; ++j) {
		         if(fields[i].children[j].xmlname == 'orgassignment'){
			         for (k = 0; k < fields[i].children[j].children.length; ++k) {
				       if(fields[i].children[j].children[k].xmlname == 'faculty'){
			                     ////for (m = 0; m < fields[i].children[j].children[k].vocabularies.length; ++m) {
					           faculties = fields[i].children[j].children[k]; 
					           ////if(fields[i].children[j].children[k].vocabularies[m].namespace == 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_faculty/'){
				         		  //for (n = 0; n < fields[i].children[j].children[k].vocabularies[m].term.length; ++n) {
				                                 ////terms = fields[i].children[j].children[k].vocabularies[m].terms
				                                
				                          //}   
						   ////}
					    /// }
			               }
				 }
			 }
		 }
	   }
      }
       $scope.faculties = faculties;
       console.log('getFaculties', faculties);
    }
         
    $scope.faculties_array_test = function(){
        console.log('faculties_array', $scope.faculties_array);
    }
    
    $scope.load_init = function(){
        console.log('load_init');
        //$scope.watched_curriculum_child_selectboxes = [];

        var i = 0;
    	for (i = 0; i < $scope.faculties_array.length; ++i) {
	        $scope.$watch('faculties_array['+i+'].faculty', $scope.faculty_update_handler, true);
	}
    	
    	//for (i = 0; i < $scope.watched_curriculum_child_selectboxes.length; ++i) {
    	//	$scope.$watch('watched_curriculum_child_selectboxes['+i+']', $scope.curriculum_update_handler, true);
    	//}

    };

    /*
    $scope.watch_cascaded = function (children) {
    	var i = 0;
    	for (i = 0; i < children.length; ++i) {
    		// the cascaded select-boxes are always leafs
    		if(children[i].children){
    			$scope.watch_cascaded(children[i].children);
    		}else{
    			if(children[i].xmlname == 'faculty'){
    				$scope.watched_faculty_selectboxes.push(children[i]);
    			}
    			//if(children[i].xmlname == 'spl' || children[i].xmlname == 'kennzahl'){
    			//	$scope.watched_curriculum_child_selectboxes.push(children[i]);
    			//}
    		}

    	}
    }
    */
    
    // move it from handler to init funcition
    $scope.get_namespaces = function(faculty_node){
    
        var faculty_parent = $scope.get_namespace_parent(null, $scope.tree, 'faculty');  
        console.log('faculty_parent', faculty_parent);    
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
    
      //here!!!!!
    }
    
    $scope.faculty_update_handler = function(faculty_node){
	console.log('faculty_update_handler faculty_node:',faculty_node);
    	if(!faculty_node){
    	    console.log('faculty_update_handler returning1');	
	    return;
    	}

	// we don't want to update select-boxes when they are only being rendered
	if($scope.form){
		if($scope.form.$pristine){
			console.log('faculty_update_handler returning2');	
			//return;
		}
	}
                     
        //orgassignment  faculty_node
        var faculty_parent = $scope.get_namespace_parent(null, $scope.tree, 'faculty');  
        console.log('faculty_parent', faculty_parent);    
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
	$scope.faculty_namespace = faculty_namespace;
	$scope.department_namespace = department_namespace;
	
	var faculty_id = faculty_node.substring(faculty_namespace.length);
	console.log('faculty_id', faculty_id);
	console.log('department_namespace', department_namespace);

	var promise = DirectoryService.getOrgUnits(faculty_id, department_namespace);
    	$scope.loadingTracker.addPromise(promise);
    	promise.then(
    		     function(response) {
    			       //console.log('faculty_node123',faculty_node);
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
			       console.log('getOrgUnits termsWithLabels', termsWithLabels);
			       for (i = 0; i < $scope.faculties_array.length; ++i) {
				   if($scope.faculties_array[i].faculty == faculty_node){
				        $scope.faculties_array[i].departments = [];
				        angular.copy(termsWithLabels, $scope.faculties_array[i].departments);
					
				   }
			       }
			        //console.log('getOrgUnits response.data.terms', response.data.terms);
			        console.log('getOrgUnits faculties_array',  $scope.faculties_array);
				
    		      }
    		     ,function(response) {
           		       $scope.alerts = response.data.alerts;
           		       $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	      }
    	           );
     };
    
    //mf
    $scope.get_namespace_parent = function (parent, children, namespace) {
    	console.log('get_namespace_parent children:',children);
	console.log('get_namespace_parent namespace:',namespace);
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
        console.log('getRightsObject pid:', $scope.pid)
        var promise = MetadataService.getRightsObject($scope.pid);
    	$scope.loadingTracker.addPromise(promise);
    	promise.then(
        	function(response) {
        		$scope.alerts = response.data.alerts;
			console.log('getRightsObject',response.data);
			$scope.convertRightsData(response.data);
			console.log('after convert faculties_array',$scope.faculties_array);
	                console.log('after convert rights_username_array',$scope.rights_username_array);
			//$scope.faculties
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
	               institution.dt_end             = rightsData.metadata.rights.department[i].expires;
	               var departmentUri = $scope.departmentNamespace+rightsData.metadata.rights.department[i].value;
		       institution.selectedDepartment = departmentUri;
		       
		       console.log('Department',rightsData.metadata.rights.department[i].value);
		       //institution.faculty = $scope.getFacultyFromDepartment(institution.selectedDepartment, institution);
		       $scope.getFacultyFromDepartment(institution);
	          }else{
		       var departmentUri = $scope.departmentNamespace+rightsData.metadata.rights.department[i];
		       institution.selectedDepartment = departmentUri;
		       //institution.faculty = $scope.getFacultyFromDepartment(institution.selectedDepartment,institution);
		       $scope.getFacultyFromDepartment(institution);
	          }
	          console.log('institution123',institution);
	          $scope.faculties_array.push(institution);
	     }
	}
	console.log('faculties_array123',$scope.faculties_array);
	console.log('rights_username_array123',$scope.rights_username_array);
    }
    
    
    $scope.getFacultyFromDepartment = function(institution) {
         
         var departmentArray = institution.selectedDepartment.split('/');
	 var departmentId = departmentArray.pop();
	 console.log('getFacultyFromDepartment departmentId',departmentId);
	 var promise = FrontendService.getFacultyIdFromDepatment(departmentId);
    	 $scope.loadingTracker.addPromise(promise);
    	 promise.then(
        	function(response) {
        		$scope.alerts = response.data.alerts;
        		$scope.form_disabled = false;
			console.log('getFacultyFromDepartment:',response.data);
			
			//institution.faculty = $scope.getFacultyLomFromId(response.data.parent_id);
			institution.faculty = $scope.facultyNamespace+response.data.parent_id;
			console.log('faculty567:',institution.faculty);
        	}
               ,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           		$scope.form_disabled = false;
           	}
        );
    }
    
    /*
    $scope.getFacultyLomFromId = function(id) {
        
          console.log('faculties987',$scope.faculties);
	  var facultyLom;
	  for (i = 0; i <  $scope.faculties.vocabularies[0].terms.length; ++i) {
	       var facultyUri = $scope.faculties.vocabularies[0].terms[i].uri;
	       var facultyUriArray = facultyUri.split('/');
	       var facultyUriId = facultyUriArray.pop();
	       console.log('qwsa',facultyUriId,':',id);
	       if(facultyUriId == id){
		   facultyLom = $scope.faculties.vocabularies[0].terms[i].uri;
	       }
	  }
	  console.log('facultyLom',facultyLom);
	  
	  return facultyLom;
    }
    */
    
    $scope.saveRights = function() {
        
	console.log('faculties_array',$scope.faculties_array);
	console.log('rights_username_array',$scope.rights_username_array);

	var rights = {};
	rights.metadata = {};
	rights.metadata.rights = {};
	rights.metadata.rights.username = [];
	rights.metadata.rights.faculty = [];
	rights.metadata.rights.department = [];
	//usernames
	for (i = 0; i < $scope.rights_username_array.length; ++i) {
	   console.log('username dt_end:',$scope.rights_username_array[i].dt_end); 
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
	          console.log('aaa');
	          if(typeof $scope.faculties_array[i].selectedDepartment === 'undefined'){
		             console.log('bbb1');
			     var idArray = $scope.faculties_array[i].faculty.split('/');
		             rights.metadata.rights.faculty.push(idArray.pop());
		  }else if($scope.faculties_array[i].selectedDepartment == ''){
		             console.log('bbb2');
			     var idArray = $scope.faculties_array[i].faculty.split('/');
		             rights.metadata.rights.faculty.push(idArray.pop());  
		  }else if($scope.faculties_array[i].selectedDepartment == null){
		    	     if($scope.faculties_array[i].faculty != null && $scope.faculties_array[i].faculty != ''){
		                    console.log('bbb3');
			            var idArray = $scope.faculties_array[i].faculty.split('/');
		                    rights.metadata.rights.faculty.push(idArray.pop());
			     }
		  }else{
		             console.log('ccc');
			     var idArray = $scope.faculties_array[i].selectedDepartment.split('/');
		             rights.metadata.rights.department.push(idArray.pop());
		  }
	    }else{
	         console.log('ffffffff',$scope.faculties_array[i].selectedDepartment); 
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
	console.log('saveRights pid:', $scope.$parent.pid);
	console.log('saveRights rights:', rights);
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

   /*
    {
    "metadata": {
        "rights": {
            "department": [
                {
                    "value": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_department/A581",
                    "expires": "2015-08-10T22:00:00.000Z"
                }
            ],
            "faculty": [
                {
                    "value": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_faculty/A32",
                    "expires": "2015-08-06T22:00:00.000Z"
                },
                "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/organization/voc_faculty/A49"
            ],
            "username": [
                {
                    "value": "test1",
                    "expires": "2015-08-11T22:00:00.000Z"
                },
                "test2"
            ]
        }
     }
    }
    */
   
      
    }
    
    /*
    $scope.addNewUser = function() {
      	   
	     var initialValueUser = {};
	     initialValueUser.id = '';
	     $scope.rights_username_array.push(initialValueUser);
    }
    */
    
    $scope.addNewUser2 = function(RUser, date) {
      	  
	      console.log('addNewUser2 before',RUser, ':',date); 
	      var newUser = {};
	      RUser =  angular.fromJson(RUser);
	      newUser.id = RUser.uid;
	      newUser.value = RUser.value;
	      newUser.dt_end = date;
	      $scope.rights_username_array.push(newUser);
	      console.log('addNewUser2 after',$scope.rights_username_array);
	      console.log('addNewUser2 delete',$scope.rightsQuery,':',$scope.RUser,':',$scope.rights_date_end);
	      $scope.rightsQuery = '';
	      $scope.RUser = '';
	      $scope.rights_date_end = '';
	      
	      
    }
    
    
    $scope.deleteUser = function(index) {

	    console.log('before delete',$scope.rights_username_array); 
            $scope.rights_username_array.splice(index, 1);
	    console.log('before after',$scope.rights_username_array);
	    
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
    
    
    
    $scope.test = function() {
         //console.log('dt_start', $scope.validation_date.dt_start);
         //console.log('dt_end', $scope.validation_date.dt_end);
         //console.log('rights_faculty', $scope.faculties.faculty);
         //console.log('rights_username', $scope.rights_username.id);
	 //console.log('departments.faculty', $scope.departments.faculty);
	 console.log('rights_username_array', $scope.rights_username_array);
	 console.log('faculties_array', $scope.faculties_array);
	 console.log('rights_username_array', $scope.rights_username_array);
	 
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
   /*
  $scope.getUsers = function(query, index) {
        console.log("getUsers query:",query, index);
        var promise = FrontendService.rightsGetUsers(query);
        $scope.loadingTracker.addPromise(promise);
        promise.then(
    		function(response) {
			console.log('getUsers12321', response.data);
			//$scope.queryUsers = response.data.accounts;
			$scope.rights_username_array[index].queryUsers = response.data.accounts;
			if($scope.rights_username_array[index].queryUsers.length >= 49){
			    console.log('adding50');
			    var last = {};
			    last.value = 'There are more results. Please make your query longer!';
			    $scope.rights_username_array[index].queryUsers.push(last);
			}
			
			
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	);
  }
 
  
  $scope.setUserValue = function(uid, id) {
      id = uid;
  }
   */ 
   
  $scope.getUsers2 = function(query) {
        console.log("getUsers2 query:",query);
        var promise = FrontendService.rightsGetUsers(query);
        $scope.loadingTracker.addPromise(promise);
        promise.then(
    		function(response) {
			console.log('2getUsers12321', response.data);
			//$scope.queryUsers = response.data.accounts;
			$scope.queryUsers = response.data.accounts;
			if($scope.queryUsers.length >= 49){
			    console.log('adding502');
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