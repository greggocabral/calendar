var express = require('express');
var router = express.Router();
var fs = require('fs');

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

	fs.readFile('./events.json', function (err, data) {

		if (err) throw err;

		dataTest = {
			"03-07-2015": "ir al super",
			"04-07-2015": "futbol",
			"10-07-2015": "lavar ropa"
		};

		res.contentType('application/json');
		res.end(JSON.stringify(dataTest));
	});
  	// res.end('wacho');
});

module.exports = router;
