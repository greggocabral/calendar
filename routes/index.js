var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Putazo' });
});

/* GET home page. */
router.get('/traer-eventos', function(req, res) {
  	// devolver info al front 
  	console.log('llego pedido de cliente');

  	res.end('wacho');
});

module.exports = router;
