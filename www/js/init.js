(function($){
  $(function(){
  	semaforoColors();

  	$('.sidenav').sidenav();
  	$('.tabs').tabs({"swipeable":true});

  	// Funciones que crean los tabs
	tabSelectCicles(ajaxUfs);
	tabProfiles(profiles);
	//tabUfsEnrollement();
  	// Listener para el boton de LOGIN
    $('#login_button').click(APIlogin);
    // Listener para enviar los documentos del DashBoard
    $('#sendBtn').click(sendDocs);
 
  }); // end of document ready
})(jQuery); // end of jQuery name space

// Llamada a DB para saber el estado.
var fDNIstat = 'redCirc', rDNIstat = 'redCirc', notesStatus = 'redCirc';

var student_id;

// Llamada a DB para recuperar tipos de perfil de requerimiento
var profiles = [
	{ type:"Familia_numerosa"},
	{ type:"Familia_monoparental"},
	{ type:"Discapacidad"},
	{ type:"Perfil_estandard"}
];

// Llamada a DB para recuperar ciclos de inscripcion.
var ajaxUfs = [
  		{	mpname: "mp01",
	  		uf:[{name:"uf1"},
	  			{name:"uf2"},
	  			{name:"uf3"}]
	  	},
	  	{	mpname: "mp02",
	  		uf:[{name:"uf1"},
	  			{name:"uf2"},
	  			{name:"uf3"}]
	  	}
  	];

// Llamada API para el login
function APIlogin(){
	var email = $('#email').val();
	var pass = $('#password').val();
	$.ajax({
	  method: "GET",
	  url: "https://appmatriculacioaaj.herokuapp.com/login/student/"+email+'/'+pass,
	  dataType: "json",
	}).done(function (msg){
		if(msg._id != null){
			student_id = msg._id;
			location.href='menu.html';
		}else {
			alert("Login failed");
		}		
	}).fail(function () {
		alert("URL ERROR");
	});
}

/*async function tabUfsEnrollement(){
	var code = await recoverCarreerCode();
	alert(code);
}

async function recoverCarreerCode(){
	$.ajax({
	  method: "GET",
	  url: "http://localhost:5000/career/getbyid/604d0322aa3e991914dbb252",
	  dataType: "json",
	}).done(function (msg){
		if(msg != null){
			alert(msg.code)
		} else {
			alert("Error");
		}
	}).fail(function () {
		alert("URL ERROR");
	});
}*/

function semaforoColors(){
	var status = $('#frontDNIstatus');
	status.addClass(fDNIstat);
	status = $('#rearDNIstatus');
	status.addClass(rDNIstat);
	status = $('#notesStatus');
	status.addClass(notesStatus);
}

function tabSelectCicles(ufs){
	for (var i = 0; i <= ufs.length - 1; i++) {
		$('#UFs').append("<h5><label>"+ufs[i].mpname+"   </label><input id='"+ufs[i].mpname+"' type='checkbox'></h5>");
		for (var j = 0; j <= ufs[i].uf.length - 1; j++) {
			$('#UFs').append("<label>"+ufs[i].uf[j].name+"  </label><input mp='"+ufs[i].mpname+"' type='checkbox'><br>");
		}
	}
    // Listener para los checkbox de las mp
	checkBoxes(ufs);
}

function tabProfiles(profiles){
	$('#UFs').append("<table>");
	for (var i = 0; i <= profiles.length-1; i++) {
		$('#Perfil').append("<tr><td><button id="+profiles[i].type+">"+profiles[i].type.replace('_',' ')+"</button></td></tr>");
		buttons(profiles[i].type);
	}
	$('#UFs').append("</table>");
}

function sendDocs(){
	var status = $('#frontDNIstatus');
	status.removeClass('redCirc').addClass('ambar');
	status = $('#rearDNIstatus');
	status.removeClass('redCirc').addClass('ambar');
	status = $('#notesStatus');
	status.removeClass('redCirc').addClass('ambar');
}

function checkBoxes(ufs){

	for (let i = 0; i <= ufs.length - 1; i++) {
		$('#'+ufs[i].mpname).change(function() {
	   		if (!this.checked) {
				var status = $("input[mp='"+ufs[i].mpname+"']");
				status.prop("checked", false);
			} else {
				var status = $("input[mp='"+ufs[i].mpname+"']");
				status.prop("checked", true);
			}
    	});
	}
}

// Listener para cambiar de perfil de requerimientos
function buttons(profile){
	$('#'+profile).click(function() {
		var response = confirm("Cambiar al perfil: "+profile.replace('_',' ')+"?");
		if(response == true){
			alert("Nuevo perfil seleccionado: "+profile.replace('_',' '));
		} else {
			alert("false");
		}
	});
}
