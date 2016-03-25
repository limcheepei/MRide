angular.module('starter.offerControllers', [])

.controller('OffersCtrl', ['$scope', '$http', '$location', '$ionicModal', '$localstorage', '$ionicLoading', 'Azureservice', 'tripSvc', 'profileSvc', 'profileModal',
					function ( $scope, $http, $location, $ionicModal, $localstorage, $ionicLoading, Azureservice, tripSvc, profileSvc, profileModal){

	// TODO:
	// 1.implement hasPendingRequests badge, enhance web service to support this

	$scope.offers = {};
	$scope.$on('$ionicView.enter', function(e) {
		$ionicLoading.show();
		tripSvc.getMyOffers().then(function (result) {
			if (result) {
				$scope.offers = result;
				$localstorage.setObject('myoffers', result)
				console.log('List of my offers: ' + result);
			} else {
				var err = 'There is no offer.';
				console.log(err);
				$scope.error = err;
			}
			$ionicLoading.hide();
		}).catch(function(err) {
			$scope.error = err;
			$ionicLoading.hide();
		});						
	});
					
	$scope.profile = $localstorage.getObject('profile');
	
	$scope.go = function ( path ) {
        $location.path( path );
    };
	
	

	// Open the modal
	$scope.openProfileModal = function() {
		//$scope.profileModal.show();
		profileModal.showProfile({userId: $scope.profile.azureId, userPref: 'Driver'});
	};
	
}])

.controller('AddOfferCtrl', ['$scope', '$timeout', '$ionicModal', '$ionicLoading', '$ionicPopup', '$localstorage', 'tripSvc',
					function ( $scope, $timeout, $ionicModal, $ionicLoading, $ionicPopup, $localstorage, tripSvc){

	$scope.profile = $localstorage.getObject('profile');
	
	$scope.data = {};
	$scope.$on('$ionicView.enter', function(e) {
			// Data testing
			$scope.data = { 
				locationFrom: '',
				locationTo: '',
				geoFrom: '',
				geoTo: '',
				date: new Date(),
				time: new Date('April 20, 2016 08:00 AM'),
				car: $scope.profile.car,
				carPlateNumber: $scope.profile.carPlateNumber,
				seats: 4,
				carColor: $scope.profile.carColor,
				carDesc: $scope.profile.carDesc
			};
	});
		

	$scope.createTrip = function(form) {
		$scope.submitted = true;
		if(form.$valid) {
			$ionicLoading.show();
			tripSvc.createTrip($scope.data).then(function (result) {
				if (result) {
					console.log('Create trip success. ' + result);
					$scope.showAlert('Create Offer','Offer has been created successfully.');
				} else {
					var err = 'Please check if you have entered the correct info.';
					console.log(err);
					$scope.error = err;
				}
				$ionicLoading.hide();
			}).catch(function(err) {
				console.log(err);
				$scope.error = err;
				$ionicLoading.hide();
			});						
		} else {
			console.log('From is invalid');
			$scope.error = "Please check your info.";
		}
	};
	
	// An alert dialog
	$scope.showAlert = function(title, template) {
		var alertPopup = $ionicPopup.alert({
			title: title,
			template: template
		});

		alertPopup.then(function(res) {
			console.log('alertPopup.then');
		});
	};	
		
	$scope.fromLocationChanged = function(location) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address': location}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				$scope.data.geoFrom = results[0].geometry.location;
				$scope.closeSearchFromModal();
			} else {
			  console.log('Geocode was not successful for the following reason: ' + status);
			}
		  });
	};

	$scope.toLocationChanged = function(location) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address': location}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				console.log('To Address:' + location +'. Geocoding:' + results[0].geometry.location);
				$scope.data.geoTo = results[0].geometry.location;
				$scope.closeSearchToModal();
			} else {
			  console.log('Geocode was not successful for the following reason: ' + status);
			}
		  });
	};
	
	
	// Search from modal
	$ionicModal.fromTemplateUrl('searchFromModal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.searchFromModal = modal;
	});
	
	// Triggered in the modal to close it
	$scope.closeSearchFromModal = function() {
		$scope.searchFromModal.hide();
	};

	// Open the modal
	$scope.openSearchFromModal = function() {
		$scope.searchFromModal.show();
	};


	// Search to modal
	$ionicModal.fromTemplateUrl('searchToModal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.searchToModal = modal;
	});
	
	// Triggered in the modal to close it
	$scope.closeSearchToModal = function() {
		$scope.searchToModal.hide();
	};

	// Open the modal
	$scope.openSearchToModal = function() {
		$scope.searchToModal.show();
	};
}])

