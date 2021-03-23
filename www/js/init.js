(function($){
  $(function(){
  	semaforoColors();
  	$('.sidenav').sidenav();
  	$('.tabs').tabs({"swipeable":true});

  	// Listener para el boton de LOGIN
    $('#login_button').click(APIlogin);
    // Listener para enviar los documentos del DashBoard
    $('#sendBtn').click(sendDocs);
 
  }); // end of document ready
})(jQuery); // end of jQuery name space

// Llamada a DB para saber el estado.
var fDNIstat = 'redCirc', rDNIstat = 'redCirc', notesStatus = 'redCirc';

function semaforoColors(){
	var status = $('#frontDNIstatus');
	status.addClass(fDNIstat);
	status = $('#rearDNIstatus');
	status.addClass(rDNIstat);
	status = $('#notesStatus');
	status.addClass(notesStatus);
}

function APIlogin(){
	var email = $('#email').val();
	var pass = $('#password').val();
	$.ajax({
	  method: "GET",
	  url: "https://appmatriculacioaaj.herokuapp.com/login/student/"+email+'/'+pass,
	  dataType: "json",
	}).done(function (msg) {
		if(msg._id != null){
			location.href='menu.html';
		}else {
			alert("Login failed");
		}		
	}).fail(function () {
		alert("URL ERROR");
	});
}

function sendDocs(){
	var status = $('#frontDNIstatus');
	status.removeClass('redCirc').addClass('ambar');
	status = $('#rearDNIstatus');
	status.removeClass('redCirc').addClass('ambar');
	status = $('#notesStatus');
	status.removeClass('redCirc').addClass('ambar');
}

document.addEventListener('deviceready', onDeviceReady, false);
 
function onDeviceReady() {
}