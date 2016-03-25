exports.register = function (api) {
    api.post('profile', getProfile);
    api.post('activate', activateUser);
}

function getProfile(request, response) {
    var id = request.body.id;   // handle scenario where caller pass in id
    var userId = request.user.userId;
    var mssql = request.service.mssql;
    if (id) {
        userId = id;
    }
    var sql = "SELECT * FROM [User] a LEFT OUTER JOIN Car b " +
            " ON a.userName=b.userName " + 
            "WHERE a.azureId=?";
    mssql.query(sql, [userId],
         {
            success:function(results) 
            {
                if (results.length > 0) 
                {
                    response.send(statusCodes.OK, {status:'OK', result:  results[0]});   
                } else {
                    response.send(statusCodes.OK, {status:'FAIL', result:  { message:'User not found.'}});
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

function activateUser(request, response) {
    var userName = request.body.userName;
    var authToken = request.body.authToken;
    var userId = request.user.userId;
    var mssql = request.service.mssql;
    var sql = "UPDATE [User] SET azureId = ?, activated = 1 WHERE userName=? AND activationToken=?;" +
            " SELECT * FROM [User] WHERE userName=? AND activationToken=?";
    var firstResponse = true;            
    mssql.query(sql, [userId,userName,authToken,userName,authToken],
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
                        response.send(statusCodes.OK, {status:'FAIL', result:null});                        
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


exports.post = function(request, response) {
    response.send(statusCodes.OK, {status:'OK', result:  null});
};

exports.get = function(request, response) {
    response.send(statusCodes.OK, {status:'OK', result:  null});
};