.controller('OfferDetailCtrl', ['$scope', '$ionicModal', '$ionicLoading', '$stateParams', '$localstorage', '$ionicPopup', '$filter', '$location', 'tripSvc', 'profileSvc','profileModal',
					function ( $scope, $ionicModal, $ionicLoading, $stateParams, $localstorage, $ionicPopup, $filter, $location, tripSvc, profileSvc,profileModal){
	
	$scope.profile = $localstorage.getObject('profile');	
	
	$scope.data = {};
	$scope.tripRiders = {};
	$scope.$on('$ionicView.enter', function(e) {
		var myOffers = $localstorage.getObject('myoffers');
		for (var index in myOffers) {
			if (myOffers[index].id == $stateParams.id) {
				$scope.data = myOffers[index];
				$scope.data.date = new Date($filter('date')($scope.data.date, 'MMMM dd, yyyy')); // must set to MMMM dd, yyyy format for HTML5 date type
				$scope.data.time = new Date($filter('date')($scope.data.time, 'MMMM dd, yyyy h:mm a')); // must set to MMMM dd, yyyy h:mm a format for HTML5 time type
			}
		}
		
		// get trip riders
		tripSvc.getTripRiders($stateParams.id).then(function (result) {
			if (result) {
				$scope.riders = result.sort(function (a, b) {
			    	if(b.status=="pending")
			    	{
			    		return 1;
			    	}else if(b.status=="accept" && a.status=="reject")
			    	{
			    		return 1;
			    	}
			    });

			} else {
				var err = 'There is no rider for this trip.';
				console.log(err);
				$scope.error = err;
			}
			$ionicLoading.hide();
		}).catch(function() {
			var err = 'Unknown error:tripSvc.getTripRiders.';
			console.log(err);
			$scope.error = err;
			$ionicLoading.hide();
		});			
	});
	
	$scope.openRiderProfileModal = function (riderIndex)
	{
		// console.log(JSON.stringify($scope.riders[riderIndex]));
		var parameters = {
			userId: $scope.riders[riderIndex].azureId,
			userPref: 'Rider'
		}

		profileModal.showProfile(parameters).then(function(result){
			if (!result) {
				alert('the rider ID is not correct');
			}
		});
		// console.log("openRiderProfileModal");
		// console.log(riderIndex);
		// console.log('is it here?');
		// $scope.riderProfile=$scope.riders[riderIndex];
		// $scope.profileModal.show();

	}

	// $ionicModal.fromTemplateUrl('templates/riderprofile.html', {
	// 	scope: $scope
	// }).then(function(modal) {
	// 	$scope.profileModal = modal;
	// });
	
	// // Triggered in the modal to close it
	// $scope.closeRiderProfileModal = function() {
	// 	$scope.profileModal.hide();
	// };

	// // Open the modal
	// $scope.openProfileModal = function() {

	// 	$scope.profileModal.show();
	// 	// profileModal.showProfile({userId:123,  userPref: 'Rider'});
	// };

	$scope.updateRiderStatus = function (riderIndex, isAccepted)
	{
		console.log("updateRiderStatus");
		$scope.riders[riderIndex].status=isAccepted?"accept":"reject";
		console.log($scope.riders);

		//[ToDo] Update in webservices

	}

	$scope.myFilter = function (item) { 
	    return item.status === 'pending' || item.status === 'accept'; 
	};


	$scope.go = function ( path ) {
		console.log('go: ' + path);	// why id got truncated?
        $location.path( path );
    };
	
	// Driver profile modal
	/*
	$ionicModal.fromTemplateUrl('templates/driverprofile.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.driverProfileModal = modal;
	});
	
	$scope.closeDriverProfileModal = function() {
		$scope.driverProfileModal.hide();
	};

	$scope.openDriverProfileModal = function() {
		$scope.driverProfileModal.show();
	};	
	*/
	
	// An alert dialog
	$scope.showAlert = function(title, template) {
		var alertPopup = $ionicPopup.alert({
			title: title,
			template: template
		});

		alertPopup.then(function(res) {
		});
	};	
		
}])

