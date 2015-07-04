var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var fs = require('fs');

// Connection URL
var url = 'mongodb://localhost:27017/contcal';
// Retrieve Events
var retrieveEvents = function(db, callback) {
  // Get the events collection
  var collection = db.collection('events');
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(JSON.stringify(docs));
    // console.dir(JSON.stringify(docs[0]));
	callback(docs);
  });
}



// Post Events
var postEvents = function(db, eventDate, eventSummary, callback) {
  // Get the events collection
  var collection = db.collection('events');
  collection.insert([{"date" : eventDate, "summary": eventSummary}], function(err, result) {
  // collection.update({ a : 2 }, { $set: { b : 1 } }, function(err, result) {
  // collection.remove( {a : 3}, function(err, result) {
    assert.equal(err, null);
    // assert.equal(1, result.result.n);
    // assert.equal(3, result.ops.length);
    console.log("posteado el evento");
    callback(result);
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Putazo' });
});

/* GET home page. */
router.get('/traer-eventos', function(req, res) {
  	console.log('llego pedido de cliente');

  	// devolver info al front 
  	// leer y enviar events.json
  	// falta coordinar los formatos de envío y recepción para que 
  	//   sea práctico insertar los eventos en los respectivos casillero-dia
  	// supongo que 
  	// próximo paso: filtrar los eventos para cierto user

	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server");
	  retrieveEvents(db, function (eventsDB){

	  	var eventsOK = {};

		// reordenar los eventsOK en el formato que "debe" recibir el cliente

		// 1. recorrer todos los eventos de eventsDB
		eventsDB.forEach(function(cadaevento){
			eventsOK[cadaevento.date] = cadaevento.summary;
		});
		// 2. para cada evento, genero en dataTest una key con la fecha y value con el summary




		res.contentType('application/json');
		res.end(JSON.stringify(eventsOK));


		db.close();
	  });

	});

		dataTest = {
			"03-07-2015": "ir al super",
			"04-07-2015": "futbol",
			"10-07-2015": "lavar ropa"
		};

		/*res.contentType('application/json');
		res.end(JSON.stringify(dataTest));*/
});

router.post('/postear-eventos', function(req, res) {
	console.log('llego envío de cliente');
	console.log(req.data);
});

module.exports = router;
