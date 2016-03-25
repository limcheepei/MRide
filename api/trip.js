exports.register = function (api) {
    api.post('search', searchTrip);
	api.post('booked', getBookedTrip);
    api.post('request', requestTrip);
    api.post('cancel', cancelTrip);
    api.post('accept', acceptTrip);
    api.post('reject', rejectTrip);
    api.post('riders', getRiders);
}

function searchTrip(request, response) {
    var tripDate = request.body.tripDate;
    var locationFrom = request.body.locationFrom;
    var userId = request.user.userId;
    var mssql = request.service.mssql;

    var sql = "SELECT a.*, (SELECT COUNT(*) FROM TripRequest b WHERE b.tripId=a.id AND b.requesterId=?) as booked " +
                " FROM Trip a WHERE a.date>=? ORDER BY a.date ASC";
    mssql.query(sql, [userId,tripDate],
         {
            success:function(results) 
            {
                if (results.length > 0) 
                {
                    var item = results[0];
                    response.send(statusCodes.OK, {status:'OK', result:  results});   
                } else {
                    response.send(statusCodes.OK, {status:'FAIL', result:  '0 trip found.'});
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

function getBookedTrip(request, response) {
	var tripDate = request.body.tripDate;
    var userId = request.user.userId;
    var mssql = request.service.mssql;

    var sql = "SELECT *, 1 as booked FROM Trip a WHERE a.date>=? AND EXISTS (SELECT 1 FROM TripRequest b WHERE b.requesterId=? AND b.tripId = a.id) ORDER BY a.date ASC";
    mssql.query(sql, [tripDate, userId],
         {
            success:function(results) 
            {
                if (results.length > 0) 
                {
                    var item = results[0];
                    response.send(statusCodes.OK, {status:'OK', result:  results});   
                } else {
                    response.send(statusCodes.OK, {status:'FAIL', result:  '0 trip found.'});
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
 
function requestTrip(req, res) {
    console.log('requestTrip');
    res.send(statusCodes.OK, {status:'OK', result:'requestTrip'});
}    

function cancelTrip(req, res) {
    console.log('cancelTrip');
    res.send(statusCodes.OK, {status:'OK', result:'cancelTrip'});
}    


function acceptTrip(req, res) {
    console.log('acceptTrip');
    res.send(statusCodes.OK, {status:'OK', result:'acceptTrip'});
}

function rejectTrip(req, res) {
    console.log('rejectTrip');
    res.send(statusCodes.OK, {status:'OK', result:'rejectTrip'});
}     

function getRiders(req, res) {
    console.log('getRiders');
    res.send(statusCodes.OK, {status:'OK', result:'getRiders'});
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