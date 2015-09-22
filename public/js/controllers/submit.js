app.controller('SubmitCtrl',  function($scope, $modal, $location, FrontendService, MetadataService, promiseTracker) {
   
   $scope.initdata = {};
   $scope.username = '';
 
   $scope.metadata_to_send = {};
   
   $scope.successful = {};
   $scope.object_type = '';
   
   $scope.uwmetalanguages = {};
   $scope.uwmetadataTree = [];
   $scope.licenses = [];
   $scope.licensesUri = [];
   $scope.licensesUriUwmeta = [];
   $scope.licensesUriMods = [];
    
   $scope.language; 
   $scope.title;
   $scope.description;
   $scope.licence;

   $scope.selectedRoles = [];
      
   $scope.init = function (initdata) {
     
        //roles picture mods
        var role = {};
        $scope.roles = []
        role.label = 'Art copyist'
        role.id   = 'acp';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Art director'
        role.id   = 'adi';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Animator'
        role.id   = 'anm';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Artistic director'
        role.id   = 'ard';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Artist'
        role.id   = 'art';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Colorist'
        role.id   = 'clr';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Conservator'
        role.id   = 'con';
        $scope.roles.push(role);
    
        role = {}
        role.label = 'Designer'
        role.id   = 'dsr';
        $scope.roles.push(role);
    
        role = {}
        role.label = 'Illustrator'
        role.id   = 'ill';
        $scope.roles.push(role);
    
        role = {}
        role.label = 'Illuminator'
        role.id   = 'ilu';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Landscape architect'
        role.id   = 'lsa';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Owner'
        role.id   = 'own';
        $scope.roles.push(role);
    
        role = {}
        role.label = 'Panelist'
        role.id   = 'pan';
        $scope.roles.push(role);
    
        role = {}
        role.label = 'Publisher'
        role.id   = 'pbl';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Publishing director'
        role.id   = 'pbd';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Photographer'
        role.id   = 'pht';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Platemaker'
        role.id   = 'plt';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Puppeteer'
        role.id   = 'ppt';
        $scope.roles.push(role);
    
        role = {}
        role.label = 'Printmaker'
        role.id   = 'prm';
        $scope.roles.push(role);
    
        role = {}
        role.label = 'Printer'
        role.id   = 'prt';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Sculptor'
        role.id   = 'scl';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Woodcutter'
        role.id   = 'wdc';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Other'
        role.id   = 'oth';
        $scope.roles.push(role);
        
	

        console.log('SubmitCtrl init',initdata);
	$scope.initdata = angular.fromJson(initdata);
	$scope.username = $scope.initdata.current_user.username;
	$scope.object_type = $scope.initdata.object_type;
	
	$scope.getLanguages();
	$scope.getLicensesMods();
	$scope.getLicensesUwmeta();
	$scope.getUwmetadataTree();
   }
   
   
   $scope.new_object = function (object_type) {
        
        //console.log('new_object:', object_type );
        window.location = $('head base').attr('href')+'submit/new/'+object_type;
   }
   
   $scope.addNewObject = function () {
        window.location = $('head base').attr('href')+'submit';
   }
   
   $scope.init_successful = function (initdata) {
      
      $scope.successful = angular.fromJson(initdata);
      console.log('init_successful successful',$scope.successful );
   }
   
   $scope.addNewRole = function () {
        
        var newRole = {};
	newRole.URI = '';

	newRole.firstname = '';
	newRole.lastname  = '';
        $scope.selectedRoles.push(newRole);
	//console.log('addNewRole selectedRoles', $scope.selectedRoles);
   }
   
   $scope.deleteRole = function (index) {
       
        $scope.selectedRoles.splice(index, 1);
   }
   
   
   $scope.getLanguages = function (initdata) {
     
            var promise = MetadataService.getLanguages();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			console.log('getLanguages',response.data);
		        $scope.alerts = response.data.alerts;
    			
			$scope.uwmetalanguages = response.data.languages;
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   );
   }
   
   
   $scope.getLicensesMods = function () {
            
            var promise = MetadataService.getLicenses();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			console.log('getLicenses mods',response.data);
		        $scope.alerts = response.data.alerts;
			$scope.licenses = response.data.licenses;
			$scope.getLicensesUriMods();
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   );
   }
   
   $scope.getLicensesUriMods = function () {
        
        for (i = 0; i < $scope.licenses.length; ++i) {
	     if($scope.licenses[i].lid == 1){
	                var license = {}; 
			license.id = 1;
			license.label = 'All rights reserved';
			license.uri = 'All rights reserved';
		        $scope.licensesUriMods.push(license);
			continue; 
             }
	     var  licensesUri = {};
	     license.id = $scope.licenses[i].lid;
	     licensesUri.uri   = $scope.licenses[i].link_uri;
	     licensesUri.label = $scope.licenses[i].labels.en;
	     $scope.licensesUriMods.push(licensesUri);
	}
        console.log('getLicensesUriMods',$scope.licensesUriMods);    
     
   }

   $scope.getLicensesUwmeta = function () {
     
            var promise = MetadataService.getLicenses();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			//console.log('getLicenses uwmeta',response.data);
		        $scope.alerts = response.data.alerts;
			$scope.licenses = response.data.licenses;
			//$scope.getUwmetadataTree();
			var uw_uri = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/voc_21/';
	                for (i = 0; i < $scope.licenses.length; ++i) {
			    var license = {};
			    license.label = $scope.licenses[i].labels.en;;
			    license.uri = uw_uri+$scope.licenses[i].lid;
		            $scope.licensesUriUwmeta.push(license);
		        }
		        console.log('getLicensesUriUW2',  $scope.licensesUriUwmeta);
	  	
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   );
   }
   

   $scope.getUwmetadataTree = function () {
     
            var promise = MetadataService.getUwmetadataTree();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
    			//console.log('getUwmetadataTree',response.data);
		        $scope.alerts = response.data.alerts;
    			$scope.uwmetadataTree = response.data.tree;
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	    );
   }
     
   $scope.$watch('metadata', function(newValue, oldValue) {
    	if(newValue){
	      console.log('watcher.');
	      $scope.licensesUri = [];
	      if($scope.metadata == 'mods'){
		   $scope.licensesUri = $scope.licensesUriMods;
	      }
	      if($scope.metadata == 'uwmetadata'){
	           $scope.licensesUri = $scope.licensesUriUwmeta;
	      }
	      console.log('scope.licensesUri:', $scope.licensesUri);
    	}
    });
   

  $scope.setMeta = function () {
 
    if($scope.metadata == 'uwmetadata'){
      //roles
      var contribute = {
                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                    "xmlname": "contribute",
                    "children": [
                        {
                            "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                            "xmlname": "role",
                            "ui_value": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/voc_3/46",
                            "datatype": "Vocabulary"
                        },
                        {
                            "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                            "xmlname": "entity",
                            "children": [
                                {
                                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/entity",
                                    "xmlname": "firstname",
                                    "ui_value": "",
                                    "datatype": "CharacterString"
                                }, 
                                {
                                    "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/entity",
                                    "xmlname": "lastname",
                                    "ui_value": "",
                                    "datatype": "CharacterString"
                                }
                            ],
                            "data_order": "0",
                            "ordered": 1
                        }
                    ],
                    "data_order": "0",
                    "ordered": 1
                };
        
      var contributeArray = [];
      for (i = 0; i < $scope.selectedRoles.length; ++i) {
	     contribute.children[0].ui_value             = $scope.selectedRoles[i].URI;
	     contribute.children[1].children[0].ui_value = $scope.selectedRoles[i].firstname;
	     contribute.children[1].children[1].ui_value = $scope.selectedRoles[i].lastname;
	     var newContribute = angular.copy(contribute);
	     contributeArray.push(newContribute);
      }
		
		
      $scope.uwmetadata = 
                   {
                   "metadata": {
                       "uwmetadata": [
                           {
                               "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                               "xmlname": "general",
                               "children": [
                                   {
                                       "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                                       "xmlname": "identifier",
                                       "ui_value": "",
                                       "datatype": "CharacterString"
                                   },
                                   {
                                       "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                                       "xmlname": "title",
                                       "ui_value": "",
                                       "value_lang": "en",
                                       "datatype": "LangString"
                                   },
                                   {
                                       "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                                       "xmlname": "language",
                                       "ui_value": "",
                                       "datatype": "Language"
                                   },
                                   {
                                       "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                                       "xmlname": "description",
                                       "ui_value": "",
                                       "value_lang": "en",
                                       "datatype": "LangString"
                                   }
                               ]
                           },
                           {
                               "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                               "xmlname": "lifecycle",
                               "children": [
                               ]
                           },
                           {
                               "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                               "xmlname": "rights",
                               "children": [
                                   {
                                       "xmlns": "http://phaidra.univie.ac.at/XML/metadata/lom/V1.0",
                                       "xmlname": "license",
                                       "ui_value": "",
                                       "datatype": "License"
                                   }
                               ]
                           }
                       ]
                   }
               };
	
       for (i = 0; i < contributeArray.length; ++i) {
	   $scope.uwmetadata.metadata.uwmetadata[1].children.push(contributeArray[i]);
       }
       //title
       $scope.uwmetadata.metadata.uwmetadata[0].children[1].ui_value = $scope.title;
       //language
       $scope.uwmetadata.metadata.uwmetadata[0].children[2].ui_value = $scope.language;
       //description
       $scope.uwmetadata.metadata.uwmetadata[0].children[3].ui_value = $scope.description;
       //license
       $scope.uwmetadata.metadata.uwmetadata[2].children[0].ui_value = $scope.licence;
       
       $scope.metadata_to_send = $scope.uwmetadata;
     
    };
    
    if($scope.metadata == 'mods'){
           
      $scope.mods =
           {"metadata":  
	       {"mods": [
                           {
                              "xmlname": "titleInfo",
                              "input_type": "node",
                              "label": "Title info",
                              "children": [
                                            {
                                              "ui_value": "Makedonien, Altserbien und Albanien",
                                              "xmlname": "title",
                                              "input_type": "input_text",
                                              "label": "Title",
                                              "mandatory": 1,
                                              "attributes": [
                                                              {
                                                                "xmlname": "lang",
                                                                "input_type": "input_text",
                                                                "label": "Language"
                                                              },
                                                              {
                                                                 "xmlname": "script",
                                                                 "input_type": "input_text",
                                                                 "label": "Script"
                                                              },
                                                              {
                                                                  "xmlname": "transliteration",
                                                                  "input_type": "input_text",
                                                                  "label": "Transliteration"
                                                              }
                                                            ]
                                             }
			                   ]
			   },
	                   {
				 "xmlname": "language",
                                 "input_type": "node",
                                 "label": "Language",
                                 "children": [
                                                {
                                                  "ui_value": "ger",
                                                  "xmlname": "languageTerm",
                                                  "input_type": "input_text",
                                                  "label": "Language term",
                                                  "attributes": [
                                                                  {
                                                                    "ui_value": "code",
                                                                    "xmlname": "type",
                                                                    "input_type": "select",
                                                                    "label": "Type"
                                                                  },
                                                                  {
                                                                     "ui_value": "iso639-2b",
                                                                     "xmlname": "authority",
                                                                     "input_type": "select",
                                                                     "label": "Authority"
                                                                  }

                                                               ]
                                                }
			                      ]
		 
	                     },
	                     {
			       "ui_value": "blablabla222333",
                               "xmlname": "note",
                               "input_type": "input_text",
                               "label": "Note",
			     },
	                     {
			       "ui_value": "http:\\/\\/creativecommons.org\\/licenses\\/by-nc-sa\\/2.0\\/",
                               "xmlname": "accessCondition",
                               "extensible": 1,
                               "input_type": "input_text",
                               "label": "Access condition",
                               "attributes": [
                                               {
                                                 "ui_value": "use and reproduction",
                                                 "xmlname": "type",
                                                 "input_type": "select",
                                                 "label": "Type"
                                               }
			                     ]
			     }
			]
			     
	    }
	  };
         
	  var contribute =  {
			       "xmlname": "name",
                               "input_type": "node",
                               "label": "Name",
                               "children": [
                                             {
                                                 "ui_value": "Peucker, Karl5123437",
                                                 "xmlname": "namePart",
                                                 "input_type": "input_text",
                                                 "mandatory": 1,
                                                 "label": "Name part"
                                             },
	                                     {
                                                "xmlname": "role",
                                                "input_type": "node",
                                                "label": "Role",
                                                "children": [
                                                              {
                                                                 "ui_value": "aut",
                                                                 "xmlname": "roleTerm",
                                                                 "input_type": "input_text",
                                                                 "label": "Role term",
                                                                 "mandatory": 1,
                                                                 "attributes": [
                                                                                 {
                                                                                   "ui_value": "code",
                                                                                   "xmlname": "type",
                                                                                   "input_type": "select",
                                                                                   "label": "Type"
                                                                                 },
                                                                                 {
                                                                                    "ui_value": "marcrelator",
                                                                                    "xmlname": "authority",
                                                                                    "input_type": "select",
                                                                                    "label": "Authority"
                                                                                 }
                                                                                ]
                                                                }
                                                              ]
                                                }
			                      ],
	                           "attributes": [
                                                   {
                                                      "ui_value": "personal",
                                                      "xmlname": "type",
                                                      "input_type": "select",
                                                      "label": "Type"
                                                   },
                                                   {
                                                      "ui_value": "gnd",
                                                      "xmlname": "authority",
                                                      "input_type": "select",
                                                      "label": "Authority"
                                                   },
                                                   {
                                                      "ui_value": "http:\\/\\/d-nb.info\\/gnd\\/",
                                                      "xmlname": "authorityURI",
                                                      "input_type": "input_text",
                                                      "label": "Authority URI"
                                                   },
                                                   {
                                                      "ui_value": "http:\\/\\/d-nb.info\\/gnd\\/(DE-588)116138777",
                                                      "xmlname": "valueURI",
                                                      "input_type": "input_text",
                                                      "label": "Value URI"
                                                   }
                                                 ]
	                     };
			     
			     
	   var contributeArray = [];
           for (i = 0; i < $scope.selectedRoles.length; ++i) {
	         var name =  $scope.selectedRoles[i].lastname+', '+$scope.selectedRoles[i].firstname; // user input
	         contribute.children[0].ui_value             = name;
	         contribute.children[1].children[0].ui_value = $scope.selectedRoles[i].URI;  //label but uri
	         var newContribute = angular.copy(contribute);
	         contributeArray.push(newContribute);
           }
           
	   $scope.mods.metadata.mods[0].children[0].ui_value = $scope.title;
	   $scope.mods.metadata.mods[1].children[0].ui_value = $scope.language;
	   $scope.mods.metadata.mods[2].ui_value             = $scope.description;
           $scope.mods.metadata.mods[3].ui_value             = $scope.licence;
           
	   for (i = 0; i < contributeArray.length; ++i) {
	        $scope.mods.metadata.mods.push(contributeArray[i]);
           }
	  
	  
          $scope.metadata_to_send = $scope.mods;
     } //end if
   
     console.log('metadata_to_send456:', $scope.metadata_to_send);
    
 } 
  
});