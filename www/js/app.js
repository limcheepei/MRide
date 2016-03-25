angular.module('starter', ['ionic', 'starter.coreControllers', 'starter.rideControllers', 'starter.offerControllers', 'starter.services', 'ion-place-tools', 'azure-mobile-service.module', 'ionicProcessSpinner', 'ngMessages'])

.run(function($ionicPlatform, $rootScope, $state, $location, Azureservice) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	var isWebView = ionic.Platform.isWebView();
	var isIPad = ionic.Platform.isIPad();
	var isIOS = ionic.Platform.isIOS();
	var isAndroid = ionic.Platform.isAndroid();	
	var isWindowsPhone = ionic.Platform.isWindowsPhone();
	var currentPlatform = ionic.Platform.platform();
	var currentPlatformVersion = ionic.Platform.version();

	console.log('isWebView:'+isWebView);
	console.log('isIPad:'+isIPad);
	console.log('isIOS:'+isIOS);
	console.log('isAndroid:'+isAndroid);
	console.log('isWindowsPhone:'+isWindowsPhone);
	console.log('currentPlatform:'+currentPlatform);
	console.log('currentPlatformVersion:'+currentPlatformVersion);
  });
  
  
	var routeChangeHandler = function (e, nextRoute) {
		console.log('route.nextRoute:' + nextRoute.$$route.url);
		/*
		if (nextRoute && nextRoute.$$route && nextRoute.$$route.requireADLogin) {
			if (!_oauthData.isAuthenticated && !_adal._renewActive) {
				console.log('Route change event for:' + $location.$$path);
				if (_adal.config && _adal.config.localLoginUrl) {
					$location.path(_adal.config.localLoginUrl);
				} else {
					// directly start login flow
					_adal._saveItem(_adal.CONSTANTS.STORAGE.START_PAGE, $location.$$path);
					console.log('Start login at:' + window.location.href);
					$rootScope.$broadcast('adal:loginRedirect');
					_adal.login();
				}
			}
		}
		*/
	};
	
	var stateChangeHandler = function (e, nextRoute) {
		console.log('state.requireADLogin:' + nextRoute.url + ',' + nextRoute.requireADLogin);
		if (nextRoute && nextRoute.requireADLogin) {
			var isLoggedIn = Azureservice.isLoggedIn();
			if (!isLoggedIn) {
				$location.path('/sign-in');
			}
		}
		/*
		if (nextRoute && nextRoute.requireADLogin) {
			if (!_oauthData.isAuthenticated && !_adal._renewActive) {
				console.log('Route change event for:' + nextRoute.url);
				if (_adal.config && _adal.config.localLoginUrl) {
					$location.path(_adal.config.localLoginUrl);
				} else {
					_adal._saveItem(_adal.CONSTANTS.STORAGE.START_PAGE, nextRoute.url);
					console.log('Start login at:' + window.location.href);
					$rootScope.$broadcast('adal:loginRedirect');
					_adal.login();
				}
			}
		}
		*/
	};  
	//$rootScope.$on('$routeChangeStart', routeChangeHandler);
	$rootScope.$on('$stateChangeStart', stateChangeHandler);
})

.constant('$ionicLoadingConfig', {
  templateUrl: 'templates/spinner.html'
})

.constant('AzureMobileServiceClient', {
	//API_URL : 'https://todolist-cplim.azure-mobile.net/',
	//API_KEY : 'wdsqVlKDXYydPNktgPFDNFTOHPEASC57'

	API_URL : 'https://mride-ms-dev.azure-mobile.net/',
	API_KEY : 'qZzfroKtklJclGuYPAZvbNkIRHaOQC36'

})
  
.config(['$stateProvider','$urlRouterProvider', '$httpProvider', 
function($stateProvider, $urlRouterProvider, $httpProvider) {
	$stateProvider

    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/login.html',
      controller: 'SignInCtrl'
    })
	
	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('activate', {
		url: '/activate',
		templateUrl: 'templates/activate.html',
		controller: 'ActivateCtrl',
		requireADLogin: true
	})	
	.state('app.bookings', {
		url: '/bookings',
		views: {
		'tab-search': {
			templateUrl: 'templates/bookings.html',
			controller: 'BookingsCtrl'
			}
		},
		requireADLogin: true
	})
	
	.state('app.searchride', {
		url: '/searchride',
		views: {
		'tab-search': {
			templateUrl: 'templates/searchride.html',
			controller: 'SearchRideCtrl'
			}
		},
		requireADLogin: true
	})
  
	.state('app.offers', {
		url: '/offers',
		views: {
		'tab-offers': {
			templateUrl: 'templates/offers.html',
			controller: 'OffersCtrl'
			}
		},
		requireADLogin: true
    })

	.state('app.offerdetail', {
		url: '/offers/:id',
		views: {
		'tab-offers': {
			templateUrl: 'templates/offerdetail.html',
			controller: 'OfferDetailCtrl'
			}
		},
		requireADLogin: true
    })
	
	.state('app.addoffer', {
		url: '/addoffer',
		views: {
        'tab-offers': {
			templateUrl: 'templates/addoffer.html',
			controller: 'AddOfferCtrl'
			}
		},
		requireADLogin: true
    })
	
	.state('app.ridedetail', {
		url: '/ridedetail/:id',
		views: {
		'tab-search': {
			templateUrl: 'templates/ridedetail.html',
			controller: 'RideDetailCtrl'
			}
		},
		requireADLogin: true
	})
;


	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/sign-in');
  
}]);


