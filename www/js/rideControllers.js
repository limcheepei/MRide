angular.module('starter.rideControllers', [])

.controller('BookingsCtrl', ['$scope', '$http', '$location', '$ionicModal', '$ionicLoading', 'SearchRideCriteria', 'Azureservice', 'tripSvc',
					function ( $scope, $http, $location, $ionicModal, $ionicLoading, SearchRideCriteria, Azureservice, tripSvc){
	
	$scope.searchCriteria = {};
	$scope.$on('$ionicView.enter', function(e) {
		$scope.searchCriteria = { 
			locationFrom: SearchRideCriteria.locationFrom,
			locationTo: SearchRideCriteria.locationTo,
			selectedDate: null
		};
		
		$ionicLoading.show();
		tripSvc.searchTrips($scope.searchCriteria).then(function (results) {
			$scope.rides = results;
			$ionicLoading.hide();
		}).catch(function(err) {
			$scope.error = err;
			$ionicLoading.hide();
		});
		
	});
	
	// TODO:
	// generate a list of dates starting from today until next 30 days
	$scope.listOfDates = [
    { date: '18-02-2016', id: 1 },
	{ date: '19-02-2016', id: 2 },
	{ date: '22-02-2016', id: 3 },
	{ date: '23-02-2016', id: 4 },
	{ date: '24-02-2016', id: 5 },
	{ date: '25-02-2016', id: 6 },
	{ date: '26-02-2016', id: 7 },
	{ date: '27-02-2016', id: 8 }
	];
  
  
	$scope.bookedToggle = 0;
  
	$scope.showBooked = function() {
		if ($scope.bookedToggle == 1) {
			$scope.bookedToggle = 0;
		} else {
			$scope.bookedToggle = 1;
		}
	};
  
	$scope.go = function ( path ) {
        $location.path( path );
    };
	
	// search-modal
	$ionicModal.fromTemplateUrl('search-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
	}).then(function(modal) {
        $scope.searchModal = modal;
	});
 
	$scope.openSearchModal = function() {
        $scope.searchModal.show();
	};
 
	$scope.closeSearchModal = function() {
        $scope.searchModal.hide();
	};
 
	$scope.$on('$destroy', function() {
        $scope.searchModal.remove();
	});	
	
	// Search ride modal
	$ionicModal.fromTemplateUrl('templates/searchride.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.searchRideModal = modal;
	});

	$scope.closeSearchRideModal = function() {
		$scope.searchRideModal.hide();
	};

	// Open the search ride modal
	$scope.openSearchRideModal = function() {
		$scope.searchRideModal.show();
	};	
  
}])

.controller('SearchRideCtrl', function($scope, $timeout, $ionicModal, SearchRideCriteria) {

		$scope.$on('$ionicView.enter', function(e) {
			$scope.searchCriteria = { 
				locationFrom: SearchRideCriteria.locationFrom,
				locationTo: SearchRideCriteria.locationTo
			};
		});
		
		$scope.fromLocationChanged = function(location) {
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address': location}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					console.log('From Address:' + location +'. Geocoding:' + results[0].geometry.location);
					SearchRideCriteria.locationFrom = location;
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
					SearchRideCriteria.locationTo = location;
					$scope.closeSearchToModal();
				} else {
				  console.log('Geocode was not successful for the following reason: ' + status);
				}
			  });
		};
		
        $scope.showAlert = function (msg) {
          alert(msg);
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
		
})

.controller('RideDetailCtrl', ['$scope', '$ionicModal', '$location', '$localstorage', '$stateParams', '$ionicLoading', 'Azureservice',  'profileSvc', 'tripSvc', 'profileModal',
					function ( $scope, $ionicModal, $location, $localstorage, $stateParams, $ionicLoading, Azureservice, profileSvc, tripSvc, profileModal){
	
	$scope.$on('$ionicView.enter', function(e) {
		console.log('$stateParams:' + $stateParams.id);
		
		// TODO: Refer to OfferDetailCtrl on how to retrieve the detail from localStorage base on $stateParams.id
		
		// TODO: call tripSvc.getTripRiders to retrieve list of riders (trip.tripId)
		
		// TODO: call profileSvc.getProfile to retrieve driver's profile (trip.driverId)

		// To be removed
		$scope.profile = $localstorage.getObject('profile'); // This will always be the login user's profile

		// To be removed
		$scope.riders = profileSvc.getRiders();	// To be replaced by tripSvc.getTripRiders
		
	});
	
	
	$scope.requestTrip = function(form) {
		$ionicLoading.show();
		tripSvc.requestTrip($scope.profile.azureId).then(function (result) {
			if (result) {
				$scope.showAlert('Request Trip: ' + result);
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
	};	
	
	$scope.showAlert = function (msg) {
	  alert(msg);
	};	
	
	$scope.data = { 
		from: 'Bandar Utama, Petaling Jaya' ,
		to: 'Menara Manulife, Kuala Lumpur'
	};

	// Driver profile modal
	// $ionicModal.fromTemplateUrl('templates/driverprofile.html', {
	// 	scope: $scope
	// }).then(function(modal) {
	// 	$scope.driverProfileModal = modal;
	// });
	
	// $scope.closeDriverProfileModal = function() {
	// 	$scope.driverProfileModal.hide();
	// };

	$scope.openDriverProfileModal = function() {
		console.log('RideDetailCtrl '+ $scope.profile.azureId);
		var parameters = {
			userId: $scope.profile.azureId,
			userPref: 'Driver'
		}
		profileModal.showProfile(parameters).then(function(result){
			if (!result) {
				// comment the below line if the driver ID is correct;
				alert('driver id is not correct');
			}
		});
		// $scope.driverProfileModal.show();
	};

	// Rider profile modal
	// $ionicModal.fromTemplateUrl('templates/riderprofile.html', {
	// 	scope: $scope
	// }).then(function(modal) {
	// 	$scope.riderProfileModal = modal;
	// });
	
	// // Triggered in the modal to close it
	// $scope.closeRiderProfileModal = function() {
	// 	$scope.riderProfileModal.hide();
	// };

	// Open the modal
	$scope.openRiderProfileModal = function(id) {
		var parameters= {
			userId: id,
			userPref: 'Rider'
		}
		profileModal.showProfile(parameters).then(function(result){
			if (!result) {
				// comment the below line if the Rifer ID is correct;
				alert('Rider id is not correct');
			}
		});
		// $scope.riderProfile = profileSvc.getRiderProfile(id);	
		// $scope.riderProfileModal.show();
	};

}]);
