(function($){
  $(function(){

  	$('.sidenav').sidenav();
  	$('.tabs').tabs({"swipeable":true});

  	// Funciones que crean los tabs
    tabDashboard();
    tabRequeriments();
    getProfiles();
    // Listener para enviar los documentos del DashBoard
    $('#sendBtn').click(sendDocs);
    getCareerId();
 
  }); // end of document ready
})(jQuery); // end of jQuery name space

//var herokuUrl = "http://localhost:5000";
var herokuUrl = "https://appmatriculacioaaj.herokuapp.com";

// Llamada a DB para saber el estado.
var fDNIstat = 'redCirc', rDNIstat = 'redCirc', notesStatus = 'redCirc';

// Llamada a DB para recuperar tipos de perfil de requerimiento
var profiles = [
  { 
    type:"Familia_numerosa",
    requeriments:
      [
        "DNI recto","DNI verso","Carnet de familia numerosa"
      ]
  }
];

function getProfiles(){

  $.ajax({
    method: "GET",
    url: herokuUrl+"/requirements_profile/getall",
    dataType: "json",
  }).done(function (msg){
    if(msg != null){
      tabProfiles(msg);
    } else {
      alert(msg);
    }
  }).fail(function () {
    alert("Error al recuperar los perfiles");
  });
}

function getCareerId(){

  var token = localStorage.getItem('token');
  $.ajax({
    method: "GET",
    url: herokuUrl+"/career/getbystudenttoken/"+token,
    dataType: "json",
  }).done(function (msg){
    console.log("getcareerid: "+msg.msg);
    if(msg.msg != null){
      recoverCarreerCode(msg.msg);
    } else {
      alert(msg);
    }
  }).fail(function () {
    alert("Error al recuperar student");
  });
}

function recoverCarreerCode(career_id){

  $.ajax({
    method: "GET",
    url: herokuUrl+"/career/getbyid/"+career_id,
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
    url: herokuUrl+"/mps/getbycareer/"+code,
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
    url: herokuUrl+"/ufs/getbycareer/"+code,
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

function addUfs(arrayUfs){

  $.ajax(
  {
    url : herokuUrl+"/enrollment/addufs",
    type: "POST",
    data : {
      token : localStorage.getItem('token'),
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

function tabDashboard(){
  $('#dashboardTable').append("<tr><th>TIPO DE DOCUMENTO</th><th>ESTADO</th></tr>");
  for (var j = 0; j <= profiles[0].requeriments.length - 1; j++) {
    $('#dashboardTable').append("<tr><td>"+profiles[0].requeriments[j]+"</td><td><span id='"+profiles[0].requeriments[j].replaceAll(' ','_')+"' class=''>1</span></td></tr>");
  }

  semaforoColors();
}

function semaforoColors(){

  for (var i = 0; i <= profiles[0].requeriments.length-1; i++) {
    var status = $('#'+profiles[0].requeriments[i].replaceAll(' ','_'));
    status.addClass('redCirc');
  }
}

function sendDocs(){

  var file;
  /*alert("IN");
  for (var i = 0; i <= profiles[0].requeriments.length-1; i++) {
    file = $('.'+profiles[0].requeriments[i].replaceAll(' ','_'));

    if (file.length <= 0){
      alert("Ningun elemento subido");
    } else {
      $.ajax(
      {
        url : herokuUrl+"/uploadphoto",
        type: "POST",
        data : {
          token : localStorage.getItem('token'),
          photo : file
        }
      })
      .done(function(data) {
        console.log(data);
        alert("Imagen/es subidas correctamente");
      })
      .fail(function(data) {
        alert( "error" );
      });
    }
  }*/

  for (var i = 0; i <= profiles[0].requeriments.length-1; i++) {

    var status = $('#'+profiles[0].requeriments[i].replaceAll(' ','_'));
    status.removeClass('redCirc').addClass('ambar');
  }
}

function tabRequeriments(){
  $('#requerimentsTable').append("<tr><th>TIPO DE DOCUMENTO</th><th>DOCUMENTO</th></tr>");
  for (var j = 0; j <= profiles[0].requeriments.length - 1; j++) {
    $('#requerimentsTable').append("<tr><td>"+profiles[0].requeriments[j]+"</td><td><input type='file'name='"+profiles[0].requeriments[j].replaceAll(' ','_')+"' accept='.jpg,.png' multiple></td></tr>");
  }
  $('#requerimentsTable').append("<tr><td></td><td><button id='sendBtn'>ENVIAR</button></td></tr>");
}

function tabSelectCicles(mps, ufs){

  $('#UFs').append("<h3><label>Seleccionar todo </label><input id='selectAll' type='checkbox'></h3>");

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
    $('#Perfil').append("<tr><td><button id="+profiles[i].type.replace(' ','_')+">"+profiles[i].type+"</button></td></tr>");
    buttons(profiles[i].type.replace(' ','_'));
  }
  $('#UFs').append("</table>");
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
