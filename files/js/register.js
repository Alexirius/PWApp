const baseURL = localStorage.getItem('baseURL'); // set by main.js (main.html)
if (!baseURL) { 
	delete localStorage.token;
	window.location.href = "main.html";	//main.html is Starting Page by default. Just for safety's sake
}
$(document).ready(function(){
    $("#register_form").submit(function(e){
		e.preventDefault();
		if ($('#id_password').val() != $('#confirm').val()) {
			return dialog('Warning!','Password confirm mismatch!<br>Try again');
		}
		const obj = {username: $("#username").val(), password: $("#id_password").val(), email: $("#email").val()};
		console.log(JSON.stringify(obj));
		$.ajax({
			method: "POST",
			url: baseURL+'users',
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