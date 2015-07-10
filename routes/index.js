var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var fs = require('fs');

// Connection URL
var url = (process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/') + 'plansandbreakfast';

// Check for userid 
var checkUser = function(db, userid, callback) {
	var collection = db.collection('users');
	collection.find({userID: userid}).toArray(function(err, docs) {
  		assert.equal(err, null);
  		callback(docs);
  	});
}

var validateUser = function(db, userid, pass, callback) {
	var collection = db.collection('users');
	collection.find({userID: userid, password: pass}).toArray(function(err, docs) {
  		assert.equal(err, null);
  		callback(docs);
  	});
}

var createUser = function(db, user, callback) {
  // Get the events collection
  var collection = db.collection('users');
  collection.insert([user], function(err, result) {
  	assert.equal(err, null);
  	callback(result);
  });
}

// Retrieve Events
var retrieveEvents = function(db, userid, callback) {
  // Get the events collection
  console.log('getting data from '+userid);
  var collection = db.collection('events');
  collection.find({userID: userid}).toArray(function(err, docs) {
  	assert.equal(err, null);
  	callback(docs);
  });
}

// Post Events
var postEvents = function(db, eventoNuevo, callback) {
  // Get the events collection
  var collection = db.collection('events');
  collection.insert([eventoNuevo], function(err, result) {
  	assert.equal(err, null);
  	console.log("posteado el evento");
  	callback(result);
  });
}

// Delete Events
var deleteEvents = function(db, eventoViejo, callback) {
  // Get the events collection
  var collection = db.collection('events');
  collection.remove(eventoViejo, function(err, result) {
  	assert.equal(err, null);
  	console.log("borrado el evento");
  	callback(result);
  });
}

// CONEXION CON LA MONGO DB
MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	console.log("Connected correctly to db server");
	// UNA VEZ CONECTADO EMPIEZO A ESCUCHAR LO QUE PIDE EL CLIENTE QUE HAGA CON LA DB
  
  	// LOGIN
	router.get('/', function(req, res, next) {
		res.render('index', { title: 'Putazo' });
	});

	// CREAR NUEVO USUARIO
	router.post('/create-user', function(req, res) {
		user = req.body;
		console.log('llego pedido de crear usuario ' + user.userID);
		console.log('contrasena ' + user.password);
  		assert.equal(null, err);

  		// try to load user data
  		checkUser(db, user.userID, function (usersDB){
  			if (usersDB.length != 0){
  				res.end('notOk');
  			}
  			else
  			{
  				console.log('intentando crear usuario');
  				createUser(db, user, function (usersDB){
  					res.end('ok');
  				});
  			}
  		});
  		
	});

	// VALIDAR USUARIO
	router.get('/validate-user?*', function(req, res) {
		userid = req.param("userID");
		pass = req.param("password");
  
  		validateUser(db, userid, pass, function (usersDB){
  			if (usersDB.length != 0){
  				res.end('ok');
  			}
  			else
  			{
  				res.end('notOk');
  			}
  		});
	});

	// CARGAR EVENTOS DE USUARIO LOGUEADO
	router.get('/traer-eventos?*', function(req, res) {
		userid = req.param("userID");
		console.log('llego pedido de cliente ' + userid);
  		assert.equal(null, err);
  		
  		retrieveEvents(db, userid, function (eventsDB){

  			var eventsOK = {};
  			eventsDB.forEach(function(cadaevento){
  				(!(cadaevento.date in eventsOK) ?
  					eventsOK[cadaevento.date] = [cadaevento.summary] :
  					eventsOK[cadaevento.date].push(cadaevento.summary) );
  			});

  			res.contentType('application/json');
  			res.end(JSON.stringify(eventsOK));
  		});
	});

	// AGREGAR EVENTOS A LA BASE DE DATOS
	router.post('/postear-eventos', function(req, res) {
		var eventoPosteado = req.body;
		postEvents(db, eventoPosteado, function (){});

	});

	router.post('/borrar-eventos', function(req, res) {
		console.log('llego pedido de borrado de cliente');
		console.log(req.body);
		var eventoaBorrar = req.body;
		deleteEvents(db, eventoaBorrar, function (){});
	});
	



})



/* GET home page. */


module.exports = router;
