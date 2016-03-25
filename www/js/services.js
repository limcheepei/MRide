angular.module('starter.services', [])

.factory('SearchRideCriteria', function() {
	searchRideCriteria = {};
	searchRideCriteria.locationFrom = '';
	searchRideCriteria.locationTo = '';
	return searchRideCriteria;
})

.factory('tripSvc', ['$http','Azureservice','$q', function ($http, Azureservice, $q) {

	// TODO: functions have been created with dummy logic, and no web service call.
	// getTripDetail (booking detail)
	// getTripRiders (list of riders for the selected trip)
	// requestTrip	(rider books the trip)
	// cancelRequest (rider cancels the booked trip)
	// acceptTrip (driver accepts the request)
	// rejectTrip (driver rejects the request)
    return {
        searchTrips : function(searchCriteria){
			// search for trips base on some criteria such as selected date, location from.
            var deferred = $q.defer();
			
			if (!searchCriteria.selectedDate) {
				searchCriteria.selectedDate = new Date().toISOString();
			}
			
			// old api: searchtrips
			Azureservice.invokeApi('trip/search', {
					method: 'POST',
					body: {	'tripDate': searchCriteria.selectedDate,
							'locationFrom': searchCriteria.locationFrom}
				})
				.then(function(response) {
					console.log('Response object.' + response);
					var result = {};
					if (response.status == 'OK') {
						result = response.result;
						console.log('searchTrips response.status OK:' + result);
					} else {
						var msg = "Oops! We can't find any trips.";
						deferred.reject(msg);
					}
					deferred.resolve(result);
				}, function(err) {
					//var xhr = err.request;
					//var msg = err.toString() + '. ' + xhr.responseText;
					console.error(err);
					deferred.reject(err);
				});
			
			return deferred.promise;
        },
        getTripDetail : function(tripId){
			// get trip detail
			var deferred = $q.defer();
			var tripDetail = [ 
    			{
                    driverId: 'Aad:ZMCD-C4jA8tCUCMeJzP--xFo_0lybd7S48RzhfttvVA',
                    status: 'active',
                    car: 'Honda City',
                    carColor: 'Silver Metallic',
                    carPlateNumber: 'WC 9810 Y',
                    carDesc: 'I am charging a fee of RM1 per pax. This is additional remark about this trip. Another update.',
                    seatsAvailable: 4,
                    locationFrom: 'Jalan Maarof Bukit Bandaraya Kuala Lumpur Federal Territory of Kuala Lumpur Malaysia',
                    locationTo: 'Jalan Damansara Sungai Penchala Kuala Lumpur Selangor Malaysia',
                    booked: 0
                 }
                ];		

			deferred.resolve(tripDetail);
			return deferred.promise;			
			
			/* Uncomment this to test the web service
/*		
            var deferred = $q.defer();
			
			Azureservice.invokeApi('getTripDetail', {
					method: 'POST',
					body: {	'tripId': tripId
							}
				})
				.then(function(response) {
					console.log('Response object.' + response);
					var result = {};
					if (response.status == 'OK') {
						result = response.result;
						console.log('getTripDetail response.status OK:' + result);
					} else {
					
					}
					deferred.resolve(result);
				}, function(err) {
					var xhr = err.request;
					var msg = err.toString() + '. ' + xhr.responseText;
					console.error(err);
					deferred.reject(msg);
				});
			
			return deferred.promise;
*/			
        },		
        getTripRiders : function(tripId){
			// get list of riders on the trip
			var deferred = $q.defer();
			var tripRiders = [
				{tripId:"59F49B35-AB04-4851-A9F1-5BBC5C44B499", status:"accept", requestRemark:"", driverRemark:"", requestDate:"", name:"Rider Name (Jack)", email:"rider.name.jack@gmail.com", mobile:"+60137778888", 
					address:"Unit 2A/10, ABC Condo, Petaling Jaya, Selangor", desc:"I prefer female drivers.", photo:"iVBORw0KGgoAAAANSUhEUgAAAIUAAAB7CAMAAABtnLNnAAAAP1BMVEWZmZn///+srKyUlJSRkZH19fX4+Pj7+/vBwcHl5eXS0tKdnZ2NjY2+vr6vr6/X19ejo6Pd3d3Ly8u1tbXr6+vVgw+8AAAD9klEQVR4nO3aaXOkIBAGYALiAV6g//+3rs6RTBR5m2OmNlX0p62tGn2CzdXAvqJjNaod+az1zPlgTdfEP4rF/UyaQTMhBHvE7Z9crZ9UdIOuvgEvUW2Q+kMKM/cuwgMi2ghHsGLa/mJviH4IdgQq1vG6GX4cbHqrwjICYneM8m2KhoOP8doc3ZsUHbEh7tHbtyhMAGGPaniDYgppiFuIJbui60MRIQyioiPn5WuQPwpNscYYdgYxRWkKHpwUjxC0DktStLEIxjRpNKcoYjLzuzHGTIpmjkdsqUH5JgSFjeof3zET1mBYIZMMW2OoHIqE1LwHIUGhok40kBoDKmxqU2yZka5I6iD3wEMXUqwJY8W3Ak4nSJGcm3tUiYqGZ0CwHu2WgELmaAom0NQKFCZt3HwGmkyAYsjSFnDgAoolC4JVYHviV6RNpy8KMGL4FVJnUoBB3K+IXW8eA3WSDynaFEWXp4vAMfwvKLJ9kf9DkZQXuRRojwbGi1yjFigxgRE8y8SOp/bPzCMiaR7JsfbdY06bU+PqFseA5RSgSN+N3BRoR4JWv2MORY+qn0iRJTE0eAlU1Dn2I7CuBPdmlMI3UsByNFSYZAWhnIMrB8mDOKHChhVT6pDB4SsIitR1OKWwRahrpe3PSGVoSqVxSUlQtCEiK+qExsBjBVWR8E0EITWpivhaiqadn9EUTeQISizGU89H6qjuWhna08lnRXXQ0d0DQaj6him25XgoA65tIhRfMvCoRlA/R5Diq1kCOqxgIbcggk646WcU1Rh0JyTsnH2lnXELRk+JCMV+8QFmhxBL2Fl/xP0L2fodQvCgg/44xeawwnkf5mbox3ADrkAbZ+OahZ0hm41b91bQ/RSaQiquBXcnu+xaPu8vvkcl9LxMV++ylebKB7lWyFbvHcJTDJJrp6wdhtYq08nrrnlbuVa6vXZcKtQzCStQDYLx3Et4+u+FQr4MDPioh4TY/yB+0RxuRadfcw/VxqiI7Una3YOciu6Q/Qkf5XSFxclwKeRpmA6cFn6iPT/K9VEcCteRdtgU+YzauSZxMBwK9/aDtqT/FUa7nuTaPJ8V6mLaDJ2j6qvTLsdC8KRo3D/dGUHNYTyT3inJTgpfCakiXxM0s2chcu75J4V/GSPmCfeWxoCV8ums+aiA1Ypqtv78kBau1k9l8aOCUHIWYrycIGu1CMKi8FhNOChq4v3NXrfT+vvbNOvUas9d3F+/PyxDDoqVfoNze988DlapSSk7jPP9v2hRrV5F4H2kxwpHCDrgrrBeRaZzdRTHxcJBkek8BMbiVWQpvhNi9CoynVDB4EVRFEVRFEVRFEVRFEVRFEVRFEVRFEXxFxT/AHsKMSqLs9n+AAAAAElFTkSuQmCC"},
				{tripId:"59F49B35-AB04-4851-A9F1-5BBC5C44B499", status:"pending", requestRemark:"", driverRemark:"", requestDate:"", name:"Rider Name (Wayne)", email:"rider.name.wayne@gmail.com", mobile:"+60137778111", 
					address:"Unit 44/1, Generic Condo, Petaling Jaya, Selangor", desc:"No preference.",photo:"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"},
				{tripId:"59F49B35-AB04-4851-A9F1-5BBC5C44B499", status:"reject", requestRemark:"", driverRemark:"", requestDate:"", name:"Rider Name (Selina)", email:"rider.name.selina@gmail.com", mobile:"+60137778222", 
					address:"Unit 2A-5B, KL Condo, Petaling Jaya, Selangor", desc:"I am willing to pay RM2 for the trip.",photo:"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"},
					{tripId:"59F49B35-AB04-4851-A9F1-5BBC5C44B499", status:"pending", requestRemark:"", driverRemark:"", requestDate:"", name:"Rider Name (Jack 2)", email:"rider.name.jack@gmail.com", mobile:"+60137778888", 
					address:"Unit 2A/10, ABC Condo, Petaling Jaya, Selangor", desc:"I prefer female drivers.", photo:"iVBORw0KGgoAAAANSUhEUgAAAIUAAAB7CAMAAABtnLNnAAAAP1BMVEWZmZn///+srKyUlJSRkZH19fX4+Pj7+/vBwcHl5eXS0tKdnZ2NjY2+vr6vr6/X19ejo6Pd3d3Ly8u1tbXr6+vVgw+8AAAD9klEQVR4nO3aaXOkIBAGYALiAV6g//+3rs6RTBR5m2OmNlX0p62tGn2CzdXAvqJjNaod+az1zPlgTdfEP4rF/UyaQTMhBHvE7Z9crZ9UdIOuvgEvUW2Q+kMKM/cuwgMi2ghHsGLa/mJviH4IdgQq1vG6GX4cbHqrwjICYneM8m2KhoOP8doc3ZsUHbEh7tHbtyhMAGGPaniDYgppiFuIJbui60MRIQyioiPn5WuQPwpNscYYdgYxRWkKHpwUjxC0DktStLEIxjRpNKcoYjLzuzHGTIpmjkdsqUH5JgSFjeof3zET1mBYIZMMW2OoHIqE1LwHIUGhok40kBoDKmxqU2yZka5I6iD3wEMXUqwJY8W3Ak4nSJGcm3tUiYqGZ0CwHu2WgELmaAom0NQKFCZt3HwGmkyAYsjSFnDgAoolC4JVYHviV6RNpy8KMGL4FVJnUoBB3K+IXW8eA3WSDynaFEWXp4vAMfwvKLJ9kf9DkZQXuRRojwbGi1yjFigxgRE8y8SOp/bPzCMiaR7JsfbdY06bU+PqFseA5RSgSN+N3BRoR4JWv2MORY+qn0iRJTE0eAlU1Dn2I7CuBPdmlMI3UsByNFSYZAWhnIMrB8mDOKHChhVT6pDB4SsIitR1OKWwRahrpe3PSGVoSqVxSUlQtCEiK+qExsBjBVWR8E0EITWpivhaiqadn9EUTeQISizGU89H6qjuWhna08lnRXXQ0d0DQaj6him25XgoA65tIhRfMvCoRlA/R5Diq1kCOqxgIbcggk646WcU1Rh0JyTsnH2lnXELRk+JCMV+8QFmhxBL2Fl/xP0L2fodQvCgg/44xeawwnkf5mbox3ADrkAbZ+OahZ0hm41b91bQ/RSaQiquBXcnu+xaPu8vvkcl9LxMV++ylebKB7lWyFbvHcJTDJJrp6wdhtYq08nrrnlbuVa6vXZcKtQzCStQDYLx3Et4+u+FQr4MDPioh4TY/yB+0RxuRadfcw/VxqiI7Una3YOciu6Q/Qkf5XSFxclwKeRpmA6cFn6iPT/K9VEcCteRdtgU+YzauSZxMBwK9/aDtqT/FUa7nuTaPJ8V6mLaDJ2j6qvTLsdC8KRo3D/dGUHNYTyT3inJTgpfCakiXxM0s2chcu75J4V/GSPmCfeWxoCV8ums+aiA1Ypqtv78kBau1k9l8aOCUHIWYrycIGu1CMKi8FhNOChq4v3NXrfT+vvbNOvUas9d3F+/PyxDDoqVfoNze988DlapSSk7jPP9v2hRrV5F4H2kxwpHCDrgrrBeRaZzdRTHxcJBkek8BMbiVWQpvhNi9CoynVDB4EVRFEVRFEVRFEVRFEVRFEVRFEVRFEXxFxT/AHsKMSqLs9n+AAAAAElFTkSuQmCC"},
				{tripId:"59F49B35-AB04-4851-A9F1-5BBC5C44B499", status:"accept", requestRemark:"", driverRemark:"", requestDate:"", name:"Rider Name (Wayne 2)", email:"rider.name.wayne@gmail.com", mobile:"+60137778111", 
					address:"Unit 44/1, Generic Condo, Petaling Jaya, Selangor", desc:"No preference.",photo:"iVBORw0KGgoAAAANSUhEUgAAAIUAAAB7CAYAAABaQkNVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAmiSURBVHhe7Z1baFRJGoBrxluihog64l2MbgiCooOY0QeJCEEdQRgQGZlHH+bJp4GFfdqnhYWFXXzaB18VxTjkZaIEYmIQGVfZUQSNoonGC5J4i1e8MTtfUZXt5HSbdPfprv+c838g6dMR7a7z1V9/XU7VF7//gckAjx8/Ni9evDCvX782z549M0+fPjWfPn0yb9++Ne/fv7d/Z/r06aa2tta+njt3rqmrq7M/a2pqzIIFC8zUqVPt79JOaqV48+aNefTokbl7964ZGBgwC3f+1Qz8/Gf3W2NWfvd39yo/+f7u2/P/NI2NjWbRokVm/vz59r00kjopHj58aG7cuGFFePXqlZkyZcqEAhTDrRM/mdV7/zEqCH9mzJjhfpsOUiNFf3+/OX/+vBkaGrI3KU4RCoEgSLd27VrT3NycGjkSL0VfX5/pr28drcEhoKl59+6d2bBhg9myZUvi5UisFCSO586dMw8ePKhKVJgMyMFnaRjpNE1NTe7d5PGl+5koLl26ZP7z4WtRQoD/LF1dXaa9vd0mu0kkUVJ8/PjRnDx50uYOIEmIXPhcCNsz0mQT36SRGCko3M7hBtvNDJU7FIMX9tixYzayJYlE5BT0LPpqW9xV8iAJpoeybds2945sxEcKehenTp1yV8mEyHbt2jXT0dHh3pGNaCloMihIqblDMfAdGFBLghhipUCItrY20/T9v9w7yQcxbt26Zbq7u907MhGZUzAGQZczrZBjMMi1ceNG944sREaKs2fPjpmQShvkGBcuXBDbXRUnRW9vr+12piGP+Bx8v9OnT9vhcWmIkoKaQ58+7UJ4WMshsWclRgpGK8+cOZOqxHIikH9wcFBcMyJGisuXL9vVUFmD/ILKQKWQgggpmDgaWvJdIoavKwGV4fr16+4qPCKkII9Ic29jIqgMFy9eFJN0BpeCgnj1px8yk1wWgqWDN2/edFdhCS7F1atXMx0lPESLK1euuKuwBJeCCa+sRwnPyMiIiJ5IUCkYzmahrfJ/WIkemqBSMJ2ctuXx5UDEpDkNTTAp6JcPDw9r0zEOyoUIGpJgUvCoHnMcyliInHfu3HFXYQgmBULwLKcyFiLn/fv33VUYgknBM548XaVEYYQz5EBWMCmYIdR8Ij8MZIWMokGkIJnK4uRXMTx//ty9qj5BpCDJ9HtCKPl58uSJe1V9gkjBrCj7RSj5IdfKZE6hfJ6Qz6EGaz50EuzzZC7RVGQTRAo2HNPuqFw0Uggl5MCeSiEQ8omZM2e6q+oTRAq+8NOuv7krJR+zZ892r6pPMCn8JqZKFEZ8Q+7TGaz5UCkKw/R55poPYFtjHavIT319fTYTzcWLF+t6ijxQUdgPPOQyxWBSzJs3L7NPhE3EsmXL3KswBJOCmvD+wiF3pXiYCFu1apW7CkMwKWDp0qWaV4xjzpw5QZNMCCoF2whKeX5SAlSQdevWuatwBJWCJqShoUGjRQ5r1qxxr8IRVAqQUDMkQMVYsmRJ8KYDgktBpKBfrhizadMm9yoswaUAtg5kG8Ess3DhQjt2IwERUqxevdoO2GQVKsTmzZvdVXhESMEpfmw2msVoQS5BpZASJUCEFEBuQeFkrSfCUH9Li6wTCsRIAdu3b8/UfAgVgAgpoceRiygpGLfYvXt3JpoRhCC5lLg/tygpgGZk/fr1qW9GWE+yc+dOdyULcVIAIZWBnLSKwffasWOHuGbDI1IKeiPUojQOatE08t0k9TbGI1IKIL/Yu3evfZ2WiIEQnCNGEykZsVIAYrTU99mIkXQx+PwIwcywdBJx2iAP23IEQlLPAUEImgzpEcIjOlJ4SMj27NljVq5cmajuqo9u+/btS4wQkLizztncnROMpa/vRN7ly5fbcRcS5ySRyAPw2WeSc8Y4OlqaHEQHmrhlj39JRP6Qj0RK4WFf7/761tEbERLfVNDEMZchdQxiMiRaCiAJpUnheIgQcngZGLJm+lvy+MNkSbwUHuRgr2+OdmRSjSesKikIMrDomASSFVNpkMETTApuIl1MaljcodYemP9H02I2/GgTvjgEQQIvG595xYoVNmdgLCVu+PyVKJfJUlUpEOH27dv2BBzOtmCDVb483c1KZOj8f+xHyVHSbA7P/zd3+1/G3OBC+N8zccXOO6wMIyrQo6jkzfK9K7YiYNCusbHRPhxUTUGqIoVv97k57Cab22PgBrGsndG+SsPn4A8bsbFPpX/m5OXLl/YnElD41P5Zs2aZmpoa+3AOUlSjW0l06+zsHFM+RDoEYQES0+zVkKPiUnB+xb3539qbXyiE88WZLt+6dat7J3vQZDBqW6iMfPlVo6tbMSmokXzJyY4lVDNiSGMiIXKhArGsgGHzSkWNikjBOVic413spuyIQS3IUsQoRggP5USuw5qMSvR6YpcCIS5/8Y27Kp4sNSXkEF1dXUUJMZ71v/8auxixTojRZLS1tbmr0qCp4Yjr9vZ2UUc9x01vb69NKssRAihvyj1OYosUfLCekSZ3VT4+sdo07b9BNwWLG3o8J06csF3ycoXIhXUnceUYsUWKnp4eeyPjwhfY8ePHbXc2DZA/HDlyJHYhKHeiTlzEEinodnZ3d1dsxtJGjQRPNBEdGJBiGD5OGXIhF4trZVfZUtDudw5XfgGJj0LNzc0in5UoBNGhr7ZltDmsNK1f9Zc90Fa2FIR2JqGq8YWBGkFEahjpNE1N8eUwcYMMRAeOxapUBB0P4sXRpS9bikOHDlXtS+dCATA3QNRgCFjC6iai5uDgoJUh7rxhslBpDh486K5Koywp8o3VVxsKgckqogYjoiFyDnpe5AuURygZPJRHa2trWVG0LCk6Ojrs9LQEfM7BEDCzipWeWSR5ZLb33r17ZmBgwM6qhqwcY/jt32bXrl3uonhKloJCOXz4cNBaUQgE4fMxw0nTwpbPjHVwXUozQ7PAFDxrQ4eGhuxsL9fMpkr9/gcOHCh5rUfJUlBAR48elVM7CuAjiL95HCnh1yrU1dWNFty0adPMhw8f7GuEYjqdpoCpftZgwPh/Syo0Ifv37y950K9kKfxiEOlS5MPf3FwKLbqRLkA+kIKHtEvtupcsBYNVlRyMUUoH6ctZhlDyMLeeVS4X7gv3p1RKlkKPpZZNOfenZClogxW5lHN/Yl1PoaQDlUKJoFIoEVQKJYJKoURQKZQIKoUSQaVQIqgUSgSVQomgUigRVAolgkqhRFAplAgqhRJBpVAiqBRKBJVCiaBSKBFUCiWCSqFEUCmUCCqFEkGlUCKoFEoElUKJoFIoEVQKJYJKoURQKZRxGPM/dDqykT4KtyAAAAAASUVORK5CYII="},
				{tripId:"59F49B35-AB04-4851-A9F1-5BBC5C44B499", status:"reject", requestRemark:"", driverRemark:"", requestDate:"", name:"Rider Name (Selina 2)", email:"rider.name.selina@gmail.com", mobile:"+60137778222", 
					address:"Unit 2A-5B, KL Condo, Petaling Jaya, Selangor", desc:"I am willing to pay RM2 for the trip.",photo:"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"}			
			];
			deferred.resolve(tripRiders);
			return deferred.promise;
		
			/* Uncomment this to test the web service
            var deferred = $q.defer();
			
			Azureservice.invokeApi('trip/riders', {
					method: 'POST',
					body: {	'tripId': tripId
							}
				})
				.then(function(response) {
					console.log('Response object.' + response);
					var result = {};
					if (response.status == 'OK') {
						result = response.result;
						console.log('getTripRiders response.status OK:' + result);
					} else {
					
					}
					deferred.resolve(result);
				}, function(err) {
					var xhr = err.request;
					var msg = err.toString() + '. ' + xhr.responseText;
					console.error(err);
					deferred.reject(msg);
				});
			
			return deferred.promise;
			*/
        },		
		requestTrip : function() {
            var deferred = $q.defer();
			Azureservice.invokeApi('trip/request', {
					method: 'POST',
					body: {	'userId': Azureservice.getCurrentUser().userId, 
							'trip': '12345678'}
				})
				.then(function(response) {
					console.log('Response object.' + response);
					var result = {};
					if (response.status == 'OK') {
						result = response.result;
						console.log('response.status OK:' + result);
					} else {
					
					}
					deferred.resolve(result);
				}, function(err) {
					console.error(err);
					deferred.reject(err);
				});
			
			return deferred.promise;
		
		},		
		cancelRequest : function() {
			// invokeApi('trip/cancel'
		},
		acceptTrip : function() {
			// invokeApi('trip/accept'
		},
		rejectTrip : function() {
			// invokeApi('trip/reject'
		},
        getMyOffers : function(){
			// retrieve driver's offers
            var deferred = $q.defer();
			// old api: getmyoffers
			Azureservice.invokeApi('offer/list', {
					method: 'POST',
					body: {	'userId': Azureservice.getCurrentUser().userId, 
							'startDate': '',
							'status': ''}
				})
				.then(function(response) {
					console.log('Response object.' + response);
					var result = {};
					if (response.status == 'OK') {
						result = response.result;
						console.log('response.status OK:' + result);
					} else {
					
					}
					deferred.resolve(result);
				}, function(err) {
					console.error(err);
					deferred.reject(err);
				});
			
			return deferred.promise;
        },		
        createTrip : function(trip){
			// create an offer or a trip
            var deferred = $q.defer();
			// old api: createTrip
			Azureservice.invokeApi('offer/create', {
					method: 'POST',
					body: {	'tripDate': trip.date,
							'tripTime': trip.time,
							'locFrom': trip.locationFrom,
							'locTo': trip.locationTo,
							'geoFrom': trip.geoFrom,
							'geoTo': trip.geoTo,
							'car': trip.car,
							'carColor': trip.carColor,
							'carPlateNumber': trip.carPlateNumber,
							'seats': trip.seats,
							'carDesc': trip.carDesc}
				})
				.then(function(response) {
					var result = {};
					if (response.status == 'OK') {
						result = response.result;
						console.log('response.status OK:' + result);
					} else {
						var msg = "There is a problem creating your trip.";
						deferred.reject(msg);
					}
					deferred.resolve(result);
				}, function(err) {
					console.error(err);
					deferred.reject(err);
				});
			
			return deferred.promise;
        },
        updateTrip : function(trip){
			// make changes to existing trip
            var deferred = $q.defer();
			Azureservice.invokeApi('updateTrip', {
					method: 'POST',
					body: {	'id': trip.id,
							'status': trip.status,
							'tripDate': trip.date,
							'tripTime': trip.time,
							'locFrom': trip.locationFrom,
							'locTo': trip.locationTo,
							'geoFrom': trip.geoFrom,
							'geoTo': trip.geoTo,
							'car': trip.car,
							'carColor': trip.carColor,
							'carPlateNumber': trip.carPlateNumber,
							'seats': trip.seats,
							'carDesc': trip.carDesc}
				})
				.then(function(response) {
					var result = {};
					if (response.status == 'OK') {
						result = response.result;
					} else {
						var msg = "There is a problem updating your trip.";
						deferred.reject(msg);					
					}
					deferred.resolve(result);
				}, function(err) {
					var xhr = err.request;
					var msg = err.toString() + '. ' + xhr.responseText;
					console.error(err);
					deferred.reject(msg);
				});
			
			return deferred.promise;
        },
		deleteTrip : function(trip){
			// delete an existing trip
            var deferred = $q.defer();
			// TODO: deleteTrip api
			Azureservice.invokeApi('offer/delete', {
					method: 'POST',
					body: {	'id': trip.id,
						}
				})
				.then(function(response) {
					var result = {};
					if (response.status == 'OK') {
						result = response.result;
						console.log('response.status OK:' + result);
					} else {
						var msg = "There is a problem deleting your trip.";
						deferred.reject(msg);					
					}
					deferred.resolve(result);
				}, function(err) {
					var xhr = err.request;
					var msg = err.toString() + '. ' + xhr.responseText;
					console.error(err);
					deferred.reject(msg);
				});
			
			return deferred.promise;
        }	
	};
}])

