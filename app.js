
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , http = require('http')
  , path = require('path')
  , nstatic = require('node-static')
  , socketio = require('socket.io');

var files = new nstatic.Server('./Public')
var userLog = [];

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

function handler(req, res) {
	console.log("addListener");
	req.addListener('end', function() {
		files.serve(req,res);
	});
}


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/partials/:name', routes.partials)
app.get('/users', api.users);

var server = http.createServer(app);
var io = socketio.listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function (socket) {
	console.log("connection");
	socket.on('send:coords', function(data) {
		userLog.push(data.id);
		var now = new Date();

		api.addUser(data.id,now);
		socket.broadcast.emit('load:coord',data);
	});
});
