exports.register = function (api) {
    api.post('create', createOffer);
    api.post('delete', deleteOffer);
    api.post('list', listOffers);
}

function createOffer(request, response) {
    var status = 'active';
    var tripDate = request.body.tripDate;
    var tripTime = request.body.tripTime;
    //console.log(tripDate + ',' + tripTime);  
    var locFrom = request.body.locFrom;
    var locTo = request.body.locTo;
    var geoFrom = request.body.geoFrom.toString();
    var geoTo = request.body.geoTo.toString();
    //console.log('geoFrom:' + geoFrom.toString());
    var car = request.body.car;
    var carColor = request.body.carColor;
    var carPlateNumber = request.body.carPlateNumber;
    var seats = request.body.seats;
    var carDesc = request.body.carDesc;
    var userId = request.user.userId;
    var mssql = request.service.mssql;
    var sql =   "INSERT INTO Trip (driverId, status, [date], time, car, carColor, carPlateNumber, carDesc, seats, seatsAvailable, locationFrom, locationTo, geoFrom, geoTo) " +
                "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?); " +
                "SELECT @@ROWCOUNT as count";
    var firstResponse = true;
    mssql.query(sql, [userId,status,tripDate,tripTime,car,carColor,carPlateNumber,carDesc,seats,seats,locFrom,locTo,geoFrom,geoTo],
         {
            success:function(results) 
            {
                // sql query has 2 statements. So it will respond 2 times.
                if (firstResponse) {
                    // result from the update call, can ignore
                    firstResponse = false;
                } else {
                    if(results.length > 0) {
                        response.send(statusCodes.OK, {status:'OK', result:results[0]});
                    } else {
                        response.send(statusCodes.OK, {status:'FAIL', result:'Fail to create trip.'});                        
                    }
                }                
            },
            error:function(err)
            {
                console.log(err);
                response.send(500, err.message);
            }
         } 
    );    
}    

function deleteOffer(request, response) {
    response.send(statusCodes.OK, { message : 'deleteOffer' });
}

function listOffers(request, response) {
    var startDate = request.body.startDate;
    var status = request.body.status;
    var userId = request.body.userId;
    var mssql = request.service.mssql;
    var sql = "SELECT * FROM Trip WHERE driverId=? ORDER BY date ASC";
    mssql.query(sql, [userId],
         {
            success:function(results) 
            {
                if (results.length > 0) 
                {
                    response.send(statusCodes.OK, {status:'OK', result:  results});   
                } else {
                    response.send(statusCodes.OK, {status:'FAIL', result:  'No result.'});
                }
            },
            error:function(err)
            {
                console.log(err);
                response.send(500, err.message);
            }
         } 
    );   
}

exports.post = function(request, response) {
    // Use "request.service" to access features of your mobile service, e.g.:
    //   var tables = request.service.tables;
    //   var push = request.service.push;

    response.send(statusCodes.OK, { message : 'Hello World!' });
};

exports.get = function(request, response) {
    response.send(statusCodes.OK, { message : 'Hello World!' });
};