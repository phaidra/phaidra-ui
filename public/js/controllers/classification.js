app.controller('ClassificationCtrl', function($scope, $modal, $location, $timeout, DirectoryService, FrontendService, VocabularyService, MetadataService, promiseTracker) {

	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');

	$scope.alerts = [];

	$scope.initdata = '';
	$scope.current_user = '';

	$scope.clsns = 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification';

        $scope.lastSelectedTaxons = {};

        $scope.selectedmyclass = {};

        $scope.myclasses = [];

        $scope.searchclasses = [];
        $scope.class_search = {query: ''};

        $scope.class_roots = [];
        $scope.class_roots_all = [];
        
        $scope.mods_classes = [];
        $scope.uwmeta_classes = [];
        
  
        
	$scope.init = function (initdata) {
		
                $scope.edit_mode = $scope.$parent.edit_mode; //edit_mods/edit_uwmeta
		$scope.mode = $scope.$parent.mode;  //template/object
		
		$scope.initdata = angular.fromJson(initdata);
		$scope.current_user = $scope.initdata.current_user;
		$scope.getClassificationsList(); //list of classification that we support(Uni Vienna)(in drop down menu of classif.)
		$scope.getMyClassifications();  //project.settings in mongoDb,favorite classification of the user
                
                console.log('edit_mode:',$scope.edit_mode,'mode:',$scope.mode);
		console.log('classificationInit:',$scope.initdata);
		
        };

        //get labels for clasifications and also add this into mods_classes  array (temporary array of classif. for mods only)
        $scope.getModsClassifiLabels = function() {
                 
                 var mods = angular.toJson($scope.$parent.fields);
      		 var promise = MetadataService.getModsClassifiLabes(mods);
                 $scope.loadingTracker.addPromise(promise);
                 promise.then(
    		        function(response) {
			      $scope.form_disabled = false;
	                      $scope.mods_classes = [];
	                      for (var i = 0; i < response.data.classifications.length; ++i) {
	        	            $scope.mods_classes.push(response.data.classifications[i]);
	                      }
	                      $scope.alerts = response.data.alerts;
			}
    		        ,function(response) {
           		       $scope.alerts = response.data.alerts;
           		       if(typeof  $scope.alerts !== 'undefined'){
			           $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
			       }
           	        }
                );
        }
    

        // list of classification that we support(Uni Vienna)
        $scope.getClassificationsList = function() {

            $scope.form_disabled = true;
            var promise = VocabularyService.getClassifications();
	    $scope.loadingTracker.addPromise(promise);
	    promise.then(
	      	function(response) {
	      		$scope.alerts = response.data.alerts;
			$scope.class_roots_all = [];
	      		// filter and order
	      		$scope.class_roots = [];
                        for (var i = 0; i < response.data.terms.length; ++i) {
				var term = response.data.terms[i];
				term.current_path = [];
				//TODO add 'included_classifications' on init -> classifi. that are defined in project.settings MongoDB collection.
                                // project can be limited there to this set of classification.
                                // init in uwmetadataeditor js-controler & modseditor js-controler
                                if($scope.initdata['included_classifications']){
					for (var j = 0; j < $scope.initdata.included_classifications.length; ++j) {
						if($scope.initdata.included_classifications[j] == response.data.terms[i].uri){
							$scope.class_roots.push(term);
						}
					}
				}else{
					$scope.class_roots.push(term);
				}
				$scope.class_roots_all.push(term);
                                
	      		}
	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		if(typeof $scope.alerts !== 'undefined'){
			    $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
			}
	      		$scope.form_disabled = false;
	      	}
	    );
        };
        
        //favorite classification (collection user.classifications)
        $scope.getMyClassifications = function() {
           
             $scope.form_disabled = true;
             var promise = MetadataService.getClassifications();
             $scope.loadingTracker.addPromise(promise);
             promise.then(
                function(response) {
                        $scope.alerts = response.data.alerts;
                        //favorite classification
                        $scope.myclasses = response.data.classifications;
                        $scope.form_disabled = false;
                }
                ,function(response) {
                        $scope.alerts = response.data.alerts;
                        $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                        $scope.form_disabled = false;
                }
             );
         };
    
	 $scope.browse_class_opened = function(classif){

		 if(classif.current_path.length == 0){
	             // init the classification
	             classif.current_path = [];
		     var promise = VocabularyService.getChildren(classif.uri);
		     $scope.loadingTracker.addPromise(promise);
		     promise.then(
		      	function(response) {
		      		$scope.alerts = response.data.alerts;
		      		classif.current_path.push({terms: response.data.terms});
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

	 $scope.update_current_path = function(item, model, classif, index){

		 if(classif.current_path.length > 1){
		 	 classif.current_path.splice(index+1, classif.current_path.length-index);
		 }

		var promise = VocabularyService.getChildren(model.uri);
		$scope.loadingTracker.addPromise(promise);
		promise.then(
		  	function(response) {
		  		$scope.alerts = response.data.alerts;
		  		if(response.data.terms.length > 0){
		  			classif.current_path.push({terms: response.data.terms});
		  		}
		  		$scope.lastSelectedTaxons[classif.uri] = $scope.findLastSelectedTaxon(classif);
                                $scope.form_disabled = false;
		  	}
		  	,function(response) {
			        $scope.alerts = response.data.alerts;
		  		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
		   		$scope.form_disabled = false;
		   	}
		);
	 };

	 // supersafe (and superstupid)
	 $scope.findLastSelectedTaxon = function(classif){
		 var last = classif.current_path[classif.current_path.length-1];
		 if(typeof last === 'undefined'){
			 return {};
		 }else{
			 if(typeof last.selected === 'undefined'){
				var onebefore = classif.current_path[classif.current_path.length-2];
				if(typeof onebefore === 'undefined'){
					return {};
				}else{
					return typeof onebefore.selected === 'undefined' ? {} : onebefore.selected;
				}
			 }else{
				 return last.selected;
			 }
		}
	 };

	 $scope.removeClassFromObject = function(index){
		 if($scope.edit_mode == 'edit_mods'){
			 var uri = $scope.mods_classes[index].uri;
			 var node2remove_idx = -1;
			 for (var i = 0; i < $scope.$parent.fields.length; ++i) {			 
				 if($scope.$parent.fields[i].xmlname == 'classification'){
					 var cls = $scope.$parent.fields[i]; 
					 var authuri;
					 var valueuri;
					 for (var j = 0; j < cls.attributes.length; ++j) {
						 if(cls.attributes[j].xmlname == 'authorityURI'){
							 authuri = cls.attributes[j].ui_value; 
						 }
						 if(cls.attributes[j].xmlname == 'valueURI'){
							 valueuri = cls.attributes[j].ui_value; 
						 }
					 }
					 if(authuri == $scope.clsns && valueuri == uri){	 
					   node2remove_idx = i;
						 break;
					 }
				 }
			 }
			 if(node2remove_idx >= 0){
				 $scope.$parent.fields.splice(node2remove_idx, 1);
			 } 
			 $scope.getModsClassifiLabels(); 

			 return;
		 }
		 
		 if($scope.edit_mode == 'edit_uwmeta'){
		         $scope.selectUwmetaClassificationNode().children.splice(index,1);
		 }
	 };
                  
	 $scope.toggleClassification = function(uri){
		 if(typeof uri == 'undefined'){
			 return;
		 }

		 if($scope.selectedmyclass.selected){
			 if($scope.selectedmyclass.selected.uri == uri){
				 $scope.selectedmyclass = {};
			 }
		 }

		 $scope.form_disabled = true;
	         var promise = MetadataService.toggleClassification(uri);
	         $scope.loadingTracker.addPromise(promise);
	         promise.then(
	      	     function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.getMyClassifications();
	      		$scope.form_disabled = false;
	      	    }
	      	   ,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	   }
	     );
	 };

	 $scope.selectLastModsClassNodeIdx = function(){
		 
		 var last_idx = 0;
		 for (var i = 0; i < $scope.$parent.fields.length; ++i) {			 
			 if($scope.$parent.fields[i].xmlname == 'classification'){
				 last_idx = i;
			 }else{
				 if(last_idx > 0){
					return last_idx;
				 }
			 }
		 }
		 return last_idx;
	 }

	$scope.$on('getClassifLabelsMods', function(e) {  
                      $scope.getModsClassifiLabels();
        });   
	 
        $scope.$on('classifLoadMods', function(e) {  
                $scope.addClassifOnLoadMods();
        });
	 
        $scope.addClassifOnLoadMods = function(){
                for (var i = 0; i < $scope.$parent.loadedClassification.length; ++i) {
                        for (var j = 0; j < $scope.$parent.loadedClassification[i].attributes.length; ++j) {
                                if($scope.$parent.loadedClassification[i].attributes[j].xmlname == 'valueURI'){
                                      var uri = $scope.$parent.loadedClassification[i].attributes[j].ui_value;
                                      if(!$scope.classifAlreadyAdded(uri)){
                                              $scope.addClassToObjectFromTaxon(uri);
                                      }
                                }
                        }
                }
                return;
        }
        
        $scope.classifAlreadyAdded = function(uri){
               
                for (var i = 0; i < $scope.$parent.fields.length; ++i) {
                        if($scope.$parent.fields[i].xmlname == 'classification'){
                                for (var j = 0; j < $scope.$parent.fields[i].attributes.length; ++j) {
                                       if($scope.$parent.fields[i].attributes[j].xmlname == 'valueURI'){
                                                if($scope.$parent.fields[i].attributes[j].ui_value == uri){
                                                        return true;      
                                                }
                                       }
                                }
                        }
                }
                return false;
        }
        
        $scope.addClassToObject = function(classif){
	        
                $scope.addClassToObjectFromTaxon($scope.lastSelectedTaxons[classif.uri].uri);
	        if($scope.edit_mode == 'edit_mods'){
                        $scope.getModsClassifiLabels();
	        } 

	        return;
	}
	 	 
	 $scope.addClassToObjectFromTaxon = function(uri){
		 if($scope.edit_mode == 'edit_mods'){
		         var idx = $scope.selectLastModsClassNodeIdx();		 
			 var newnode = {
		            "xmlname":"classification",
		            "input_type":"input_text",
		            "label":"Classification",
		            "attributes":[
		                {
		                    "xmlname":"lang",
		                    "input_type":"input_text",
		                    "label":"Language"
		                },
		                {
		                    "xmlname":"script",
		                    "input_type":"input_text",
		                    "label":"Script"
		                },
		                {
		                    "xmlname":"transliteration",
		                    "input_type":"input_text",
		                    "label":"Transliteration"
		                },
		                {
		                    "xmlname":"authority",
		                    "input_type":"select",
		                    "label":"Authority"
		                },
		                {
		                    "xmlname":"authorityURI",
		                    "input_type":"input_text",
		                    "label":"Authority URI",
				    "ui_value":  $scope.clsns
				   
		                },
		                {
		                    "xmlname":"valueURI",
		                    "input_type":"input_text",
		                    "label":"Value URI",
		                    "ui_value": uri
		                },
		                {
		                    "xmlname":"edition",
		                    "input_type":"input_text",
		                    "label":"Edition"
		                },
		                {
		                    "xmlname":"displayLabel",
		                    "input_type":"input_text",
		                    "label":"Display label"
		                },
		                {
		                    "xmlname":"usage",
		                    "input_type":"select",
		                    "label":"Usage"
		                },
		                {
		                    "xmlname":"generator",
		                    "input_type":"input_text",
		                    "label":"Generator"
		                }
		            ]
		     }; 			 
				 
			 $scope.$parent.fields.splice(idx+1,0,newnode);
			 
			 return;
		 }
		 
		 if($scope.edit_mode == 'edit_uwmeta'){
		     
		     $scope.form_disabled = true;
		     var promise = VocabularyService.getTaxonPath(uri);
		     $scope.loadingTracker.addPromise(promise);
		     promise.then(
		      	function(response) {
		      		$scope.alerts = response.data.alerts;
	
		      		var taxonpath = {
		      			 xmlns: $scope.clsns,
				   	     xmlname: "taxonpath",
				   	     datatype: "Node",
				   	     children: [
				           {
				   	             xmlns: $scope.clsns,
				   	             xmlname: "source",
				   	             datatype: "ClassificationSource",
				   	             ui_value: response.data.taxonpath[0].uri,
				   	             value_labels: response.data.taxonpath[0].labels
				   	       }
				   	    ]
				   	};
	
		      		for (var i = 1; i < response.data.taxonpath.length; ++i) {
	
		      			 var taxondata = response.data.taxonpath[i];
	
		      			 var t = {
						     xmlns: $scope.clsns,
						     xmlname: "taxon",
						     datatype: "Taxon",
						     ordered: 1,
		      				     data_order: i-1,
						 	 ui_value: taxondata.uri,
						 	 value_labels: {
							 	labels: taxondata.labels,
							 	upstream_identifier: taxondata.upstream_identifier,
							 	term_id: taxondata.term_id
							 }
	
						 };
	
		      			         // copy nonpreferred array
						 if(typeof taxondata.nonpreferred != 'undefined'){
							 if(taxondata.nonpreferred.length > 0){
								 t.value_labels['nonpreferred'] = [];
								 for (var j = 0; j < taxondata.nonpreferred.length; ++j) {
									 t.value_labels['nonpreferred'].push(taxondata.nonpreferred[j]);
								 }
							 }
						 }
	
						 taxonpath.children.push(t);
		      		}
	
		      		var ch = $scope.selectUwmetaClassificationNode().children;
				// -2 because the last two are not taxonpaths but description and keywords
				ch.splice(ch.length-2,0,taxonpath);
	
		      		$scope.form_disabled = false;
		      	}
		      	,function(response) {
		      		$scope.alerts = response.data.alerts;
		      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
		      		$scope.form_disabled = false;
		      	}
		     );
		 }
		
	 };
	 
	 
	 
	 
	 
	 $scope.getFields = function() {
		 return $scope.$parent.fields;
	 }



	 $scope.hitEnterSearch = function(evt){
    	        if(angular.equals(evt.keyCode, 13) && !(angular.equals($scope.class_search.query, null) || angular.equals($scope.class_search.query, ''))){
    		       $scope.search($scope.class_search.query);
    	        }
         };

	 $scope.search = function(query) {
		 $scope.form_disabled = true;
	         var promise = VocabularyService.searchClassifications(query);
	         $scope.loadingTracker.addPromise(promise);
	         promise.then(
	      	 function(response) {
	      		$scope.alerts = response.data.alerts;

	      		// filter and order
	      		$scope.searchclasses = [];
	      		for (var i = 0; i < response.data.terms.length; ++i) {
	      			var term = response.data.terms[i];
					term.current_path = [];
	      			/*
	      			var pos = $scope.classes_config[response.data.terms[i].uri];	      			
	      			if(pos > 0){
	      				// pos goes from 1
	      				$scope.searchclasses[pos-1] = response.data.terms[i];
	      				$scope.searchclasses[pos-1].terms = response.data.terms[i].terms;
		      			// init current_path array
	      				$scope.searchclasses[pos-1].current_path = [];
	      			}
	      			*/
	      			// TODO included_classifications: read this value from mongoDb settings collection on init
                                if($scope.initdata['included_classifications']){
						for (var j = 0; j < $scope.initdata.included_classifications.length; ++j) {
							if($scope.initdata.included_classifications[j] == response.data.terms[i].uri){
								$scope.searchclasses.push(term);
							}
						}
				}else{
					$scope.searchclasses.push(term);
				}

	      		}

	      		$scope.form_disabled = false;
	      	}
	      	,function(response) {
	      		$scope.alerts = response.data.alerts;
	      		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
	      		$scope.form_disabled = false;
	      	}
	     );
	 };

        
	 $scope.selectUwmetaClassificationNode = function() {
	        return $scope.$parent.fields[6];
	 }

	 $scope.isMyClass = function(uri) {
		 for (var i = 0; i < $scope.myclasses.length; ++i) {
		         if($scope.myclasses[i].uri == uri){
			        return true;
			 }
		 }
		 return false;
	 }


});
