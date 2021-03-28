const express = require('express');

const app = express(); //create an express application

const PORT = process.env.PORT || 3000; //establish the port the server will be listening on

function authenticateFunc (request, response, next) {
    console.log("CHECKING CREDENTIALS");
    let credentials = request.get('AuthToken');
    credentials = credentials.substr(credentials.indexOf(' ') + 1);
    credentials = Buffer.from(credentials, 'base64').toString('binary');

    credentials = credentials.split(':');
    /* Faux Database check of credentials */
    if (credentials[0] === 'default' && credentials[1] === '123') {
        next();
    } else {
        response.status(401).end();
    }
}

//Database Initialization and Request
app.get('/', function (request, response) {
    const sql = require("mssql");

    var config = {
        user: 'test',
        password: 'test',
        server: 'localhost',
        database: 'Wishr User Database'
    };

    sql.connect(config, function(error) {
        if (error) console.log(error);

        var databaseRequest = new sql.Request();

        databaseRequest.query('select * from Userlist', function(error, recordset) {
            if (error) console.log(error);

            response.send(recordset);
        });
    });
});

//NPM Server Communication
app.get('/login', authenticateFunc, (request, response) => {
    response.status(200).end(); //Ok response on succesful login
});

app.get('/logout', authenticateFunc, (request, response) => {
    response.status(200).end(); //Ok response on succesful logout
});

app.use((request, response, next) => {
    response.status(404).send('Route not found.'); //404 response if route unavailable 
});

app.use((error, request, response, next) => {
    response.status(error.status || 500).send(error.message || "Problem."); //500 error response 
});

const server = app.listen(PORT, function() {
    console.log(`Server is up and running on port ${server.address().port}`);
});