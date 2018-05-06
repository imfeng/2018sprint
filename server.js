var express = require('express'),
  app = express(),
  port = process.env.PORT || 80,
  bodyParser = require('body-parser');

/* CORS  */
var cors = require('cors')
var whitelist = ['local', 'http://iintw.com','http://52days.big-cause.com', 'http://127.0.0.1', 'http://localhost','http://big-cause.com'];
var corsOptionsDelegate = function (req, callback) {
  let from = req.header('Origin') || 'local';
  var corsOptions;
  if (whitelist.indexOf(from) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    console.log('>>> CORS: Reject!!!');
    corsOptions = { origin: false } // disable CORS for this request
  }

  corsOptions = { origin: true }; // 允許全部
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/view',express.static(__dirname + '/view'));
app.use('/',express.static(__dirname + '/dist'));

var routes = require('./api/routes/todoListRoutes'); //importing route
routes(app); //register the route

app.listen(port,'0.0.0.0');

console.log('>>> RUN: todo list RESTful API server started on: ' + port);
