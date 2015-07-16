// FUNCIONES PARA SETEAR LOS ESTADOS GENERALES DE VISTA
function showLogin(){

	$('.tabla-casilleros').css('opacity', '0.2');
	$('.header').css('opacity', '0.2');
	$('#dialogo-new-user').css('visibility', 'hidden');
	$('#dialogo-mensaje').css('visibility', 'hidden');
	$('#dialogo-login').css('visibility', 'visible');
	$('#dialogo-login').css('opacity', '1');
	$('#texto-input-user-login').focus();	

	$("#boton-submit-dialogo-login").unbind().click(function() {
			var userid = $('#texto-input-user-login').val();
			var password = $('#password-input-user-login').val();
	    	//check user and password y de ahi llamar a loaduser
	    	validateUser(userid, password);
		});

	// CREAR NUEVO USUARIO
	$( "#boton-new-user-dialogo-login" ).click(function() {
			showCreateNewUser();
	});

	$("#dialogo-login").keyup(function(e) {
		if (e.which == 13) $("#boton-submit-dialogo-login").click();     // enter
	});

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

	$( "#boton-submit-dialogo-new-user" ).unbind().click(function() {
			//LEVANTAR DATA DE LOS CASILLEROS
			var userid = $('#texto-input-new-user').val();
			var password = $('#password-input-new-user').val();
			var rpassword = $('#password-repeat-new-user').val();

			if (validateText(userid, 1)){
				if (validateText(password, 1)){
					if (password === rpassword){
						createUser(userid, password);	
					}
					else {
						showMessage('Passwords must be the same', showCreateNewUser);
					}
			
				} 
				else { 
					showMessage('Enter a password that contains only letters and numbers', showCreateNewUser);
				}
			}
			else {
				showMessage('Enter a username that contains only letters and numbers', showCreateNewUser);
			}	
		});

	$( "#boton-cerrar-dialogo-new-user" ).click(function() {
	    	showLogin();
	});

	$("#dialogo-new-user").keyup(function(e) {
		if (e.which == 13) $("#boton-submit-dialogo-new-user").click();     // enter
		if (e.which == 27) $("#boton-cerrar-dialogo-new-user").click();   // esc
	});
}

function showCalendar(){
	$('#dialogo-new-user').css('visibility', 'hidden');
	$('#dialogo-select-calendar').css('visibility', 'hidden');
	$('#dialogo-mensaje').css('visibility', 'hidden');
	$('#dialogo-evento').css('visibility', 'hidden');
	$('#dialogo-login').css('visibility', 'hidden');
	$('.tabla-casilleros').css('opacity', '1');
	$('.header').css('opacity', '1');


	$( ".casillero-dia" ).click(function() {
  		var fecha = $(this)[0].id;
    	$('#fecha-dialogo-evento').html('<h3>'+fecha+'</h3>');
    	showCreateNewEvent();
	});

	$('#user-header').unbind().click(function() {
    	showLogin();
	});

	$("#calendar-header" ).unbind().click(function() {
    	showSelectCalendar();
	});

	$(".task").unbind().click(function(e) {
			e.stopPropagation();
			// eliminar de la DB
			var fecha = $(this).parent()[0].id;
	  		var tarea = $(this)[0].innerHTML;
	  		var userid = $('#user-header').text();
	  		var calendarid = $('#calendar-header').text();
	  		var taskDiv = $(this);
			$.post( "/borrar-eventos", { date: fecha, summary: tarea, userID: userid, calendarID: calendarid}, function(borradoOk){
				if (borradoOk == 'borrado'){
					showMessage("Event deleted", showCalendar);
					taskDiv.remove();
				}
				else {
					showMessage("You can only delete events that were created by yourself", showCalendar);
				}
			});
			// eliminar de la vista
	});

	$("#back-to-present").unbind().click(function() {
		$(document.body).animate({
				scrollTop: 0
		},400);
	});

}

function showMessage(message, functionOK){
	$('#dialogo-new-user').css('opacity', '0.2');
	$('#dialogo-login').css('opacity', '0.2');	
	$('#dialogo-evento').css('opacity', '0.2');	
	$('.tabla-casilleros').css('opacity', '0.2');
	$('.header').css('opacity', '0.2');
	$('#dialogo-select-calendar').css('opacity', '0.2');	
	$('#dialogo-mensaje').css('visibility', 'visible');
	$('#titulo-dialogo-mensaje').html('<h5>'+message+'</h5>');
	$( "#boton-ok-dialogo-mensaje" ).click(function() {
		functionOK();
	});

	$("#dialogo-mensaje").keyup(function(e) {
		if (e.which == 13) $("#boton-ok-dialogo-mensaje").click();     // enter
		if (e.which == 27) $("#boton-ok-dialogo-mensaje").click();   // esc
	});

}

