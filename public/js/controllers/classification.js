app.controller('ClassificationCtrl', function($scope, $modal, $location, $timeout, DirectoryService, FrontendService, VocabularyService, MetadataService, promiseTracker) {

	// we will use this to track running ajax requests to show spinner
	$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');

	$scope.alerts = [];

	$scope.initdata = '';
	$scope.current_user = '';

	
	$scope.init = function (initdata) {
	//$scope.init = function (initdata, mode) {
		//$scope.mode = mode;
		$scope.mode = $scope.$parent.edit_mode;
		console.log('parent.mode',$scope.$parent.edit_mode);
		$scope.initdata = angular.fromJson(initdata);
		$scope.current_user = $scope.initdata.current_user;
		$scope.getClassifications();
		//$scope.getMyClassifications();  project.settings and user.classifications in mongoDb, delete it?
		if($scope.mode == 'edit_mods'){
		    $timeout( function(){ $scope.getModsClassifications(); }, 1000); // $scope.$parent.fields is otherwise empty on intialization
		    console.log('edit_modsxxxxxxxxxxxx');
		}
		console.log('selectBagClassificationNode:',$scope.selectBagClassificationNode());
		
    };
    
    
    
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
    //mf
    /*
    $scope.getUwmetaClassifications = function() {
                 console.log('uwmeta21:', $scope.$parent.fields);
                var uwmeta = angular.toJson($scope.$parent.fields);
      		 var promise = MetadataService.getUwmetaClassifications(uwmeta);
                 $scope.loadingTracker.addPromise(promise);
                 promise.then(
    		        function(response) {
	                      console.log('getUwmetaClassifications22:', response.data);
			       $scope.form_disabled = false;
	                      $scope.uwmeta_classes = [];
	                      for (var i = 0; i < response.data.classifications.length; ++i) {
	        	            $scope.uwmeta_classes.push(response.data.classifications[i]);
	                      }
	                      //console.log('uwmeta_classes',$scope.uwmeta_classes);
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
    */
    //mf
    $scope.getModsClassifications = function() {
                 console.log('mods21:', $scope.$parent.fields);
                 var mods = angular.toJson($scope.$parent.fields);
		 //console.log('mods22:', mods);
      		 var promise = MetadataService.getModsClassifications(mods);
                 $scope.loadingTracker.addPromise(promise);
                 promise.then(
    		        function(response) {
	                      console.log('getModsClassifications22:', response.data);
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
    

    $scope.getClassifications = function() {
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
                        console.log('class_roots:',$scope.class_roots);
			console.log('class_roots_all:',$scope.class_roots_all);
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
		  		console.log('response',response);
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
		 
		 if($scope.mode == 'edit_mods'){
		         console.log('removeClassFromObject mods');
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
					 //if(authuri == 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification' && valueuri == uri){
					 if(authuri == $scope.clsns && valueuri == uri){	 
					   node2remove_idx = i;
						 break;
					 }
				 }
			 }
			 if(node2remove_idx >= 0){
				 $scope.$parent.fields.splice(node2remove_idx, 1);
			 }
			 $scope.save(); //todo !
			 if($scope.mode == 'edit_mods'){
			          $scope.getModsClassifications(); 
			 }
			 return
		 }
		 
		 if($scope.mode == 'edit_uwmeta '){
			 $scope.selectBagClassificationNode().children.splice(index,1);
			 $scope.save();
		 }
	 };

	 $scope.save = function(){
		 ////$scope.$parent.save();
		 // make a differance between saving of objects and templates
		 
		 //$scope.$parent.saveTemplate();
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
	     var promise = FrontendService.toggleClassification(uri);
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

        $scope.addClassToObject = function(classif){
	       $scope.addClassToObjectFromTaxon($scope.lastSelectedTaxons[classif.uri].uri);
	       if($scope.mode == 'edit_mods'){
	              $scope.getModsClassifications();
	       }
	       console.log('mods_classes: ',$scope.mods_classes);
	       return;
	}
	 	 
	 $scope.addClassToObjectFromTaxon = function(uri){
		 console.log('mode22',$scope.mode);
		 if($scope.mode == 'edit_mods'){
			 console.log('mode',$scope.mode);
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
		                    //"ui_value": 'http://phaidra.univie.ac.at/XML/metadata/lom/V1.0/classification'
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
			 
			 //$scope.save(); //TODO
			
			 if($scope.mode == 'edit_mods'){
			         $scope.getModsClassifications();
			 }
			 console.log(' parent.fields:', $scope.$parent.fields);
			 return;
		 }
		 
		 
		 if($scope.mode == 'edit_uwmeta'){
		     
		     console.log('mode22',$scope.mode);
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
	
		      		var ch = $scope.selectBagClassificationNode().children;
					// -2 because the last two are not taxonpaths but description and keywords
					ch.splice(ch.length-2,0,taxonpath);
					$scope.save(); //TODO
	
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

	 $scope.getMyClassifications = function() {
	     $scope.form_disabled = true;
	     var promise = FrontendService.getClassifications();
	     $scope.loadingTracker.addPromise(promise);
	     promise.then(
	      	function(response) {
	      		$scope.alerts = response.data.alerts;
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


	 $scope.selectBagClassificationNode = function() {
		//console.log('selectBagClassificationNode', $scope.$parent.fields[6]); 
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
