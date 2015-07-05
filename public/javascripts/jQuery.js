$(document).ready(function() {

	var dataTest = 'inicial';
	// PEDIR CON UN GET A LA RUTA traer-eventos TODOS LOS EVENTOS DE EL USUARIO
	$.get("/traer-eventos", function (data) {

		console.log(data);

		dataTest = data;

		// RENDERIZAR CALENDARIO VACIO CADA VEZ QUE SE CARGA LA PAGINA (ESTATICO)
		for (var s=1; s<52; s++){
			var id = "semana"+s;
			$('.tabla-casilleros').append('<div id="'+id+'" class="row"></div>');

			for (var i=1+(s-1)*7; i<8+(s-1)*7; i++){
			 		var dia = moment().startOf('week').add(i,"days").format("DD");
			 		var month = moment().startOf('week').add(i,"days").format("MM");
			 		var year = moment().startOf('week').add(i,"days").format("YYYY");
			 		var fullDate = dia + '-' + month + '-' + year;

			 		var mes = Number(moment().startOf('week').add(i,"days").format("M"));

			 		//fecha identificacion del casillero
			 		var dia_id = "" + fullDate;
			 		//clase para dar formato al casillero dia, cambiando en funcion de paridad de mes 
			 		var dia_class = (mes % 2 == 0 ? "dia-mes-par " : "") +' col-xs-2 casillero-dia'; 
			 		//texto a incorporar los dias 01 de cada mes. si no es 01, vale ""
			 		var dia_texto_mes = (dia == 01 ? " " + moment().startOf('week').add(i,"days").format("MMMM").substring(0, 3) 
		 												+ moment().startOf('week').add(i,"days").format("YY") : ""); 
			 		//tasks del dia a incorporar. si no hay tasks vale ""
			 		var dia_data = (typeof(dataTest[fullDate])!="undefined" ? "<h5 class='task'>" + dataTest[fullDate] + "</h5>" : "");
		 			// append del casillero dia en cuestion
		 			$("#semana"+s).append('<div id="'+ dia_id +'" class="'+ dia_class +'"> <h5>'+ dia +' ' + dia_texto_mes + dia_data + '</div>');
		 		
			}
		}

		// $(" div[id^='02-'] > h5:first-child").append("año");
     
		generadordeventos(); 
                    
     });

	


	
	function generadordeventos(){

		 var fechadelevento = "";

		$(".highlighting-text").click(function() {
			$(window).scrollTop(0);
		});

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
			$.post( "/postear-eventos", { date: fechadelevento, summary: tarea } );
			$('#texto-evento').html('');
			$("#"+fechadelevento).append('<h5 class="task">'+tarea+'</h5>');
			borrar();
		});

		var borrar = function() {$(".task").click(function(e) {
		// $('.task').on('click', function(e){
			e.stopPropagation();
			// eliminar de la DB
			var $fecha = $(this).parent()[0].id;
	  		fechadelevento = $fecha;
	  		var $tarea = $(this)[0].innerHTML;
	  		tareadelevento = $tarea;
			$.post( "/borrar-eventos", { date: fechadelevento, summary: tareadelevento });
			// eliminar de la vista
			$(this).remove();
		})};

		borrar();

	}	

});



           
