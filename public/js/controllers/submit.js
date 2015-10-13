app.controller('SubmitCtrl',  function($scope, $modal, $location, MetadataService, SubmitService, promiseTracker) {
   
   $scope.submitService = SubmitService; 
    
   
   $scope.uw_uri = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/voc_21/';
   $scope.initdata = {};
   $scope.username = '';
 
   $scope.metadata_to_send = {};
   
   $scope.successful = {};
   $scope.object_type = '';
   
   $scope.uwmetalanguages = {};
   $scope.uwmetalanguagesArray = [];
   $scope.uwmetadataTree = [];
   //$scope.licenses = [];
   $scope.licensesUri = [];
   $scope.licensesUriUwmeta = [];
   $scope.licensesUriMods = [];

   $scope.roles;
     
   $scope.pid_mods = '';
   $scope.pid_uwmeta = '';
   $scope.object_mods = {};
   $scope.object_uwmeta = {};
   
   $scope.init = function (initdata) {
   	
        console.log('SubmitCtrl init',initdata);
	$scope.initdata = angular.fromJson(initdata);
	$scope.username = $scope.initdata.current_user.username;
	$scope.object_type = $scope.initdata.object_type;
	
	$scope.setRolsMods();
	$scope.getLanguages();
	$scope.getLicensesMods();
	$scope.getLicensesUwmeta();
	$scope.getUwmetadataTree();
   }
   
   

   $scope.test1 = function () {
           //console.log('metadata1:',$scope.metadata);
           //console.log('SubmitService.submit_metadata',SubmitService.submit_metadata);
           //console.log('SubmitService.submit_title',SubmitService.submit_title);
           console.log('SubmitService.submit_licence',SubmitService.submit_licence);
           //console.log('submit_selectedRoles',SubmitService.submit_selectedRoles);
           //console.log('uwmetalanguages:',$scope.uwmetalanguages);
           //console.log('submit_language:',SubmitService.submit_language);
           // console.log('uwmetalanguagesArray:',$scope.uwmetalanguagesArray);
           
           console.log('licensesUri:',$scope.licensesUri);
           console.log('object_uwmeta:',$scope.object_uwmeta);
           console.log('object_mods:',$scope.object_mods);
           
           
           
           //$scope.metadata = SubmitService.submit_metadata;
   }

   
   
   $scope.loadFromPidMods = function (pid) {
          console.log('pid ',pid );     
          var promise = MetadataService.getModsFromObject(pid);
          $scope.loadingTracker.addPromise(promise);
          promise.then(
                    function(response) {
                        $scope.alerts = response.data.metadata.alerts;
                        if(response.data.metadata.mods){
                                $scope.object_mods = response.data.metadata.mods;
                                SubmitService.submit_metadata = 'mods';
                                SubmitService.submit_language = SubmitService.getLanguageMods($scope.object_mods);
                                SubmitService.submit_title = SubmitService.getTitleMods($scope.object_mods);
                                SubmitService.submit_description = SubmitService.getDescriptionMods($scope.object_mods);
                                SubmitService.submit_licence = SubmitService.getLicenceMods($scope.object_mods);
                                SubmitService.submit_selectedRoles = SubmitService.getRolesMods($scope.object_mods);
                        }else{
                                $scope.loadFromPidUwmeta(pid); 
                        }
                        
                   }
                   ,function(response) {
                        $scope.alerts = response.data.alerts;
                        if(typeof $scope.alerts !== 'undefined'){
                              $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                        }
                   }
         );  
   }
   
   //$scope.loadFromPidUwmeta = function (pid) {
   $scope.loadFromPidUwmeta = function (pid) {  
           
        var promise = MetadataService.getUwmetadataFromObject(pid);
        $scope.loadingTracker.addPromise(promise);
        promise.then(
                function(response) {
                        $scope.alerts = response.data.alerts;
                        $scope.object_uwmeta = response.data.metadata.uwmetadata;
                        SubmitService.submit_metadata = 'uwmetadata';
                        SubmitService.submit_title = SubmitService.getTitleUwmeta($scope.object_uwmeta);
                        SubmitService.submit_description = SubmitService.getDescriptionUwmeta($scope.object_uwmeta);
                        SubmitService.submit_language = SubmitService.getLanguageUwmeta($scope.object_uwmeta);
                        SubmitService.submit_licence = SubmitService.getLicenceUwmeta($scope.object_uwmeta);
                        SubmitService.submit_selectedRoles = SubmitService.getRolesUwmeta($scope.object_uwmeta);
                }
                ,function(response) {
                        $scope.alerts = response.data.alerts;
                        if(typeof $scope.alerts !== 'undefined'){
                              $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                        }
                }
        ); 
   }
   
   $scope.loadFromTemplate = function () {
           
              var modalInstance = $modal.open({
                     templateUrl: $('head base').attr('href')+'views/modals/submit/load_from_template.html',
                     controller: LoadFromTemplateModalCtrl,                     
              });
   }
   
   $scope.new_object = function (object_type) {
        
        window.location = $('head base').attr('href')+'submit/new/'+object_type;
   }
   
   $scope.addNewObject = function () {
        window.location = $('head base').attr('href')+'submit';
   }
   
   $scope.init_successful = function (initdata) {
      
      $scope.successful = angular.fromJson(initdata);
   }
   
   $scope.addNewRole = function () {
        
        var newRole = {};
	newRole.URI = '';

	newRole.firstname = '';
	newRole.lastname  = '';
        SubmitService.submit_selectedRoles.push(newRole);
   }
   
   $scope.deleteRole = function (index) {
       
        SubmitService.submit_selectedRoles.splice(index, 1);
   }
   
   
   $scope.getLanguages = function (initdata) {
     
            var promise = MetadataService.getLanguages();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
		        $scope.alerts = response.data.alerts;
    			
			$scope.uwmetalanguages = response.data.languages;
                        
                        $scope.uwmetalanguagesArray = [];
                        for (var key in $scope.uwmetalanguages) {
                              var language = {};
                              language.id = key;
                              language.label = $scope.uwmetalanguages[key];
                              $scope.uwmetalanguagesArray.push(language);  
                        }
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
		        $scope.alerts = response.data.alerts;
			$scope.getLicensesUriMods(response.data.licenses);
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   );
   }
   
   $scope.getLicensesUriMods = function (licenses) {
        
        for (i = 0; i < licenses.length; ++i) {
	     if(licenses[i].lid == 1){
	                var license = {}; 
			license.id = 1;
			license.label = 'All rights reserved';
			license.uri = 'All rights reserved';
		        $scope.licensesUriMods.push(license);
			continue; 
             }
	     var  licensesUri = {};
	     license.id = licenses[i].lid;
	     licensesUri.uri   = licenses[i].link_uri;
	     licensesUri.label = licenses[i].labels.en;
	     $scope.licensesUriMods.push(licensesUri);
	}
   }

   $scope.getLicensesUwmeta = function () {
     
            var promise = MetadataService.getLicenses();
    	    $scope.loadingTracker.addPromise(promise);
    	    promise.then(
    		function(response) {
		        $scope.alerts = response.data.alerts;
			//$scope.licenses = response.data.licenses;
                        var licenses = response.data.licenses;
			//$scope.getUwmetadataTree();
			//var uw_uri = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/voc_21/';
	                for (i = 0; i < licenses.length; ++i) {
			    var license = {};
			    license.label = licenses[i].labels.en;;
			    license.uri = $scope.uw_uri+licenses[i].lid;
		            $scope.licensesUriUwmeta.push(license);
		        }
	  	
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
		        $scope.alerts = response.data.alerts;
    			$scope.uwmetadataTree = response.data.tree;
    		}
    		,function(response) {
           		$scope.alerts = response.data.alerts;
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	    );
   }
     
   $scope.$watch('submitService.submit_metadata', function(newValue, oldValue) {
    	if(newValue){
	      $scope.licensesUri = [];
              console.log('watch metadata',SubmitService.submit_metadata)
              if(SubmitService.submit_metadata == 'mods'){
		   $scope.licensesUri = $scope.licensesUriMods;
	      }
              if(SubmitService.submit_metadata == 'uwmetadata'){
	           $scope.licensesUri = $scope.licensesUriUwmeta;
	      }
    	}
    });
   

  $scope.setMeta = function () {
 
    //if($scope.metadata == 'uwmetadata'){
    if(SubmitService.submit_metadata == 'uwmetadata'){
            
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
      for (i = 0; i < SubmitService.submit_selectedRoles.length; ++i) {
	     contribute.children[0].ui_value             = SubmitService.submit_selectedRoles[i].URI;
	     contribute.children[1].children[0].ui_value = SubmitService.submit_selectedRoles[i].firstname;
	     contribute.children[1].children[1].ui_value = SubmitService.submit_selectedRoles[i].lastname;
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
       $scope.uwmetadata.metadata.uwmetadata[0].children[1].ui_value = SubmitService.submit_title;
       //language
       $scope.uwmetadata.metadata.uwmetadata[0].children[2].ui_value = SubmitService.submit_language;
       //description
       $scope.uwmetadata.metadata.uwmetadata[0].children[3].ui_value = SubmitService.submit_description;
       //license
       $scope.uwmetadata.metadata.uwmetadata[2].children[0].ui_value = SubmitService.submit_licence;
       
       $scope.metadata_to_send = $scope.uwmetadata;
     
    };
    
    //if($scope.metadata == 'mods'){
    if(SubmitService.submit_metadata == 'mods'){
           
      $scope.mods =
           {"metadata":  
	       {"mods": [
                           {
                              "xmlname": "titleInfo",
                              "input_type": "node",
                              "label": "Title info",
                              "children": [
                                            {
                                              "ui_value": "",
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
			       "ui_value": "",
                               "xmlname": "note",
                               "input_type": "input_text",
                               "label": "Note",
			     },
	                     {
			       //"ui_value": "http:\\/\\/creativecommons.org\\/licenses\\/by-nc-sa\\/2.0\\/",
                               "ui_value": "",
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
                                                 "ui_value": "",
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
           for (i = 0; i < SubmitService.submit_selectedRoles.length; ++i) {
	         var name =  SubmitService.submit_selectedRoles[i].lastname+', '+SubmitService.submit_selectedRoles[i].firstname; // user input
	         contribute.children[0].ui_value             = name;
	         contribute.children[1].children[0].ui_value = SubmitService.submit_selectedRoles[i].URI; //'uri' is just name acronim in mods
	         
	         var newContribute = angular.copy(contribute);
	         contributeArray.push(newContribute);
           }
           
	   $scope.mods.metadata.mods[0].children[0].ui_value = SubmitService.submit_title;
	   $scope.mods.metadata.mods[1].children[0].ui_value = SubmitService.submit_language;
	   $scope.mods.metadata.mods[2].ui_value             = SubmitService.submit_description;
           $scope.mods.metadata.mods[3].ui_value             = SubmitService.submit_licence;
           
	   for (i = 0; i < contributeArray.length; ++i) {
	        $scope.mods.metadata.mods.push(contributeArray[i]);
           }
	  
	  
          $scope.metadata_to_send = $scope.mods;
     } //end if
   
    
 } 
  
 $scope.setRolsMods = function () {
   

    if($scope.object_type == 'audio'){
        //roles audio mods

        $scope.roles = [];
      
        var role = {}; 
        role.label = 'Collotyper';
        role.id   = 'clt';
        $scope.roles.push(role); 
	
        var role = {};
        role.label = 'Art copyist';
        role.id   = 'acp';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Art director';
        role.id   = 'adi';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Actor';
        role.id   = 'act';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Author of afterword, colophon, etc.';
        role.id   = 'aft';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Artist';
        role.id   = 'art';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Artistic director';
        role.id   = 'ard';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Attributed name';
        role.id   = 'att';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Author of dialog';
        role.id   = 'aud';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Author of introduction, etc.';
        role.id   = 'aui';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Screenwriter';
        role.id   = 'aus';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Author';
        role.id   = 'aut';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Broadcaster';
        role.id   = 'brd';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Caster';
        role.id   = 'cas';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Conceptor';
        role.id   = 'ccp';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Commentator';
        role.id   = 'cmm';
        $scope.roles.push(role);
  
        role = {}
        role.label = 'Composer';
        role.id   = 'cmp';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Compositor';
        role.id   = 'cmt';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Conductor';
        role.id   = 'cnd';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Censor';
        role.id   = 'cns';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Compiler';
        role.id   = 'com';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Conservator';
        role.id   = 'con';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Cover designer';
        role.id   = 'cov';
        $scope.roles.push(role);
  
	role = {};
        role.label = 'Copyright claimant';
        role.id   = 'cpc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Copyright holder';
        role.id   = 'cph';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Creator';
        role.id   = 'cre';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Contributor';
        role.id   = 'ctb';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Director';
        role.id   = 'drt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Dubious author';
        role.id   = 'dub';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Editor of compilation';
        role.id   = 'edc';
        $scope.roles.push(role);
		
	role = {};
        role.label = 'Expert';
        role.id   = 'exp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Former owner';
        role.id   = 'fmo';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Host';
        role.id   = 'hst';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Interviewee';
        role.id   = 'ive';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Interviewer';
        role.id   = 'ivr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Lyricist';
        role.id   = 'lyr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Music copyist';
        role.id   = 'mcp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Medium';
        role.id   = 'med';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Manufacture place';
        role.id   = 'mfp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Manufacturer';
        role.id   = 'mfr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Moderator';
        role.id   = 'mod';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Musical director';
        role.id   = 'msd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Musician';
        role.id   = 'mus';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Narrator';
        role.id   = 'nrt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Publishing director';
        role.id   = 'pbd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Publisher';
        role.id   = 'pbl';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Production manager';
        role.id   = 'pmn';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Printer of plates';
        role.id   = 'pop';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Performer';
        role.id   = 'prf';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Publication place';
        role.id   = 'pup';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Recordist';
        role.id   = 'rcd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Recording engineer';
        role.id   = 'rce';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Redaktor';
        role.id   = 'red';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Radio producer';
        role.id   = 'rpc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Restorationist';
        role.id   = 'rsr';
        $scope.roles.push(role);
		
	role = {};
        role.label = 'Sound designer';
        role.id   = 'sds';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Singer';
        role.id   = 'sng';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Speaker';
        role.id   = 'spk';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Sponsor';
        role.id   = 'spn';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Storyteller';
        role.id   = 'stl';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Stereotyper'
        role.id   = 'str';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Technical director';
        role.id   = 'tcd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Voice actor';
        role.id   = 'vac';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Vocalist';
        role.id   = 'voc';
        $scope.roles.push(role);
	
        role = {};
        role.label = 'Other';
        role.id   = 'oth';
        $scope.roles.push(role); 
     
    }
     
     
    if($scope.object_type == 'picture'){
        //roles picture mods
        $scope.roles = [];
      
        var role = {};
        role.label = 'Art copyist';
        role.id   = 'acp';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Art director';
        role.id   = 'adi';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Animator';
        role.id   = 'anm';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Artistic director';
        role.id   = 'ard';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Artist';
        role.id   = 'art';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Colorist';
        role.id   = 'clr';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Conservator';
        role.id   = 'con';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Designer';
        role.id   = 'dsr';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Illustrator';
        role.id   = 'ill';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Illuminator';
        role.id   = 'ilu';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Landscape architect';
        role.id   = 'lsa';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Owner';
        role.id   = 'own';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Panelist';
        role.id   = 'pan';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Publisher';
        role.id   = 'pbl';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Publishing director';
        role.id   = 'pbd';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Photographer';
        role.id   = 'pht';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Platemaker';
        role.id   = 'plt';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Puppeteer';
        role.id   = 'ppt';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Printmaker';
        role.id   = 'prm';
        $scope.roles.push(role);
    
        role = {};
        role.label = 'Printer';
        role.id   = 'prt';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Sculptor';
        role.id   = 'scl';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Woodcutter';
        role.id   = 'wdc';
        $scope.roles.push(role);
  
        role = {};
        role.label = 'Other';
        role.id   = 'oth';
        $scope.roles.push(role);
    }	
    
    if($scope.object_type == 'video'){
      
        $scope.roles = [];
        
        var role = {};
        role.label = 'Art copyist';
        role.id   = 'acp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Actor';
        role.id   = 'act';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Art director';
        role.id   = 'adi';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Adapter';
        role.id   = 'adp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Animator';
        role.id   = 'anm';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Annotator';
        role.id   = 'ann';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Artistic director';
        role.id   = 'ard';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Arranger';
        role.id   = 'arr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Artist';
        role.id   = 'art';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Attributed name';
        role.id   = 'att';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Author of dialog';
        role.id   = 'aud';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Author of introduction, etc.';
        role.id   = 'aui';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Author';
        role.id   = 'aut';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Broadcaster';
        role.id   = 'brd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Caster';
        role.id   = 'cas';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Choreographer';
        role.id   = 'chr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Collaborator'
        role.id   = 'clb';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Commentator';
        role.id   = 'cmn';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Composer';
        role.id   = 'cmp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Compositor';
        role.id   = 'cmt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Conductor';
        role.id   = 'cnd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Cinematographer';
        role.id   = 'cng';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Copyright claimant';
        role.id   = 'cpc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Copyright holder';
        role.id   = 'cph';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Creator';
        role.id   = 'crr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Consultant to a project';
        role.id   = 'csp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Costume designer';
        role.id   = 'cst';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Contributor';
        role.id   = 'ctb';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Dancer';
        role.id   = 'dnc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Director';
        role.id   = 'drt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Designer';
        role.id   = 'dsr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Distributor';
        role.id   = 'dst';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Data manager';
        role.id   = 'dtm';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Dubious author';
        role.id   = 'dub';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Editor of compilation';
        role.id   = 'edc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Editor of moving image work';
        role.id   = 'edm';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Film distributor';
        role.id   = 'fds';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Field director';
        role.id   = 'fld';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Film editor';
        role.id   = 'flm';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Film director';
        role.id   = 'fmd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Filmmaker';
        role.id   = 'fmk';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Former owner';
        role.id   = 'fmo';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Film producer';
        role.id   = 'fmp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Forger';
        role.id   = 'frg';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Graphic technician';
        role.id   = 'grt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Host';
        role.id   = 'hst';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Illuminator';
        role.id   = 'ilu';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Instrumentalist';
        role.id   = 'itr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Interviewee';
        role.id    = 'ive';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Interviewer';
        role.id    = 'ivr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Lighting designer';
        role.id   = 'lgd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Licensor';
        role.id   = 'lso';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Music copyist';
        role.id   = 'mcp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Metadata contact';
        role.id   = 'mdc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Medium';
        role.id   = 'med';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Musical director';
        role.id   = 'msd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Musician';
        role.id   = 'mus';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Narrator';
        role.id   = 'nrt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Owner';
        role.id   = 'own';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Publishing director';
        role.id   = 'pbd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Publisher';
        role.id   = 'pbl';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Performer';
        role.id   = 'prf';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Presenter';
        role.id   = 'pre';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Producer';
        role.id   = 'pro';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Production designer';
        role.id   = 'prs';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Recording engineer';
        role.id   = 'rce';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Recordist';
        role.id   = 'rcd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Restorationist';
        role.id   = 'rsr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Scenarist';
        role.id   = 'sce';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Sound designer';
        role.id   = 'sds';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Signer';
        role.id   = 'sgn';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Speaker';
        role.id   = 'spk';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Storyteller';
        role.id   = 'stl';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Technical director';
        role.id   = 'tcd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Television director';
        role.id   = 'tld';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Television producer';
        role.id   = 'tlp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Transcriber';
        role.id   = 'trc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Translator';
        role.id   = 'trl';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Voice actor';
        role.id   = 'vac';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Videographer';
        role.id   = 'vgd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Vocalist';
        role.id   = 'voc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Writer of added lyrics';
        role.id   = 'wal';
        $scope.roles.push(role);

        role = {};
        role.label = 'Other';
        role.id   = 'oth';
        $scope.roles.push(role);
    }
    
    if($scope.object_type == 'document'){
      
        $scope.roles = [];
        
        var role = {};
        role.label = 'Annotator';
        role.id   = 'ann';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Bibliographic antecedent';
        role.id   = 'ant';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Author in quotations or text abstracts';
        role.id   = 'aqt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Author of afterword, colophon, etc.';
        role.id   = 'aft';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Autographer';
        role.id   = 'ato';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Attributed name';
        role.id   = 'att';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Author of dialog';
        role.id   = 'aud';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Author of introduction, etc.';
        role.id   = 'aui';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Author';
        role.id   = 'aut';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Binding designer';
        role.id   = 'bdd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Bookjacket designer';
        role.id    = 'bjd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Book designer';
        role.id    = 'bkd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Book producer';
        role.id   = 'bkp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Binder';
        role.id   = 'bnd';
        $scope.roles.push(role);
      
	role = {};
        role.label = 'Bookplate designer';
        role.id   = 'bpd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Braille embosser';
        role.id   = 'brl';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Bookseller';
        role.id   = 'bsl';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Calligrapher';
        role.id   = 'cll';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Colorist';
        role.id   = 'clr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Censor';
        role.id   = 'cns';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Conservator';
        role.id   = 'con';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Collection registrar';
        role.id   = 'cor';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Cover designer'
        role.id   = 'cov';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Copyright holder';
        role.id   = 'cph';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Creator';
        role.id   = 'cre';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Corrector';
        role.id   = 'crr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Contributor';
        role.id   = 'ctb';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Cartographer';
        role.id   = 'ctg';
        $scope.roles.push(role);
	
        role = {};
        role.label = 'Commentator for written text';
        role.id   = 'cwt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Designer';
        role.id   = 'dsr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Dedicatee';
        role.id   = 'dte';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Data contributor';
        role.id    = 'dtc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Dubious author';
        role.id    = 'dub';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Editor';
        role.id    = 'edt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Engraver';
        role.id   = 'egr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Forger';
        role.id   = 'frg';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Geographic information specialist';
        role.id   = 'gis';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Graphic technician';
        role.id   = 'grt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Lyricist';
        role.id   = 'lyr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Lithographer';
        role.id   = 'lgt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Metadata contact';
        role.id   = 'mdc';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Medium';
        role.id   = 'med';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Manufacture place';
        role.id   = 'mfp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Manufacturer';
        role.id   = 'mfr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Markup editor';
        role.id   = 'mrk';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Opponent';
        role.id   = 'opn';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Owner';
        role.id   = 'own';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Publishing director';
        role.id   = 'pbd';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Proofreader';
        role.id   = 'pfr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Photographer';
        role.id   = 'pht';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Papermaker';
        role.id   = 'ppm';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Programmer';
        role.id   = 'prg';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Printmaker';
        role.id   = 'prm';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Printer';
        role.id   = 'prt';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Patent applicant';
        role.id   = 'pta';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Patent holder';
        role.id   = 'pth';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Publication place';
        role.id   = 'pup';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Rubricator';
        role.id   = 'rbr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Redaktor';
        role.id   = 'red';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Researcher';
        role.id   = 'res';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Reviewer';
        role.id   = 'rev';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Repository';
        role.id   = 'rps';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Restorationist';
        role.id   = 'rsr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Scientific advisor';
        role.id   = 'sad';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Scribe';
        role.id   = 'scr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Seller';
        role.id   = 'sll';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Surveyor';
        role.id   = 'srv';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Translator'
        role.id   = 'trl';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Typographer';
        role.id   = 'tyg';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'University place';
        role.id   = 'uvp';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Writer of added commentary';
        role.id   = 'wac';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Writer of accompanying material';
        role.id   = 'wam';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Writer of added text';
        role.id   = 'wat';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Writer of introduction';
        role.id   = 'win';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Writer of preface';
        role.id   = 'wpr';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Writer of supplementary textual content';
        role.id   = 'wat';
        $scope.roles.push(role);
	
	role = {};
        role.label = 'Other';
        role.id   = 'oth';
        $scope.roles.push(role);
      
    }
 } 
  
});

var LoadFromTemplateModalCtrl = function ($scope, $modalInstance, MetadataService, SubmitService) {
     
     
  
    $scope.templates = [];
    
     
     
     $scope.getAllTemplates = function() {
          
          var promise = MetadataService.getAllTemplates();
          $scope.loadingTracker.addPromise(promise);
          promise.then(
                function(response) { 
                       $scope.alerts = response.data.alerts;
                       $scope.templates = response.data.templates;
                       $scope.form_disabled = false;
                }
               ,function(response) {
                       $scope.alerts = response.data.alerts;
                       $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                       $scope.form_disabled = false;
               }
         );
    };   
       
    $scope.getAllTemplates();
    
    $scope.loadDataFromTemplate = function (tid) {
             var promise = MetadataService.loadTemplate(tid);
             $scope.loadingTracker.addPromise(promise);
             promise.then(
                    function(response) { 
                           $scope.alerts = response.data.alerts;
                           if(typeof response.data.mods !== 'undefined' ){
                                   SubmitService.submit_metadata = 'mods';
                                   SubmitService.submit_language = SubmitService.getLanguageMods(response.data.mods);
                                   SubmitService.submit_title = SubmitService.getTitleMods(response.data.mods);
                                   SubmitService.submit_description = SubmitService.getDescriptionMods(response.data.mods);
                                   SubmitService.submit_licence = SubmitService.getLicenceMods(response.data.mods);
                                   SubmitService.submit_selectedRoles = SubmitService.getRolesMods(response.data.mods);
                           }
                           if(typeof response.data.uwmetadata !== 'undefined' ){
                                   SubmitService.submit_metadata = 'uwmetadata';
                                   SubmitService.submit_title = SubmitService.getTitleUwmeta(response.data.uwmetadata);
                                   SubmitService.submit_description = SubmitService.getDescriptionUwmeta(response.data.uwmetadata);
                                   SubmitService.submit_language = SubmitService.getLanguageUwmeta(response.data.uwmetadata);
                                   SubmitService.submit_licence = SubmitService.getLicenceUwmeta(response.data.uwmetadata);
                                   SubmitService.submit_selectedRoles = SubmitService.getRolesUwmeta(response.data.uwmetadata);
                           }
                           $scope.form_disabled = false;
                   }
                  ,function(response) {
                           $scope.alerts = response.data.alerts;
                           $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                           $scope.form_disabled = false;
                   }
             );
      }

      /*
      $scope.getTitleMods = function (mods) {
      
            var title = "";
            for (i = 0; i < mods.length; ++i) {
                  if(mods[i].xmlname == "titleInfo"){
                        if(mods[i].children){
                               for (j = 0; j < mods[i].children.length; ++j) {
                                      if(mods[i].children[j].xmlname == "title"){
                                            title = mods[i].children[j].ui_value; 
                                      }     
                               }
                        }
                  }   
            }
            return title; 
      }
      
      $scope.getLanguageMods = function (mods) {
      
            var language = "";
            for (i = 0; i < mods.length; ++i) {
                  if(mods[i].xmlname == "language"){
                        if(mods[i].children){
                               for (j = 0; j < mods[i].children.length; ++j) {
                                      if(mods[i].children[j].xmlname == "languageTerm"){
                                            language = mods[i].children[j].ui_value; 
                                      }     
                               }
                        }
                  }   
            }
            return language; 
      }
      
      
      $scope.getDescriptionMods = function (mods) {
      
            var description = "";
            for (i = 0; i < mods.length; ++i) {
                  if(mods[i].xmlname == "note"){
                        description = mods[i].ui_value;   
                  }   
            }
            return description; 
      }
      
      $scope.getLicenceMods = function (mods) {
      
            var licence = "";
            for (i = 0; i < mods.length; ++i) {
                  if(mods[i].xmlname == "accessCondition"){
                        licence = mods[i].ui_value;   
                  }   
            }
            return licence; 
      }
      
      $scope.getRolesMods = function (mods) {
            var selectedRoles =  [];
            var namePart = '';
            var roleTerm = '';
            for (i = 0; i < mods.length; ++i) {
                  if(mods[i].xmlname == "name"){
                          if(mods[i].children){
                               namePart = '';
                               roleTerm = '';
                               for (j = 0; j < mods[i].children.length; ++j) {
                                      if(mods[i].children[j].xmlname == "namePart"){
                                              namePart = mods[i].children[j].ui_value; 
                                      } 
                                      if(mods[i].children[j].xmlname == "role"){
                                             if(mods[i].children[j].children){
                                                     for (k = 0; k < mods[i].children[j].children.length; ++k) {
                                                             if(mods[i].children[j].children[k].xmlname == "roleTerm"){
                                                                     roleTerm = mods[i].children[j].children[k].ui_value;
                                                             }
                                                     }  
                                             }
                                      }
                               }
                               if(roleTerm != '' && namePart != ''){
                                       var newRole = {};
                                       newRole.URI = roleTerm;
                                       var namePartsArray = namePart.split(",");
                                       newRole.firstname = namePartsArray[0];
                                       newRole.lastname = namePartsArray[1].trim();
                                       selectedRoles.push(newRole);
                               }
                        }
                  }   
            }
            return selectedRoles; 
      } 
      
      $scope.getTitleUwmeta = function (uwmeta) {
            
            var title = "";
            for (i = 0; i < uwmeta.length; ++i) {
                  if(uwmeta[i].xmlname == "general"){
                        if(uwmeta[i].children){
                               for (j = 0; j < uwmeta[i].children.length; ++j) {
                                      if(uwmeta[i].children[j].xmlname == "title"){
                                            title = uwmeta[i].children[j].ui_value; 
                                      }     
                               }
                        }
                  }   
            }
            return title;       
      }
      
      $scope.getDescriptionUwmeta = function (uwmeta) {
            
            var description = "";
            for (i = 0; i < uwmeta.length; ++i) {
                  if(uwmeta[i].xmlname == "general"){
                        if(uwmeta[i].children){
                               for (j = 0; j < uwmeta[i].children.length; ++j) {
                                      if(uwmeta[i].children[j].xmlname == "description"){
                                            description = uwmeta[i].children[j].ui_value; 
                                      }     
                               }
                        }
                  }   
            }
            return description;       
      }
      
      $scope.getLanguageUwmeta = function (uwmeta) {
            
            var language = "";
            for (i = 0; i < uwmeta.length; ++i) {
                  if(uwmeta[i].xmlname == "general"){
                        if(uwmeta[i].children){
                               for (j = 0; j < uwmeta[i].children.length; ++j) {
                                      if(uwmeta[i].children[j].xmlname == "language"){
                                            language = uwmeta[i].children[j].ui_value; 
                                      }     
                               }
                        }
                  }   
            }
            return language;       
      }
      
      $scope.getLicenceUwmeta = function (uwmeta) {
            
            var license = "";
            for (i = 0; i < uwmeta.length; ++i) {
                  if(uwmeta[i].xmlname == "rights"){
                        if(uwmeta[i].children){
                               for (j = 0; j < uwmeta[i].children.length; ++j) {
                                      if(uwmeta[i].children[j].xmlname == "license"){
                                            license = uwmeta[i].children[j].ui_value; 
                                      }     
                               }
                        }
                  }   
            }
            return license;       
      }
      
      $scope.getRolesUwmeta = function (uwmeta) {
            var selectedRoles =  [];
            var firstname = '';
            var lastname = '';
            var roleTerm = '';
            for (i = 0; i < uwmeta.length; ++i) {
                  if(uwmeta[i].xmlname == "lifecycle"){
                          if(uwmeta[i].children){
                                 for (j = 0; j < uwmeta[i].children.length; ++j) {
                                       if(uwmeta[i].children[j].xmlname == "contribute"){
                                               firstname = '';
                                               lastname = '';
                                               roleTerm = ''; 
                                               if(uwmeta[i].children[j].children){
                                                      for (k = 0; k < uwmeta[i].children[j].children.length; ++k) {  
                                                             if(uwmeta[i].children[j].children[k].xmlname == "entity"){
                                                                    if(uwmeta[i].children[j].children[k].children){
                                                                          for (l = 0; l < uwmeta[i].children[j].children[k].children.length; ++l) {
                                                                                  if(uwmeta[i].children[j].children[k].children[l].xmlname == "firstname"){
                                                                                        firstname = uwmeta[i].children[j].children[k].children[l].ui_value;
                                                                                  }
                                                                                  if(uwmeta[i].children[j].children[k].children[l].xmlname == "lastname"){
                                                                                        lastname = uwmeta[i].children[j].children[k].children[l].ui_value;
                                                                                  }
                                                                          }
                                                                    } 
                                                             }
                                                             if(uwmeta[i].children[j].children[k].xmlname == "role"){
                                                                    roleTerm = uwmeta[i].children[j].children[k].ui_value;
                                                             }
                                                      } 
                                               }
                                               if(roleTerm != '' && lastname != '' && firstname != ''){
                                                     var newRole = {};
                                                     newRole.URI = roleTerm;
                                                     newRole.firstname = firstname;
                                                     newRole.lastname = lastname;
                                                     selectedRoles.push(newRole);
                                              }
                                       } 
                                 }
                        }
                  }   
            }
            return selectedRoles; 
      } 
      */
      
      $scope.OK = function () {
            $scope.loadDataFromTemplate($scope.templates.selected._id);
            $modalInstance.dismiss('OK');
      };
   
       $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
       };
   
       $scope.hitEnter = function(evt){
           if(angular.equals(evt.keyCode,13)){
                  $scope.loadDataFromTemplate($scope.templates.selected._id);
                  $modalInstance.dismiss('OK');
           }
       };
    
}