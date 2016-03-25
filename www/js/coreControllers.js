angular.module('starter.coreControllers', [])

.controller('SideMenuCtrl', ['$scope', '$ionicModal', '$ionicSideMenuDelegate', '$localstorage', 'profileSvc', 'Azureservice',
			function($scope, $ionicModal, $ionicSideMenuDelegate, $localstorage, profileSvc, Azureservice) {
	
	$scope.profile = {};	
	$scope.$watch(function () {
		return $ionicSideMenuDelegate.getOpenRatio();
	},
		function (ratio) {
			if (ratio == 1){
				// update info when side menu is opened
				$scope.profile = $localstorage.getObject('profile');
			}
	});
				
	$scope.$on('$ionicView.enter', function(e) {
		
	});

	
	// Create the driver profile modal
	$ionicModal.fromTemplateUrl('templates/driverprofile.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.profileModal = modal;
	});
	
	// Triggered in the modal to close it
	$scope.closeDriverProfileModal = function() {
		$scope.profileModal.hide();
	};

	// Open the modal
	$scope.openProfileModal = function() {
		$scope.profileModal.show();
	};
	
}])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$location', 'Azureservice', 
			function($scope, $ionicModal, $timeout, $location,  Azureservice) {

	$scope.logout = function() {
		console.log('performing logout');
		Azureservice.logout();
		$location.path('/sign-in');
	};
  
}])

.controller('SignInCtrl', ['$scope', '$location', '$localstorage', 'Azureservice', 'profileSvc', function ($scope, $location, $localstorage, Azureservice, profileSvc) {

/*
	Reference:
	https://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-get-started/
	https://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-get-started-users/
	This works well with https://github.com/TerryMooreII/angular-azure-mobile-service
*/

	$scope.$on('$ionicView.enter', function(e) {
		var isLoggedIn = Azureservice.isLoggedIn();
		if (isLoggedIn) {
			// TODO: Need to check if logged in user has activated
			$location.path( 'app/bookings' );
		}
	});
	
	$scope.signIn = function() {
		$scope.error = '';
		var isLoggedIn = Azureservice.isLoggedIn();
		if (!isLoggedIn) {
			Azureservice.login('aad')
				.then(function() {
					var user = Azureservice.getCurrentUser();
					if (user) {
						//profileSvc.activateUser('test01@limcheepeigmail.onmicrosoft.com','1234').then(function (result) {
						profileSvc.getProfile(user.userId).then(function (result) {
							if (result) {
								console.log('sign-in success. '+ result);
								$localstorage.setObject('profile', result);
								if (result.activated) {
									$location.path( 'app/bookings' );
								} else {
									console.log('Found user and not activated. Goto activation page');
									$location.path( 'activate' );
								}
							} else {
								console.log('Missing user. AzureId not registered yet. Goto activation page');
								$location.path( 'activate' );
							}
						}).catch(function() {
							var err = 'Error calling profileSvc.getProfile.';
							console.log(err);
							$scope.error = err;
							Azureservice.logout();
						});						
					} else {
					
						$scope.error = 'User record is missing.';
					}
					
				}, function(err) {
					console.error('Azure Error: ' + err);
					$scope.error = err;
					Azureservice.logout();
				});
		} else {
			var user = Azureservice.getCurrentUser();
			profileSvc.getProfile(user.userId).then(function (result) {
				if (result) {
					console.log('sign-in success. '+ result);
					$localstorage.setObject('profile', result);
					if (result.activated) {
						$location.path( 'app/bookings' );
					} else {
						console.log('Found user and not activated. Goto activation page');
						$location.path( 'activate' );
					}
				} else {
					console.log('Missing user. AzureId not registered yet. Goto activation page');
					$location.path( 'activate' );
				}
			}).catch(function() {
				var err = 'Error calling profileSvc.getProfile.';
				console.log(err);
				$scope.error = err;
			});		
		}
	};
	
	
}])

.controller('ActivateCtrl', ['$scope', '$http', '$location', '$localstorage', 'Azureservice', 'profileSvc',
					function ( $scope, $http, $location, $localstorage, Azureservice, profileSvc){
	// Hard code for POC
	$scope.data = {
		username:'test01@limcheepeigmail.onmicrosoft.com',
		token:'1234'};
	
	$scope.activate = function(data) {
		profileSvc.activateUser(data).then(function (result) {
			if (result) {
				if (result.activated) {
					$localstorage.setObject('profile', result);
					$location.path( 'app/bookings' );
				} else {
					var err = 'There is a problem with the activation.';
					console.log('User found, but update failed.');
					console.log(err);
					$scope.error = err;
				}
			} else {
				var err = 'Please check if you have entered the correct info.';
				console.log(err);
				$scope.error = err;
			}
		}).catch(function() {
			var err = 'Unknown error:profileSvc.activateUser.';
			console.log(err);
			$scope.error = err;
		});						

	}
					
	$scope.go = function ( path ) {
        $location.path( path );
    };

	$scope.gotoSignIn = function() {
		Azureservice.logout();
		$location.path( '/sign-in' );
	}	
}])
.controller('ProfileCtrl',['$scope', 'parameters', 'profileModal', function($scope, parameters, profileModal){

	/*
	parameters:{
		userId: id,
		userPref: (Driver/Rider),
		user: profile details
	*/
	$scope.profileTitle;		// to display the title of the profile (Profile/Rider)
	$scope.canShow;				// to whether show some html components or not
	$scope.user;

	if (parameters) {
		if (parameters.userPref === 'Driver') {
			$scope.profileTitle = 'Profile';
			$scope.canShow = true;
		} else {
			$scope.profileTitle = 'Rider';
			$scope.canShow = false;
		}
		if (parameters.user) {
			$scope.user = parameters.user;
		} else {
			alert('No Information about this user');
		}
	}
	$scope.closeProfileModal = $scope.closeModal; // it will do the job automatically as it was passed by the service
	// check services.js (profileModalService)


}])
;