.controller('EditOfferCtrl', ['$scope', '$timeout', '$ionicModal', '$ionicLoading', '$stateParams', '$localstorage', '$ionicPopup', '$filter', 'tripSvc',
					function ( $scope, $timeout, $ionicModal, $ionicLoading, $stateParams, $localstorage, $ionicPopup, $filter, tripSvc){
				
	$scope.data = {};
	$scope.$on('$ionicView.enter', function(e) {
		var myOffers = $localstorage.getObject('myoffers');
		for (var index in myOffers) {
			if (myOffers[index].id == $stateParams.id) {
				$scope.data = myOffers[index];
				$scope.data.date = new Date($filter('date')($scope.data.date, 'MMMM dd, yyyy')); // must set to MMMM dd, yyyy format for HTML5 date type
				$scope.data.time = new Date($filter('date')($scope.data.time, 'MMMM dd, yyyy h:mm a')); // must set to MMMM dd, yyyy h:mm a format for HTML5 time type
			}
		}
    });
		
	$scope.updateTrip = function(trip) {
		$ionicLoading.show();
		tripSvc.updateTrip(trip).then(function (result) {
			if (result) {
				console.log('Update trip success. ' + result);
				$scope.showAlert('Update Offer', 'Offer has been updated successfully.');
			} else {
				var err = 'Please check if you have entered the correct info.';
				console.log(err);
				$scope.error = err;
			}
			$ionicLoading.hide();
		}).catch(function() {
			var err = 'Unknown error:tripSvc.updateTrip.';
			console.log(err);
			$scope.error = err;
			$ionicLoading.hide();
		});						
	};
	
	$scope.fromLocationChanged = function(location) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address': location}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				console.log('From Address:' + location +'. Geocoding:' + results[0].geometry.location);
				$scope.data.geoFrom = results[0].geometry.location;
				$scope.closeSearchFromModal();
			} else {
			  console.log('Geocode was not successful for the following reason: ' + status);
			}
		  });
	};

	$scope.toLocationChanged = function(location) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address': location}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				console.log('To Address:' + location +'. Geocoding:' + results[0].geometry.location);
				$scope.data.geoTo = results[0].geometry.location;
				$scope.closeSearchToModal();
			} else {
			  console.log('Geocode was not successful for the following reason: ' + status);
			}
		  });
	};
	
	// Search from modal
	$ionicModal.fromTemplateUrl('searchFromModal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.searchFromModal = modal;
	});
	
	// Triggered in the modal to close it
	$scope.closeSearchFromModal = function() {
		$scope.searchFromModal.hide();
	};

	// Open the modal
	$scope.openSearchFromModal = function() {
		$scope.searchFromModal.show();
	};


	// Search to modal
	$ionicModal.fromTemplateUrl('searchToModal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.searchToModal = modal;
	});
	
	// Triggered in the modal to close it
	$scope.closeSearchToModal = function() {
		$scope.searchToModal.hide();
	};

	// Open the modal
	$scope.openSearchToModal = function() {
		$scope.searchToModal.show();
	};
	
	$scope.myFilter = function (item) { 
		console.log(item);
	    return item.status === 'pending' || item.status === 'accept'; 
	};
	// An alert dialog
	$scope.showAlert = function(title, template) {
		var alertPopup = $ionicPopup.alert({
			title: title,
			template: template
		});

		alertPopup.then(function(res) {
		});
	};	
}])
				
;
