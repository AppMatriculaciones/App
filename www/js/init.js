(function($){
  $(function(){
  	$('.sidenav').sidenav();
  	$('.tabs').tabs({"swipeable":true});
    $('#login_button').click(APIlogin);
    $('#register_button').click();
 
  }); // end of document ready
})(jQuery); // end of jQuery name space

function APIlogin(){

	var user = $('#email').val();
	var pass = $('#password').val();
	$.ajax({
	  method: "POST",
	  url: "https://app-online-enrollment.herokuapp.com/",
	  dataType: "json",
	}).done(function (msg) {
		//alert("DONE");
		
	}).fail(function () {
		//alert("FALLO");
	});
	location.href='menu.html';
}

document.addEventListener('deviceready', onDeviceReady, false);
 
function onDeviceReady() {
}