.factory('profileSvc', ['$http','Azureservice','$q', function ($http, Azureservice, $q) {

    return {
		activateUser : function(data) {
			var deferred = $q.defer();
			console.log(data);
			// old api: activateuser
			Azureservice.invokeApi('user/activate', {
					method: 'POST',
					body: {'userName': data.username,
							'authToken': data.token}
				})
				.then(function(response) {
					console.log('Response object.' + response);
					var result = null;
					if (response.status == 'OK') {
						result = response.result;
					} else {
						var msg = "There is a problem activating your access.";
						deferred.reject(msg);					
					}
					deferred.resolve(result);
				}, function(err) {
					var xhr = err.request;
					var msg = err.toString() + '. ' + xhr.responseText;
					console.error(err);
					deferred.reject(msg);
				});	
			return deferred.promise;
		},				
		getProfile : function(id) {
			console.log('profileSvc.getProfile: ' + id);
			var deferred = $q.defer();
			// old api: user
			Azureservice.invokeApi('user/profile', {
					method: 'POST',
					body: {'id': id }
				})
				.then(function(response) {
					console.log('Response object.' + response);
					var result = null;
					if (response.status == 'OK') {
						result = response.result;
					} else {
						// no error
					}
					deferred.resolve(result);
				}, function(err) {
					var xhr = err.request;
					var msg = err.toString() + '. ' + xhr.responseText;
					console.error(err);
					deferred.reject(msg);
				});	
			return deferred.promise;
		},	
        getRiderProfile : function(id){
			var riders = [
				{id:1, name:"Rider Name (Jack)", email:"rider.name.jack@gmail.com", mobile:"+60137778888", 
					address:"Unit 2A/10, ABC Condo, Petaling Jaya, Selangor", desc:"I prefer female driver."},
				{id:2, name:"Rider Name (Wayne)", email:"rider.name.wayne@gmail.com", mobile:"+60137778111", 
					address:"Unit 44/1, Generic Condo, Petaling Jaya, Selangor", desc:"No preference."},
				{id:3, name:"Rider Name (Selina)", email:"rider.name.selina@gmail.com", mobile:"+60137778222", 
					address:"Unit 2A-5B, KL Condo, Petaling Jaya, Selangor", desc:"I am willing to pay RM2 for the trip."}			
			];
			
			var profile = {id:1, name:"Rider Name (Jack)", email:"rider.name.jack@gmail.com", mobile:"+60137778888", 
					address:"Unit 2A/10, ABC Condo, Petaling Jaya, Selangor", desc:"I prefer female driver."};
			for (var i in riders) {
				if (riders[i].id == id) {
					profile = riders[i];
				}
			}
					
			return profile;
        },
		getRiders : function(){
			var riders = [
				{id:1, name:"Rider Name (Jack)", email:"rider.name.jack@gmail.com", mobile:"+60137778888", 
					address:"Unit 2A/10, ABC Condo, Petaling Jaya, Selangor", desc:"I prefer female driver."},
				{id:2, name:"Rider Name (Wayne)", email:"rider.name.wayne@gmail.com", mobile:"+60137778111", 
					address:"Unit 44/1, Generic Condo, Petaling Jaya, Selangor", desc:"No preference."},
				{id:3, name:"Rider Name (Selina)", email:"rider.name.selina@gmail.com", mobile:"+60137778222", 
					address:"Unit 2A-5B, KL Condo, Petaling Jaya, Selangor", desc:"I am willing to pay RM2 for the trip."}			
			];
			
			return riders;
		}
	};
}])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('productSvc', ['$http', function ($http) {
    var apiEndpoint = "https://productsapp20160224021547.azurewebsites.net";

    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With']; 

    return {
        getProducts : function(){
            return $http.get(apiEndpoint + '/api/products');
        },
        getProduct : function(id){
            return $http.get(apiEndpoint + '/api/products/' + id);
        },
        postProduct : function(item){
            return $http.post(apiEndpoint + '/api/products', item);
        },
        putProduct : function(item){
            return $http.put(apiEndpoint + '/api/products/', item);
        },
        deleteProduct : function(id){
            return $http({
                method: 'DELETE',
                url: apiEndpoint + '/api/products/' + id
            });
        }
    };
}])

