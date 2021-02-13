const baseURL = localStorage.getItem('baseURL'); // set by main.js (main.html)
if (!baseURL) { 
	delete localStorage.token;
	window.location.href = "main.html";	//main.html is starting page by default. Just for safety's sake
}

$(document).ready(function(){
    $("#login_form").submit(function(e){
		e.preventDefault();
		const obj = {email: $("#email").val(), password:  $("#id_password").val()};
		$.ajax({
			method: "POST",
			url: baseURL+'sessions/create',
			data: JSON.stringify(obj),
			headers: {'Content-type': 'application/json; charset=utf-8'},

			success: function(data){
				localStorage.setItem('token', data.id_token);
				window.location.href = "main.html";
			},

			error: function(data){
				dialog('Request failed!', data.status + ' ' + data.statusText + '<br>' + 
						data.responseText);
			}
	  	});
    });
});