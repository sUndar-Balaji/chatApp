var express = require ('express');

var path = require ('path');

var routes = express.Router();

var http = require ('http').Server (express());

var io = require ('socket.io')(http);



routes.get ('/', function (req, res) {

	console.log (89); 

	res.sendFile (path.dirname(require.main.filename)+'/index.htm');

});


module.exports  = routes;