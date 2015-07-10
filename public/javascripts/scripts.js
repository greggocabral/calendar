// FUNCIONES PARA SETEAR LOS ESTADOS GENERALES DE VISTA
function showLogin(){

	$('.tabla-casilleros').css('opacity', '0.2');
	$('.header').css('opacity', '0.2');
	$('#dialogo-new-user').css('visibility', 'hidden');
	$('#dialogo-mensaje').css('visibility', 'hidden');
	$('#dialogo-login').css('visibility', 'visible');
	$('#dialogo-login').css('opacity', '1');
	$('#texto-input-user-login').focus();	
}

function showCreateNewUser(){	
	$('#texto-input-new-user').val('');
	$('#password-input-new-user').val('');
	$('#password-repeat-new-user').val('');	
	$('#dialogo-login').css('visibility', 'hidden');
	$('#dialogo-mensaje').css('visibility', 'hidden');
	$('#dialogo-new-user').css('visibility', 'visible');
	$('#dialogo-new-user').css('opacity', '1');	
	$('#texto-input-new-user').focus();
}

function showCalendar(){
	$('#dialogo-new-user').css('visibility', 'hidden');
	$('#dialogo-mensaje').css('visibility', 'hidden');
	$('#dialogo-evento').css('visibility', 'hidden');
	$('#dialogo-login').css('visibility', 'hidden');
	$('.tabla-casilleros').css('opacity', '1');
	$('.header').css('opacity', '1');
}

function showMessage(message, functionOK){
	$('#dialogo-new-user').css('opacity', '0.2');
	$('#dialogo-login').css('opacity', '0.2');	
	$('#dialogo-mensaje').css('visibility', 'visible');
	$('#titulo-dialogo-mensaje').html('<h5>'+message+'</h5>');
	$( "#boton-ok-dialogo-mensaje" ).click(function() {
		functionOK();
	});

}

function showCreateNewEvent(){
	$('#dialogo-evento').css('visibility', 'visible');
	$('.tabla-casilleros').css('opacity', '0.2');
	$('.header').css('opacity', '0.2');
	$('#texto-input-evento').val('');
	$('#texto-input-evento').focus();
	
}



$(document).ready(function() {

	var events = 'inicial';

	// LOGIN DEL USUARIO
	showLogin();
	

	$("#boton-submit-dialogo-login").click(function() {
			var userid = $('#texto-input-user-login').val();
			var password = $('#password-input-user-login').val();
	    	//check user and password y de ahi llamar a loaduser
	    	validateUser(userid, password);
		});

	// $("#dialogo-login").keyup(function(e) {
	// 		if (e.which == 13) $("#boton-submit-dialogo-login").click();     // enter
	// 	});

	// CREAR NUEVO USUARIO
	$( "#boton-new-user-dialogo-login" ).click(function() {
			showCreateNewUser();
		});

	$( "#boton-submit-dialogo-new-user" ).click(function() {
			//LEVANTAR DATA DE LOS CASILLEROS
			var userid = $('#texto-input-new-user').val();
			var password = $('#password-input-new-user').val();
			var rpassword = $('#password-repeat-new-user').val();

			if (userid != ''){
				if (password != ''){
					if (password === rpassword){
						console.log ('sent to check database');
						createUser(userid, password);	
					}
					else {
						showMessage('Passwords must be the same', showCreateNewUser);
					}
			
				} 
				else { 
					showMessage('Input a password', showCreateNewUser);
				}
			}
			else {
				showMessage('Input a username', showCreateNewUser);

			}	
		});

	$( "#boton-cerrar-dialogo-new-user" ).click(function() {
	    	showLogin();
	});

});


function createUser(userid, pass){
	$.post("/create-user", {userID: userid, password: pass}, function (userCreateOK) {
		if (userCreateOK === 'ok'){
			showMessage('User created', showLogin);
		}
		else {
			showMessage('Username already taken', showCreateNewUser);
		}
	});	
}

function validateUser(userid, pass){
	$.get("/validate-user", {userID: userid, password: pass}, function (userOk) {
		if (userOk === 'ok'){
			console.log('password ok');
			showCalendar();
			loadUser(userid);
		}
		else {
			showMessage('Wrong username-password combination', showLogin);
		}

	});
}

