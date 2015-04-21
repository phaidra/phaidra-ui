app.controller('GeoCtrl', function($scope, $rootScope, $modal, $location, MetadataService, promiseTracker, uiGmapGoogleMapApi) {


	// we will use this to track running ajax requests to show spinner
	//$scope.loadingTracker = promiseTracker('loadingTrackerFrontend');
        $scope.loadingTracker = $rootScope.loadingTracker;
	
	$scope.alerts = [];

	$scope.initdata = '';
	$scope.current_user = '';
	//delete it
	$scope.bagid = '';

	$scope.form_disabled = false;

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
	$scope.initdata = angular.fromJson(initdata);
    	$scope.current_user = $scope.initdata.current_user;
    	//delete it
	$scope.bagid = $scope.initdata.bagid;
	
	

    };

    
    $scope.refreshMaps = function() { 
        for (i = 0; i < $scope.placemarks.length; ++i) {
			var p = $scope.placemarks[i];
			//p.map.refresh(p.point.coordinates);
		        window.setTimeout(function () {
			      p.map.refresh(p.point.coordinates);
                         }, 1000)
	}
    }

    $scope.$parent.$watch('geoTabActivated', function(newValue, oldValue) {
    	if(newValue){
	      $scope.refreshMaps();
    	}
    });
    
    // just for testing
    $scope.getGeo = function() {
      
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
    $scope.getGeo2 = function() {
    	var promise = MetadataService.getGeo($scope.bagid);
        $scope.loadingTracker.addPromise(promise);
        promise.then(
    		function(response) {
    			if(response.data.alerts){
    				$scope.alerts = response.data.alerts;
    			}
			     if(response.data.geo){
	    			  $scope.placemarks = response.data.geo.kml.document.placemark;
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
    // delete it
    $scope.save = function() {
    	$scope.form_disabled = true;
    	var geo = {
    		kml: {
    			document: {
    				placemark: $scope.placemarks
    			}
    		}
    	};

    	var promise = MetadataService.saveGeo($scope.bagid, geo)
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

 };

});
