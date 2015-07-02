$(document).ready(function() {

	var dataTest = 'inicial';
	// PEDIR CON UN GET A LA RUTA traer-eventos TODOS LOS EVENTOS DE EL USUARIO
	$.get("/traer-eventos", function (data) {

		console.log(typeof(data));
		dataTest = data.toString();

		// RENDERIZAR CALENDARIO VACIO CADA VEZ QUE SE CARGA LA PAGINA (ESTATICO)
		for (var s=1; s<52; s++){
			var id = "semana"+s;
			$('.tabla-casilleros').append('<div id="'+id+'" class="row"></div>');

			for (var i=1+(s-1)*7; i<8+(s-1)*7; i++){
			 		var dia = moment().startOf('week').add(i,"days").format("DD");
			 		var month = moment().startOf('week').add(i,"days").format("MM");
			 		var year = moment().startOf('week').add(i,"days").format("YYYY");

			 		if (Number(moment().startOf('week').add(i,"days").format("M")) % 2 == 0)
			 		{
			 			if (dia == 01) {$("#semana"+s).append('<div id="'+dia+'-'+month+'-'+year+'" class="dia-mes-par col-xs-2 casillero-dia"><h5>'+dia +" "+ moment().startOf('week').add(i,"days").format("MMMM").substring(0, 3) + moment().startOf('week').add(i,"days").format("YY")+'</h5></div>')}
			 			else{$("#semana"+s).append('<div id="'+dia+'-'+month+'-'+year+'" class="dia-mes-par col-xs-2 casillero-dia"><h5>'+dia+'</h5></div>');}
			 		}

			 		else
			 		{
			 			if (dia == 01) {$("#semana"+s).append('<div id="'+dia+'-'+month+'-'+year+'" class=" col-xs-2 casillero-dia"><h5>'+dia +" "+ moment().startOf('week').add(i,"days").format("MMMM").substring(0, 3) + moment().startOf('week').add(i,"days").format("YY")+'</h5></div>')}
			 			else{$("#semana"+s).append('<div id="'+dia+'-'+month+'-'+year+'" class="col-xs-2 casillero-dia"><h5>'+dia+'</h5> <p>'+dataTest+' </p> </div>');}
			 		}		  		
			}
		}
     
        $( "#01-07-2015" ).click(function() {
	  		var $fecha = $(this)[0].id;
	  		fechadelevento = $fecha;
	    	$('#fecha-dialogo-evento').html('<h3>Date: '+$fecha+'</h3>');
	    	$('#dialogo-evento').css('visibility', 'visible');
	    	$('.tabla-casilleros').css('opacity', '0.2');
	    	$('.header').css('opacity', '0.2');
	    	$('#texto-evento').focus();
		});           
                    
     });

	


	
	function generadordeventos(){

		 var fechadelevento = "";

		$( ".casillero-dia" ).click(function() {
	  		var $fecha = $(this)[0].id;
	  		fechadelevento = $fecha;
	    	$('#fecha-dialogo-evento').html('<h3>Date: '+$fecha+'</h3>');
	    	$('#dialogo-evento').css('visibility', 'visible');
	    	$('.tabla-casilleros').css('opacity', '0.2');
	    	$('.header').css('opacity', '0.2');
	    	$('#texto-evento').focus();
		});

		$("#dialogo-evento").keyup(function(e) {
			if (e.which == 13) $("#submit-dialogo-evento").click();     // enter
			if (e.which == 27) $("#cerrar-dialogo-evento").click();   // esc
		});
		
		$( "#cerrar-dialogo-evento" ).click(function() {
	    	$('#dialogo-evento').css('visibility', 'hidden');
	    	$('.tabla-casilleros').css('opacity', '1');
	    	$('.header').css('opacity', '1');
	    	$('#texto-evento').html('');
		});

		$( "#submit-dialogo-evento" ).click(function() {
	    	$('#dialogo-evento').css('visibility', 'hidden');
	    	$('.tabla-casilleros').css('opacity', '1');
	    	$('.header').css('opacity', '1');
			console.log(fechadelevento);
			var tarea = $('#texto-evento').text();
			console.log(tarea);
			$('#texto-evento').html('');
			$("#"+fechadelevento).append('<h5>'+tarea+'</h5>');
		});
	}	
	

	generadordeventos(); 

	// PEDIR BASE DE DATOS EN JSON A SERVER CON HTTP GET
	// MOSTRAR EN CALENDARIO LOS EVENTOS LEVANTADOS DE LA BASE DE DATOS



	//DETECTAR CLICKS SOBRE CASILLEROS DIV DE DIA QUE VISUALICE UN MICROFORM 
	//AL ACEPTAR USUARIO, HACE UN HTTP POST CON EL JSON DE LA DATA DEL EVENTO
 

});



           