function showCreateNewEvent(){
	$('#dialogo-evento').css('visibility', 'visible');
	$('#dialogo-evento').css('opacity', '1');
	$('#dialogo-mensaje').css('visibility', 'hidden');
	$('.tabla-casilleros').css('opacity', '0.2');
	$('.header').css('opacity', '0.2');
	$('#texto-input-evento').val('');
	$('#texto-input-evento').focus();

	$( "#boton-cerrar-dialogo-evento" ).unbind().click(function() {
    	showCalendar();
	});

	$( "#boton-submit-dialogo-evento" ).unbind().click(function() {

    	
		var tarea = $('#texto-input-evento').val();
		var userid = $('#user-header').text();
		var calendarid = $('#calendar-header').text();
		var fecha = $('#fecha-dialogo-evento').text();

		if (validateText(tarea, 2)){
			$.post( "/postear-eventos", {userID: userid, date: fecha, summary: tarea, calendarID: calendarid}, function () {
				$("#"+fecha).append('<h5 class="task">'+tarea+'</h5>');
				showCalendar();
			});
		}
		else {
			showMessage("Enter an event title contains only letters, numerbes, spaces, '-', '.' and ':'", showCreateNewEvent);
		}
	});

	$("#dialogo-evento").keyup(function(e) {
		// if (e.which == 13) $("#boton-submit-dialogo-evento").click();     // enter
		if (e.which == 27) $("#boton-cerrar-dialogo-evento").click();   // esc
	});
	
}

function showSelectCalendar(){
	$('#dialogo-evento').css('visibility', 'hidden');
	$('#dialogo-mensaje').css('visibility', 'hidden');
	$('.tabla-casilleros').css('opacity', '0.2');
	$('.header').css('opacity', '0.2');
	$('#dialogo-select-calendar').css('visibility', 'visible');
	$('#dialogo-select-calendar').css('opacity', '1');

	$("#boton-add-calendar" ).unbind().click(function() {
		var calendarid = $('#name-new-calendar').val();
		var userid = $('#user-header').text();

		
		if (validateText(calendarid, 2)){
			createCalendar(calendarid, userid);
		} 
		else {
			showMessage('Enter a calendar name that contains only letters and numbers', showSelectCalendar);
		}
		
	});

	$("#boton-cerrar-select-calendar").unbind().click(function() {
    	showCalendar();
	});

 	$("#boton-submit-select-calendar" ).unbind().click(function() {
    	var calendarid = $("#calendar-list").val();
    	var userid = $('#user-header').text();

    	
    	loadCalendar(userid, calendarid);
	});


    listCalendars();
}

function validateText(text, option){
	var textRegex;
	if (option === 1){
		textRegex = /^[a-zA-Z0-9]+$/;
	}
	else {
		textRegex = /^[a-zA-Z0-9 :.,&-]+$/;
	}
    if (text.match(textRegex) === null){
    	return false
    }
    else{
    	return true
    }
}


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
			loadCalendar(userid, 'Personal');
		}
		else {
			showMessage('Wrong username-password combination', showLogin);
		}

	});
}


function loadCalendar(userid, calendarid){
	$('#user-header').text(userid);
	$('#calendar-header').text(calendarid);
	// PEDIR CON UN GET A LA RUTA traer-eventos TODOS LOS EVENTOS DE EL USUARIO
	$.get("/traer-eventos", {userID: userid, calendarID: calendarid}, function (data) {
		events = data;
		// RENDERIZAR CALENDARIO VACIO CADA VEZ QUE SE CARGA LA PAGINA (ESTATICO)
		
		renderCalendar(events);

		// generadordeventos();                
     });

}

function createCalendar(calendarid, userid){
	$.post("/create-calendar", {userID: userid, calendarID: calendarid}, function (calendarCreateOK) {
		if (calendarCreateOK === 'ok'){
			$('#calendar-list').append('<option value="'+calendarid+'" class="list-item">'+calendarid+'</option>');
			$('#name-new-calendar').val('');
			showMessage('Calendar created', showSelectCalendar);
		}
		else {
			showMessage('Calendar name already taken', showSelectCalendar);
		}
	});	
}

function listCalendars(){
	$.get("/list-calendars", function (data) {
		calendars = data;
		$('#calendar-list').html('<option value="Personal" class="list-item">Personal</option>');  

		calendars.forEach(function(calendar){
			$('#calendar-list').append('<option value="'+calendar.calendarID+'" class="list-item">'+calendar.calendarID+'</option>');   
		})
  
     });
}


function renderCalendar(events){

	//borro todo lo que hay en tabla casilleros
	$('.tabla-casilleros').html('');

	//inyecto semanas a la tabla y dias a las semanas
	for (var s=0; s<52; s++){ 
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
			 		var dia_texto_mes = (dia == 01 ? " " + moment().startOf('week').add(i,"days").format("MMMM").toUpperCase() : ""); 
			 		//tasks del dia a incorporar. si no hay tasks vale ""
			 		var dia_data = "";
			 		if (fullDate in events) { 
			 			for (var j = 0; j < events[fullDate].length; j++) {
			 				dia_data += "<h5 class='task'>" + events[fullDate][j] + "</h5>";
			 			};
			 			
			 		};
		 			// append del casillero dia en cuestion
		 			$("#semana"+s).append('<div id="'+ dia_id +'" class="'+ dia_class +'"> <h5>'+ dia +' ' + dia_texto_mes + dia_data + '</h5></div>');

		 		
			}
			$("#semana"+s).append('<div class="break"></div>');
	}
   
	
	showCalendar();

}


$(document).ready(function() {



	showLogin();

	

});







           