function loadUser(userid){

	$('#user-header').html(userid);
	// PEDIR CON UN GET A LA RUTA traer-eventos TODOS LOS EVENTOS DE EL USUARIO
	$.get("/traer-eventos", {userID: userid}, function (data) {
		events = data;
		// RENDERIZAR CALENDARIO VACIO CADA VEZ QUE SE CARGA LA PAGINA (ESTATICO)
		for (var s=0; s<52; s++){ //52
			var id = "semana"+s;
			$('.tabla-casilleros').append('<div id="'+id+'" class="row"></div>');

			$("#semana"+s).append('<div class="col-n-semana casillero-semana"> <h5>'+ s + '</h5></div>');

			for (var i=1+s*7; i<8+s*7; i++){
			 		var dia = moment().startOf('week').add(i,"days").format("D");
			 		var mes = Number(moment().startOf('week').add(i,"days").format("M"));
			 		var fullDate = moment().startOf('week').add(i,"days").format("DD-MM-YYYY");

			 		var isDayInThePast = moment().diff(moment().startOf('week').add(i,"days"), 'days')>0; 
			 		var isDayToday =  (moment().format("DD-MM-YYYY") == fullDate);
			 		var isDayEven = (mes % 2 == 0);

			 		//fecha identificacion del casillero
			 		var dia_id = "" + fullDate;
			 		//clase para dar formato al casillero dia, cambiando en funcion de paridad de mes y si es un dia del pasado
			 		var dia_class = (isDayToday? "dia-hoy " : (isDayInThePast? "dia-pasado ":(isDayEven? "dia-mes-par " : ""))) +' col-xs-2 casillero-dia'; 
			 		//texto a incorporar los dias 01 de cada mes. si no es 01, vale ""
			 		var dia_texto_mes = (dia == 01 ? " " + moment().startOf('week').add(i,"days").format("MMMM") : ""); 
			 		//tasks del dia a incorporar. si no hay tasks vale ""
			 		var dia_data = "";
			 		if (fullDate in events) { 
			 			for (var j = 0; j < events[fullDate].length; j++) {
			 				dia_data += "<h5 class='task'>" + events[fullDate][j] + "</h5>";
			 				console.log(events[fullDate][j]);
			 			};
			 			
			 		};
		 			// append del casillero dia en cuestion
		 			$("#semana"+s).append('<div id="'+ dia_id +'" class="'+ dia_class +'"> <h5>'+ dia +' ' + dia_texto_mes + dia_data + '</h5></div>');

		 		
			}
			$("#semana"+s).append('<div class="break"></div>');
		}

		generadordeventos(); 
                    
     });

}


function generadordeventos(){

	 var fechadelevento = "";

	$(".highlighting-text").click(function() {
		$( document.body ).animate({
				scrollTop: 0
		},400);
	});

	$( ".casillero-dia" ).click(function() {
  		var $fecha = $(this)[0].id;
  		fechadelevento = $fecha;
    	$('#fecha-dialogo-evento').html('<h3>Date: '+$fecha+'</h3>');
    	showCreateNewEvent();
	});

	$("#dialogo-evento").keyup(function(e) {
	// 	if (e.which == 13) $("#boton-submit-dialogo-evento").click();     // enter
	if (e.which == 27) $("#boton-cerrar-dialogo-evento").click();   // esc
	});
	
	$( "#boton-cerrar-dialogo-evento" ).click(function() {
    	showCalendar();
	});

	$( "#boton-submit-dialogo-evento" ).click(function() {
    	showCalendar();
		var tarea = $('#texto-input-evento').val();
		var userid = $('#user-header').text();
		console.log(tarea);
		$.post( "/postear-eventos", { userID: userid, date: fechadelevento, summary: tarea } );
		$("#"+fechadelevento).append('<h5 class="task">'+tarea+'</h5>');
		borrar();
	});

	

	var borrar = function() {
		$(".task").click(function(e) {
			e.stopPropagation();
			// eliminar de la DB
			var $fecha = $(this).parent()[0].id;
	  		fechadelevento = $fecha;
	  		var $tarea = $(this)[0].innerHTML;
	  		tareadelevento = $tarea;
			$.post( "/borrar-eventos", { date: fechadelevento, summary: tareadelevento });
			// eliminar de la vista
			$(this).remove();
		}
	)};

	borrar();

}	






           
