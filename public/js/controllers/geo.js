app.controller('GeoCtrl', function($scope, $rootScope, $modal, $location, $timeout, MetadataService, promiseTracker, uiGmapGoogleMapApi) {


	// we will use this to track running ajax requests to show spinner
	//$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
        $scope.loadingTracker = $rootScope.loadingTracker;
	$scope.alerts = [];
	$scope.initdata = '';
	$scope.current_user = '';
	$scope.form_disabled = false;
	$scope.tid = '';
	$scope.placemarks = [];

	var placemark_options = { draggable: true, labelContent: '' };

 	$scope.closeAlert = function(index) {
    	       $scope.alerts.splice(index, 1);
        };
	
	$scope.initgeo = function (initdata) {
        
             $scope.mode = $scope.$parent.mode;   // object/template
             if(typeof $scope.mode == 'undefined'){
                  $scope.mode = 'object';
             }
             //if($scope.mode == 'template'){
             //     $scope.getGeoTemplate();
             //}
             if($scope.mode == 'object'){
                  $scope.getGeoObject();
             }        
             $scope.initdata = angular.fromJson(initdata);
             console.log('geo init',  $scope.initdata);
             $scope.current_user = $scope.initdata.current_user;
             $scope.pid = $scope.initdata.pid;
        };
         
        $scope.getMarkerOptions = function (placemark){

		var lat = parseFloat(placemark.point.coordinates.latitude).toFixed(5);
		var lng = parseFloat(placemark.point.coordinates.longitude).toFixed(5);
		placemark_options.labelContent = placemark.name + ' (' + lat + ', ' + lng + ')';
                
		return placemark_options;
	}

	$scope.marker_events = {
                 dragend: function (marker, eventName, args) {
                                 $scope.placemarks[marker.key].point.coordinates.latitude = marker.getPosition().lat();
                                 $scope.placemarks[marker.key].point.coordinates.longitude = marker.getPosition().lng();
                                 marker.options = {
                                           draggable: true,
                                           labelContent: marker.getPosition().lat() + ', ' + marker.getPosition().lng(),
                                 };
                          }
        };


     // uiGmapGoogleMapApi is a promise.
     // The "then" callback function provides the google.maps object.
     uiGmapGoogleMapApi.then(function(maps) {
    	
            $scope.maps = maps;
      
            if($scope.mode == 'object'){
	           $scope.getGeoObject();
            }
            //if($scope.mode == 'template'){
            //    $scope.getGeoTemplate();
            //}
    });

    $scope.addPoint = function (){
	        var lat = 48.2;
		var lng = 16.3667;
		var id = $scope.placemarks.length > 0 ? $scope.placemarks.length+1 : 0;
		var pl =  {
		    id: id,
		    name: '',
		    description: '',
			point: {
				coordinates: {
					latitude: lat,
					longitude: lng
				}
			},
			map: {
				center: { latitude: lat, longitude: lng },
				zoom: 8
			}

		};
		$scope.placemarks.push(pl);
	}

	$scope.addBoundingbox = function (){
		var bb = {
			polygon: {
				outerboundaryis: {
						linearring: {
				    	coordinates: [
			  				 {
			  					 latitude: '',
			  					 longitude: ''
			  				 },
			   	  			 {
			  					 latitude: '',
			  					 longitude: ''
			  				 },
			  				 {
			  					 latitude: '',
			  					 longitude: ''
			  				 },
			  				 {
			  					 latitude: '',
			  					 longitude: ''
			  				 }
			  			]
					}
				}
			}
		}
		$scope.placemarks.push(bb);
	}

    $scope.refreshMaps = function() { 
        $timeout(function(){
	     for (i = 0; i < $scope.placemarks.length; ++i) {
			var p = $scope.placemarks[i];
		        if(typeof p.map !== 'undefined'){
			     if(typeof p.point !== 'undefined'){
			           p.map.refresh(p.point.coordinates);
	                     }
			}
	     }
	 }, 2000);
    }

    $scope.$parent.$watch('geoTabActivated', function(newValue, oldValue) {
    	if(newValue){
	      //google maps refresh
	      $scope.refreshMaps();
    	}
    });
    

    $scope.getGeoObject = function() {
            var promise = MetadataService.getGeoObject($scope.pid);
            $scope.loadingTracker.addPromise(promise);
            promise.then(
    		function(response) {
    			if(response.data.alerts){
    				$scope.alerts = response.data.alerts;
    			}
			if(response.data.metadata){
			     if(response.data.metadata.geo){
			          $scope.placemarks = response.data.metadata.geo.kml.document.placemark;
				  for (i = 0; i < $scope.placemarks.length; ++i) {
				       if(typeof $scope.placemarks[i].map === 'undefined'){
	    				    $scope.placemarks[i].id = i;
					    if(!$scope.placemarks[i]['map']){
		    				if($scope.placemarks[i].point){
						     $scope.placemarks[i]['map'] = {
		    					center: { latitude: $scope.placemarks[i].point.coordinates.latitude, longitude: $scope.placemarks[i].point.coordinates.longitude },
		    					zoom: 8
		    				    }
						}
	    				    }
					}
	    			  }
	    		       
	    		
			     }
			  }  
    		}
    		,function(response) {
    			if(response.data.alerts){
    				$scope.alerts = response.data.alerts;
           		}
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	   );

    }

        $scope.saveGeoObject = function() {
              
	      $scope.form_disabled = true;
	
	      var geo = {
    		    metadata:{
		           geo:{
			         kml: {
    			             document: {
    				          placemark: $scope.placemarks
    			             }
    	                        }  
		         }
	           }
    	      };
	      var promise = MetadataService.saveGeoObject($scope.pid, geo)
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
    
    /*
   $scope.getGeoTemplate = function() {

         $scope.tid = $scope.$parent.tid;
         $scope.form_disabled = true;
         var promise = MetadataService.loadTemplate($scope.tid);
         $scope.loadingTracker.addPromise(promise);
         promise.then(
                function(response) {
                     $scope.alerts = response.data.alerts;
                     $scope.form_disabled = false;
                     $scope.geo = response.data.geo;
                     if( typeof $scope.geo.kml.document.placemark !== 'undefined' ){
                           if(typeof $scope.geo.kml.document.placemark[0] !== 'undefined'){
                                $scope.placemarks = $scope.geo.kml.document.placemark;
                           }
                     }
              }
             ,function(response) {
                   $scope.alerts = response.data.alerts;
                   $scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
                   $scope.form_disabled = false;
             }
        );
 };
 */       
        
        
});
