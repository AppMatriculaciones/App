(function($){
  $(function(){
  	// Listener para el boton de LOGIN
    $('#login_button').click(APIlogin);
 
  }); // end of document ready
})(jQuery); // end of jQuery name space

var localUrl = "http://localhost:5000";
var herokuUrl = "https://appmatriculacioaaj.herokuapp.com";

// Llamada API para el login
function APIlogin(){
	var email = $('#email').val();
	var pass = $('#password').val();
	$.ajax({
	  method: "GET",
	  url: localUrl+"/login/student/"+email+'/'+pass,
	  dataType: "json",
	}).done(function (msg){
		if(msg.token != null){
			localStorage.setItem('token', msg.token);

			location.href='menu.html';
		}else {
			alert("Login failed");
		}		
	}).fail(function () {
		alert("URL ERROR");
	});
}
