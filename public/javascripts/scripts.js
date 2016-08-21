var events;
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
						// showMessage('Passwords must be the same', showCreateNewUser);
						showMessage('Las contraseñas tienen que ser iguales', showCreateNewUser);
					}
			
				} 
				else { 
					// showMessage('Enter a password that contains only letters and numbers', showCreateNewUser);
					showMessage('Ingresá una contraseña que contenga sólo letras y números', showCreateNewUser);

				}
			}
			else {
				// showMessage('Enter a username that contains only letters and numbers', showCreateNewUser);
				showMessage('Ingresá un nombre de usuario que contenga sólo letras y números', showCreateNewUser);
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


	$( ".casillero-dia" ).unbind().click(function() {
  		var fecha = $(this)[0].id;
  		// var eventsCode = $(this)[0].innerHTML;
    	$('#fecha-dialogo-evento').html('<h3>'+fecha+'</h3>');
    	showCreateNewEvent(fecha);
	});

	$('#user-header').unbind().click(function() {
    	showLogin();
	});

	$("#calendar-header" ).unbind().click(function() {
    	showSelectCalendar();
	});

	$(".task").unbind().click(function(e) {
		
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

function showConfirm(message, functionOK, functionCancel){
	$('#dialogo-new-user').css('opacity', '0.2');
	$('#dialogo-login').css('opacity', '0.2');	
	$('#dialogo-evento').css('opacity', '0.2');	
	$('.tabla-casilleros').css('opacity', '0.2');
	$('.header').css('opacity', '0.2');
	$('#dialogo-select-calendar').css('opacity', '0.2');	
	$('#dialogo-mensaje').css('opacity', '0.2');
	$('#dialogo-confirm').css('visibility', 'visible');
	$('#titulo-dialogo-confirm').html('<h5>'+message+'</h5>');
	$( "#boton-ok-dialogo-confirm" ).click(function() {
		functionOK();
	});

	$("#boton-cancel-dialogo-confirm" ).click(function() {
		functionCancel();
	});

	$("#dialogo-mensaje").keyup(function(e) {
		if (e.which == 13) $("#boton-ok-dialogo-confirm").click();     // enter
		if (e.which == 27) $("#boton-cancel-dialogo-confirm").click();   // esc
	});

}

function getTaskListHMTL(taskArray){
	var taskListHTML = '';
	taskArray.forEach(function(task){
		taskListHTML = taskListHTML + '<h5 class="task">'+task+'</h5>';
	})
	return taskListHTML;

}

function showCreateNewEvent(date){

	// obtain event list fot the selected date and format them for the container

	var dayEvents = events[date];
	var dayEventsHTML = '';
	if (dayEvents != undefined){
		dayEventsHTML = getTaskListHMTL(dayEvents);
	} else
	{
		dayEvents = [];
	}

	

	$('#dialogo-evento').css('visibility', 'visible');
	$('#dialogo-evento').css('opacity', '1');
	$('#dialogo-mensaje').css('visibility', 'hidden');
	$('.tabla-casilleros').css('opacity', '0.2');
	$('.header').css('opacity', '0.2');
	$('#texto-input-evento').val('');
	$('#texto-input-evento').focus();
	$('#task-container').html(dayEventsHTML);

	$( "#boton-cerrar-dialogo-evento" ).unbind().click(function() {
    	showCalendar();
	});

	$( "#cross-dialogo-evento" ).unbind().click(function() {
    	showCalendar();
	});

	$( "#boton-submit-dialogo-evento" ).unbind().click(function() {

    	
		var tarea = $('#texto-input-evento').val();
		var userid = $('#user-header').text();
		var calendarid = $('#calendar-header').text();
		var fecha = $('#fecha-dialogo-evento').text();

		if (validateText(tarea, 2)){
			$.post( "/postear-eventos", {userID: userid, date: fecha, summary: tarea, calendarID: calendarid}, function () {
				$('#task-container').append('<h5 class="task">'+tarea+'</h5>');
				dayEvents.push(tarea);
				dayEventsHTML = getTaskListHMTL(dayEvents);
				$("#"+fecha+ '> .data').html(dayEventsHTML);
				$('#task-container').html(dayEventsHTML);
				showCreateNewEvent(fecha);
			});
		}
		else {
			showMessage("Ingresá un título de evento que contenga sólo letras, numeros, espacios, '-', '.' y ':'", function(){ return showCreateNewEvent(fecha); });
		}
	});

	$("#dialogo-evento").keyup(function(e) {
		// if (e.which == 13) $("#boton-submit-dialogo-evento").click();     // enter
		if (e.which == 27) $("#boton-cerrar-dialogo-evento").click();   // esc
	});

	$("#task-container > .task").unbind().click(function(e) {
			e.stopPropagation();
			// eliminar de la DB
			var fecha = $('#fecha-dialogo-evento').text();
	  		var tarea = $(this)[0].innerHTML;
	  		var userid = $('#user-header').text();
	  		var calendarid = $('#calendar-header').text();
	  		var taskDiv = $(this);
			$.post( "/borrar-eventos", { date: fecha, summary: tarea, userID: userid, calendarID: calendarid}, function(borradoOk){
				if (borradoOk == 'borrado'){
					showMessage("Evento '"+tarea+"' eliminado", function(){ return showCreateNewEvent(fecha); });
					taskDiv.remove();
					eventos = $('#task-container').innerHTML;
					console.log('fecha: #'+fecha);
					$('#'+fecha).html(eventos);
					// eliminar de la vista
					var index = dayEvents.indexOf(tarea);
					if (index > -1) {
    					dayEvents.splice(index, 1);
					}
					dayEventsHTML = getTaskListHMTL(dayEvents);
					$("#"+fecha+ '> .data').html(dayEventsHTML);
				}
				else {
					// showMessage("You can only delete events that were created by yourself", showCalendar);
					showMessage("Sólo podés eliminar los eventos que creaste vos", function(){ return showCreateNewEvent(fecha); });
				}
			});
			

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
			// showMessage('Enter a calendar name that contains only letters and numbers', showSelectCalendar);
			showMessage('Ingresá un nombre de calendario que contenga sólo letras y números', showSelectCalendar);
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
			// showMessage('User created', showLogin);
			showMessage('Usuario creado', showLogin);
		}
		else {
			// showMessage('Username already taken', showCreateNewUser);
			showMessage('Ese nombre de usuario ya está siendo utilizado', showCreateNewUser);
		}
	});	
}

function validateUser(userid, pass){
	$.get("/validate-user", {userID: userid, password: pass}, function (userOk) {
		if (userOk === 'ok'){
			loadCalendar(userid, 'Personal');
		}
		else {
			// showMessage('Wrong username-password combination', showLogin);
			showMessage('Combinación nombre de usuario-contraseña incorrecta', showLogin);
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
			// showMessage('Calendar created', showSelectCalendar);
			showMessage('Calendario creado', showSelectCalendar);
		}
		else {
			// showMessage('Calendar name already taken', showSelectCalendar);
			showMessage('Ese nombre de calendario ya está siendo utilizado', showSelectCalendar);
		}
	});	
}

function listCalendars(){
	$.get("/list-calendars", function (data) {
		calendars = data;
		$('#calendar-list').html('<option value="Personal" class="list-item" selected="selected">Personal</option>');  

		calendars.forEach(function(calendar){
			$('#calendar-list').append('<option value="'+calendar.calendarID+'" class="list-item">'+calendar.calendarID+'</option>');   
		})
  
     });
}


function renderCalendar(events){

	//borro todo lo que hay en tabla casilleros
	$('.tabla-casilleros').html('');

	var screenWidth = document.documentElement.clientWidth;

	var monthNameFormat = (screenWidth > 750 ? "MMMM" : "MMM"); // to use short month name in mobile devices
   
	//inyecto semanas a la tabla y dias a las semanas
	for (var s=0; s<52; s++){ 
			var id = "semana"+s;
			$('.tabla-casilleros').append('<div id="'+id+'" class="row"></div>');

			$("#semana"+s).append('<div class="col-n-semana casillero-semana"> <h5>'+ s + '</h5></div>');

			


			for (var i=1+s*7; i<8+s*7; i++){
			 		var dia = moment().startOf('week').add(i,"days").format("D");
			 		var dayNumber = Number(dia);
			 		var mes = Number(moment().startOf('week').add(i,"days").format("M"));
			 		var fullDate = moment().startOf('week').add(i,"days").format("DD-MM-YYYY");

			 		var isDayInThePast = moment().diff(moment().startOf('week').add(i,"days"), 'days')>0; 
			 		var isDayToday =  (moment().format("DD-MM-YYYY") == fullDate);
			 		var isDayFirstWeek = (dia <= 7);

			 		var monthName = " "+ moment().startOf('week').add(i,"days").format(monthNameFormat).toUpperCase();
			 		var monthNameLength = monthName.length;
			 		

			 		//fecha identificacion del casillero
			 		var dia_id = "" + fullDate;
			 		//clase para dar formato al casillero dia, cambiando en funcion de paridad de mes y si es un dia del pasado
			 		var dia_class = (isDayToday? "dia-hoy " : (isDayInThePast? "dia-pasado ":(isDayFirstWeek? "first-week-day " : ""))) +' col-xs-2 casillero-dia'; 
			 		//texto a incorporar los dias 01 de cada mes. si no es 01, vale ""
			 		if(dia == 01){
			 			dia_class = dia_class + " first-day";
			 		}
			 		else{
			 			// dia_texto_mes = '';
			 			// dia_texto_mes = monthName.substring(dayNumber%monthNameLength,dayNumber%monthNameLength+1);
			 		}
			 		dia_texto_mes = monthName;
			 		// dia_texto_mes = monthName.substring(dayNumber%monthNameLength,dayNumber%monthNameLength+1);
			 		//tasks del dia a incorporar. si no hay tasks vale ""
			 		var dia_data = "";
			 		if (fullDate in events) { 
			 			for (var j = 0; j < events[fullDate].length; j++) {
			 				dia_data += "<h5 class='task'>" + events[fullDate][j] + "</h5>";
			 			};
			 			
			 		};
		 			// append del casillero dia en cuestion
		 			$("#semana"+s).append('<div id="'+ dia_id +'" class="'+ dia_class +'"> <h5>'+ '<div class="dayNumber">' +dia+ '</div>' +' ' + '<div class="monthName">' + dia_texto_mes +'</div><div class="break"></div>' +'</h5><div class="data">'+ dia_data +'</div></div>');
		 			// $("#semana"+s).append('<div id="'+ dia_id +'" class="'+ dia_class +'"> <h5>'+ dia +' ' + '</h5><div class="data">'+ dia_data +'</div><div class="monthName">'+ dia_texto_mes +'</div></div>');
		 			
		 			dayNumber++;

		 		
			}
			$("#semana"+s).append('<div class="break"></div>');
	}
   
	
	showCalendar();

}


$(document).ready(function() {

	

	showLogin();

	

});





