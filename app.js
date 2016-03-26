var express = require ('express');

var app = express();

var path = require ('path');
 
var http = require ('http').Server (app);

var io = require ('socket.io')(http);
 
var routes = require ('./routes/routes');

var handlebars = require ('handlebars');


//configuration 

app.set ('view engine', 'handlebars');
app.set ('views', path.join (__dirname, 'views')); 
 

//middlewares

app.use ( routes );
app.use ( express.static ( path.join (__dirname, 'public') ) );

//routes

var usersOnline = [], nicknames = [];


io.on ( 'connect', function (socket) {

	console.log ('new user connected');

	usersOnline.push (socket);

	socket.on ( 'nickname', function (d, fn) { 

		socket.nickname = d;  

		nicknames = usersOnline.map ( function (userSocket, key) {

 
			return userSocket.nickname;


		});

		console.log (nicknames);

		fn( nicknames );

		io.emit ('newUsers', nicknames);

		socket.join ('room1');

		console.log (socket.id);

		socket.to ('room1').emit ( 'newUserJoinedRoom', { newUser: socket.nickname } );

	} );

	socket.on ('disconnect', function (socket) {

		usersOnline.splice ( usersOnline.indexOf (socket), 1 );	

		io.emit ('newUsers', nicknames);

	});

	socket.on ('send', function (d) {

		//console.log (d);

		socket.to ('room1').emit ('newMsg', { msg: d, userSent: socket.nickname });

	});


	socket.on ('sendImg', function (d) {

		socket.to ('room1').emit ('newImg', { userSent: socket.nickname, data: d });

	} );


} );
 




http.listen (3000, function () {

	console.log ('server started, listening on port 3000');

});