.factory('profileModal', ['profileModalService', function(profileModalService){
	// All modals are here

	var service = {
		showProfile: showProfile
	};
	return service;

	// 	function name: showProfile 
	//	parameters: {
	// 		userId: Driver or Rider azureId
	// 		userPref: String (Driver or Rider)
	// 	}
	function showProfile(parameters) {
		// console.log('parameters: '+ parameters.userId +' '+ parameters.userPref);
		return profileModalService.show('ProfileCtrl', parameters);
	}

}])
.factory('profileModalService', ['$ionicModal', '$rootScope', '$q', '$injector', '$controller', '$localstorage', 'profileSvc', function($ionicModal, $rootScope, $q, $injector, $controller, $localstorage, profileSvc){
	return {
		show: show
	}
	// var templateURL = 'templates/userProfile.html'; // it gives error.. check why?
		function show(controller, parameters, options) {

			var deferred = $q.defer(),
			controllerInstance,
			modalScope = $rootScope.$new(),
			thisScopeId = modalScope.$id,
			defaultOptions = {
				animation: 'slide-in-up',
				focusFirstInput: false,
				backdropClickToClose: true,
				hardwareBackButtonClose: true,
				modalCallback: null
			};
			options = angular.extend({}, defaultOptions, options);

			var userDetails;
			profileSvc.getProfile(parameters.userId).then(function(result){
				if (result) {					
					userDetails = result;

					$ionicModal.fromTemplateUrl('templates/userProfile.html', {
						scope: modalScope,
						animation: options.animation,
						focusFirstInput: options.focusFirstInput,
						backdropClickToClose: options.backdropClickToClose,
						hardwareBackButtonClose: options.hardwareBackButtonClose
					}).then(function (modal){
							modalScope.modal = modal;

							modalScope.openModal = function(){
								modalScope.modal.show();
							};

							modalScope.closeModal = function(){
								// deferred.resolve(userDetails);
								modalScope.modal.hide();
							};

							modalScope.$on('modal.hidden', function(thisModal){
								if (thisModal.currentScope) {
									var modalScopeId = thisModal.currentScope.$id;
									if (thisScopeId === modalScopeId) {
										// deferred.resolve(userDetails);
										_cleanup(thisModal.currentScope);
									}
								}
							});

							//Invoking the controller
							// add to parramers the user information
							parameters.user = userDetails;
							var locals = { '$scope': modalScope, 'parameters': parameters };
							ctrlInstance = $controller(controller, locals);
							ctrlInstance.openModal = modalScope.openModal;
							ctrlInstance.closeModal = modalScope.closeModal;

							modalScope.modal.show().then(function(){
								deferred.resolve(userDetails);
							});

					        		// TODO: 24/03/2016: Check if option is function
					        		//angular.isFunction();
		        	});
					 

				} else {
					console.log('Mission user. AzureId not registered yet');
					deferred.resolve(null);
				}
				// return deferred.promise;
			}).catch(function(){
				var err = 'Error calling profileSvc.getProfile';
				modalScope.error = err;
				deferred.reject(err);
								// userDetails = '';
			});
			
			
			// TODO: 24/03/2016: uncomment profileSvc call up lines to retrive user info using id
			// the line below is for testing purpose only
			// userDetails = $localstorage.getObject('profile');
			return deferred.promise;
		}

		function _cleanup(scope) {
			scope.$destroy();
			if (scope.modal) {
				scope.modal.remove();
			}
		}

}])

;

