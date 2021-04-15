(function($){
  $(function(){
  	semaforoColors();

  	$('.sidenav').sidenav();
  	$('.tabs').tabs({"swipeable":true});

  	// Funciones que crean los tabs
	//tabSelectCicles(ajaxUfs);
	tabProfiles(profiles);
	tabUfsEnrollement();
  	// Listener para el boton de LOGIN
    $('#login_button').click(APIlogin);
    // Listener para enviar los documentos del DashBoard
    $('#sendBtn').click(sendDocs);
 
  }); // end of document ready
})(jQuery); // end of jQuery name space

var student_token = "";

// Llamada a DB para saber el estado.
var fDNIstat = 'redCirc', rDNIstat = 'redCirc', notesStatus = 'redCirc';

// Llamada a DB para recuperar tipos de perfil de requerimiento
var profiles = [
	{ type:"Familia_numerosa"},
	{ type:"Familia_monoparental"},
	{ type:"Discapacidad"},
	{ type:"Perfil_estandard"}
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
			student_token = msg.token;
			location.href='menu.html';
			alert('Token: '+student_token);
		}else {
			alert("Login failed");
		}		
	}).fail(function () {
		alert("URL ERROR");
	});
}

function tabUfsEnrollement(){
	var code = recoverCarreerCode();
}

function recoverCarreerCode(){
	console.log('Token: '+student_token);
	$.ajax({
	  method: "GET",
	  url: "http://localhost:5000/career/getbyid/604d0322aa3e991914dbb252",
	  dataType: "json",
	}).done(function (msg){
		if(msg != null){
			recoverMpsByCarreerCode(msg.code);
		} else {
			alert("Error");
		}
	}).fail(function () {
		alert("Error al recuperar Cicles");
	});
}

function recoverMpsByCarreerCode(code){
	$.ajax({
	  method: "GET",
	  url: "http://localhost:5000/mps/getbycareer/"+code,
	  dataType: "json",
	}).done(function (msg){
		if(msg != null){
			recoverUfsByCarreerCode(code, msg);
		} else {
			alert("Error");
		}
	}).fail(function () {
		alert("Error al recuperar Moduls");
	});
}

function recoverUfsByCarreerCode(code, mps){
	$.ajax({
	  method: "GET",
	  url: "http://localhost:5000/ufs/getbycareer/"+code,
	  dataType: "json",
	}).done(function (msg){
		if(msg != null){
			tabSelectCicles(mps, msg);
		} else {
			alert("Error");
		}
	}).fail(function () {
		alert("Error al recuperar Unitats Formatives");
	});
}

function semaforoColors(){
	var status = $('#frontDNIstatus');
	status.addClass(fDNIstat);
	status = $('#rearDNIstatus');
	status.addClass(rDNIstat);
	status = $('#notesStatus');
	status.addClass(notesStatus);
}

function tabSelectCicles(mps, ufs){

	$('#UFs').append("<h3><label>Seleccionar todo	</label><input id='selectAll' type='checkbox'></h3>");

	for (var i = 0; i <= mps.length - 1; i++) {
		$('#UFs').append("<h5><label>"+mps[i].name+"   </label><input id='"+mps[i].code+"' type='checkbox'></h5>");
		for (var j = 0; j <= ufs.length - 1; j++) {
			if(mps[i]._id == ufs[j].mp_id){
				$('#UFs').append("<label>"+ufs[j].name+"  </label><input id='"+ufs[j]._id+"' mp='"+mps[i].code+"' type='checkbox'><br>");
			}
		}
	}
 
	$('#UFs').append("<button id='saveUfs'> Matricularse </button>");
    // Listener para los checkbox de las mp
	checkBoxesListeners(mps, ufs);
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

function checkBoxesListeners(mps, ufs){

	var allSelected;
	$('#selectAll').change(function() {
		if(!this.checked){
			allSelected = $('input[type="checkbox"]').prop("checked", false);
		} else {
			allSelected = $('input[type="checkbox"]').prop("checked", true);			
		}
		
	});

	var mpListener;
	for (let i = 0; i <= mps.length - 1; i++) {
		$('#'+mps[i].code).change(function() {
	   		if (!this.checked) {
				mpListener = $("input[mp='"+mps[i].code+"']");
				mpListener.prop("checked", false);
			} else {
				mpListener = $("input[mp='"+mps[i].code+"']");
				mpListener.prop("checked", true);
			}
    	});
	}

	$('#saveUfs').click(function(){
		var arrayUfs = [];
		for (let i = 0; i <= ufs.length - 1; i++){
			if($('#'+ufs[i]._id).prop('checked')){
				arrayUfs.push(ufs[i]._id);
			}
    	}

    	var response = confirm("Seleccion correcta?");
		if(response == true){
			addUfs(arrayUfs);
		} else {
			alert("No matriculado");
		}
	});
	
} 

function addUfs(arrayUfs){

	$.ajax(
	{
		url : "http://localhost:5000/enrollment/addufs",
		type: "POST",
		data : {
			token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQW1hZG9yIiwiaWF0IjoxNjE2MDg3OTk1fQ.SY7NmI3DI56O9qRccVGixSrUnxf00vGZEh5y7lwauCE',
			ufs : arrayUfs
		}
	})
	.done(function(data) {
		console.log(data);
		alert("Matriculado correctamente");
	})
	.fail(function(data) {
		alert( "error" );
	});
}

// Listener para cambiar de perfil de requerimientos
function buttons(profile){
	$('#'+profile).click(function() {
		var response = confirm("Cambiar al perfil: "+profile.replace('_',' ')+"?");
		if(response == true){
			alert("Nuevo perfil seleccionado: "+profile.replace('_',' '));
		} else {
			alert("Perfil NO seleccionado");
		}
	});
}
