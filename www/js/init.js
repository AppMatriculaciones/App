(function($){
  $(function(){
  	$('.sidenav').sidenav();
  	$('.tabs').tabs({"swipeable":true});
    $('#login_button').click(APIlogin);
    $('#register_button').click();
 
  }); // end of document ready
})(jQuery); // end of jQuery name space

function APIlogin(){

	var user = $('#user').val();
	var pass = $('#password').val();
	$.ajax({
	  method: "GET",
	  url: "",
	  dataType: "json",
	}).done(function (msg) {
		alert("DONE!");  
	}).fail(function (msg) {
	});

	location.href='menu.html';
}

document.addEventListener('deviceready', onDeviceReady, false);
 
function onDeviceReady() {
}