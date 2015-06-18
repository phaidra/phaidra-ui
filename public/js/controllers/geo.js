app.controller('GeoCtrl', function($scope, $rootScope, $modal, $location, $timeout, MetadataService, promiseTracker, uiGmapGoogleMapApi) {


	// we will use this to track running ajax requests to show spinner
	//$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
        $scope.loadingTracker = $rootScope.loadingTracker;
	
	$scope.alerts = [];

	$scope.initdata = '';
	$scope.current_user = '';
	//delete it
	$scope.bagid = '';

	$scope.form_disabled = false;
        
	$scope.tid = '';
	
	
	
	$scope.placemarks = [];

	var placemark_options = { draggable: true, labelContent: '' };

	$scope.getMarkerOptions = function (placemark){

		var lat = parseFloat(placemark.point.coordinates.latitude).toFixed(5);
		var lng = parseFloat(placemark.point.coordinates.longitude).toFixed(5);
		placemark_options.labelContent = placemark.name + ' (' + lat + ', ' + lng + ')';
                
		return placemark_options;
	}

	$scope.marker_events = {
                 dragend: function (marker, eventName, args) {
		                 console.log('marker_events placemarks:',$scope.placemarks);
		                 console.log('marker_events marker:',marker);
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
      
      $scope.getGeo();
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

        $scope.initgeo = function (initdata) {
	
	$scope.mode = $scope.$parent.mode;   // object/template
        if($scope.mode == 'template'){
	      $scope.tid = $scope.$parent.tid;
	      $scope.placemarks = $scope.$parent.placemarks;
	}
        console.log('geo init placemarks0:',$scope.$parent);
        console.log('geo init placemarks1:',$scope.$parent.placemarks);
        console.log('geo init mode:',$scope.edit_mode);
	
        $scope.initdata = angular.fromJson(initdata);
    	console.log('geo init:',$scope.initdata);
	$scope.current_user = $scope.initdata.current_user;
    	$scope.pid = $scope.initdata.pid;
	//delete it
	$scope.bagid = $scope.initdata.bagid;
    };

    
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
	 }, 1000);
    }

    $scope.$parent.$watch('geoTabActivated', function(newValue, oldValue) {
    	if(newValue){
	      //google maps refresh
	      $scope.refreshMaps();
	      //also used for upadate(template mode) of placemarks because of delay while reading geo data
	      if($scope.mode == 'template'){
	           $scope.placemarks = $scope.$parent.placemarks;
	      }
    	}
    });
    
    // just for testing
    $scope.getGeo2 = function() {
      
          var geo = '{ "geo": { "kml": { "document": { "placemark": [ { "point": { "coordinates": { "longitude": "24.018037", "latitude": "35.51383" } }, "name": "Chania,DasPortaldesRenierPalastes", "description": "" } ] } } } }';
          $scope.geoData = angular.fromJson(geo);
	  $scope.placemarks = $scope.geoData.geo.kml.document.placemark;
	  for (i = 0; i < $scope.placemarks.length; ++i) {
	    	var p = $scope.placemarks[i];
	    	p.id = i;
	    	if(!p['map']){
		     p['map'] = {
		    		center: { latitude: $scope.placemarks[i].point.coordinates.latitude, longitude: $scope.placemarks[i].point.coordinates.longitude },
		    		zoom: 8
		    	        }
	        }
	 }
	
    }
    // modify it (get geo data!)
    $scope.getGeo = function() {
    	console.log('getGeo', $scope.pid);
        var promise = MetadataService.getGeo($scope.pid);
        $scope.loadingTracker.addPromise(promise);
        promise.then(
    		function(response) {
		        console.log('getGeo response.data:',response.data);
    			if(response.data.alerts){
    				$scope.alerts = response.data.alerts;
    			}
			     
			if(response.data.metadata){
			     console.log('map3');
			     if(response.data.metadata.geo){
	    			  console.log('map2');
			          $scope.placemarks = response.data.metadata.geo.kml.document.placemark;
	    			  for (i = 0; i < $scope.placemarks.length; ++i) {
	    			        console.log('map1');
				       if(typeof $scope.placemarks[i].map === 'undefined'){
					    console.log('map!!!');
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
					if(typeof $scope.placemarks[i].polygon !== 'undefined'){
					     console.log('polygon!!!:',$scope.placemarks[i]);
					}
	    			  }
			     }
			  }  
			  console.log('placemark12:',$scope.placemarks);
    		}
    		,function(response) {
    			if(response.data.alerts){
    				$scope.alerts = response.data.alerts;
           		}
           		$scope.alerts.unshift({type: 'danger', msg: "Error code "+response.status});
           	}
    	);
    }

    // delete it
    $scope.removeClassFromObject = function(index){
    	$scope.selectBagClassificationNode().children.splice(index,1);
		$scope.save();
    };
    
    
    
    //geo = angular.toJson(geo);
	/*
	            {
	    		"metadata":{
		           "geo":{
			         "kml": {
    			             "document": {
    				          "placemark":[
                                                    {
                                                      "description" : "ddd",
                                                      "id" : 0,
                                                      "map" : {
                                                           "center": {
                                                                   "latitude" : "36.3588672783417",
                                                                   "longitude" : "22.7381297734376"
                                                           },
                                                           "zoom" : 7
                                                     },
                                                     "name" : "Chania,DasPortaldesRenierPalastes",
                                                     "point" : {
                                                             "coordinates" : {
                                                                          "latitude" : "35.51383",
                                                                          "longitude" : "24.018037"
                                                            }
                                                     }
                                                   }
                                                  ]
    			             }
    	                        }  
		           }
	               }
		    }
		    
		    
		    
		    
		    
		    
{
    "metadata": {
        "geo": {
            "kml": {
                "document": {
                    "placemark": [
                        {
                            "description": "ddd",
                            "id": 0,
                            "map": {
                                "center": {
                                    "latitude": "36.3588672783417",
                                    "longitude": "22.7381297734376"
                                },
                                "zoom": 7
                            },
                            "name": "Chania,DasPortaldesRenierPalastes",
                            "point": {
                                "coordinates": {
                                    "latitude": "35.51383",
                                    "longitude": "24.018037"
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
}
		  		    
	
	*/

});
