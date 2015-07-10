var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var fs = require('fs');

// Connection URL
var url = (process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/') + 'plansandbreakfast';
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

MongoClient.connect(url, function(err, db){
	router.get('/', function(req, res, next) {
		res.render('index', { title: 'Putazo' });
	});

	/* GET home page. */
	router.get('/traer-eventos?*', function(req, res) {
		userid = req.param("userID");
		console.log('llego pedido de cliente ' + userid);
  	// próximo paso: filtrar los eventos para cierto user

  	// MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		console.log("Connected correctly to server");
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

  	// });
});

	router.post('/postear-eventos', function(req, res) {
		console.log('llego envío de cliente');
		console.log(req.body);
		var eventoPosteado = req.body;

		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			console.log("Connected correctly to server");
			postEvents(db, eventoPosteado, function (){
				db.close();
			});

		});

	});

	router.post('/borrar-eventos', function(req, res) {
		console.log('llego pedido de borrado de cliente');
		console.log(req.body);
		var eventoaBorrar = req.body;

		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			console.log("Connected correctly to server");
			deleteEvents(db, eventoaBorrar, function (){
				db.close();
			});

		});

	});
	



})



/* GET home page. */


module.exports = router;
