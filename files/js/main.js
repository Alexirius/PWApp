// setting globals

const baseURL = 'http://193.124.114.46:3001/';
localStorage.setItem('baseURL', baseURL);

// getting bearer-token

if (!localStorage.getItem('token')) {
    window.location.href = "login.html";
} 
const token = localStorage.getItem('token');

$(document).ready(function(){

	var my = {
        window : $(window)
    };

	if(my.window.width() < 600) {
		$(function (){
			$('#br').prepend('<br>');
			$('.pay').append('<br>');
		});
	}
	// Getting User Info

	$.ajax({
		method: "GET",
		url: baseURL+'api/protected/user-info',
		headers: {'Authorization': 'Bearer '+ token},

		success: function(data){
			$('#user').text(data.user_info_token.name);
			$('#balance').text(data.user_info_token.balance);
		},
		error: function(data){
			dialog('Request failed!', data.status + ' ' + data.statusText + '<br>' + 
					data.responseText);
		}
	});

	// <<LogOut>> Button

	$('.logout_btn').click(function() {
		delete localStorage.token;
		window.location.href = "login.html";
	});

	// Autocomplete field processing

	let usersList = [];
	$('#query').on('input',function(e) {
		e.preventDefault();
		const listItems = [];
		let focusedItem = -1;

		function setActive(active) {
			if(active) 
				$('.autocomplete-wrap').addClass('active');
			else
				$('.autocomplete-wrap').removeClass('active');
		}
		function focusItem(index) {
			if (!listItems.length) return false;
			if (index > listItems.length - 1) return focusItem(0);
			if (index < 0) return focusItem(listItems.length - 1);
			focusedItem = index;
			unfocusAllItems();
			listItems[focusedItem].addClass('focused');
		}
		function unfocusAllItems() {
			listItems.forEach(item => {
				item.removeClass('focused');
			});
		}
		function selectItem(index) {
			if(!listItems[index]) return false;
			$('#query').val(listItems[index].text());
			setActive(false);
		}

		// Getting filtered Users List
		
		const value = $('#query').val();
		if (!value) return setActive(false);
		$('.autocomplete-list').html('');
		
		$.ajax({
			method: "POST",
			url: baseURL+'api/protected/users/list',
			headers: {'Content-type': 'application/json; charset=utf-8',
					  'Authorization': 'Bearer '+ token},
			data: JSON.stringify({filter: value}),
				
			success: function(data){
				usersList = data.map(item => item.name);
				autocomplete();
			},
			error: function(data){
				dialog('Request failed!', data.status + ' ' + data.statusText + '<br>' + 
						data.responseText);
			}
		});
		
		function autocomplete() {
			usersList.forEach((dataItem, index) => {
				const item = $('<div></div>').appendTo($('.autocomplete-list'));
				item.addClass('autocomplete-item');
				item.html(dataItem);
				listItems.push(item);
				item.click(() => selectItem(listItems.indexOf(item)));
			});
			if(listItems.length > 0) {
				focusItem(0);
				setActive(true);
			} else setActive(false);

			$('#query').on('keydown', function(e) {
				const keyCode = e.keyCode;
				if(keyCode === 40) { 			// arrow down
					e.preventDefault();
					focusedItem++;
					focusItem(focusedItem);
				} else if(keyCode === 38) { 	//arrow up
					e.preventDefault();
					if(focusedItem > 0) focusedItem--;
					focusItem(focusedItem);
				} else if(keyCode === 27) { 	// escape
					setActive(false);
				} else if(keyCode === 13) { 	// enter
				selectItem(focusedItem);
				}
			});
			$('body').click(function(e) {
				e.preventDefault();
				// Click out of Autocomplele List area
				if(!$('.autocomplete-wrap').has(e.target).length > 0) 
					setActive(false);
			});
		}
	});

	// Creating Transaction

	$('.send_btn').click( function (e) {
		e.preventDefault();
		const recipientName = $('#query').val();
		const pwAmount = $('#amount').val();
		if (!usersList.length || !usersList.includes(recipientName)) {
			dialog('Warning','Invalid User Name');
			return false;
		} 
		if (!pwAmount || parseInt(pwAmount) <= 0)  {
			dialog('Warning',"Invalid PW Amount");
			return false;
		}
		const dfd = dialog('Confirm Operation',
							'Send '+pwAmount+' to '+recipientName+'?',
							true);
		//dialog(header,text,yesNo=false) in funcs.js. Returns Deferred obj
		dfd.done(function() {
			$.ajax({
				method: "POST",
				url: baseURL+'api/protected/transactions',
				headers: {'Content-type': 'application/json; charset=utf-8',
				'Authorization': 'Bearer '+ token},
				data: JSON.stringify({name: recipientName, amount: pwAmount}),
				
				success: function() {
					const dfd = dialog('Transaction created.','Recipient: '+recipientName+
					'<br>Amount:    '+pwAmount+
					'<br>Result:     Success');
					dfd.done(function () {
						location.reload();
					});
				},
				error: function(data){
					dialog('Request failed!', data.status + ' ' + data.statusText + '<br>' + 
					data.responseText);
					
				}
			})
		});
	});
	
	// Getting User's Transactions List
	
	let transList = [];
	$.ajax({
		method: "GET",
		url: baseURL+'api/protected/transactions',
		headers: {'Authorization': 'Bearer '+ token},

		success: function(data){
			if (!data.trans_token.length) {
				transList = [];
			} else {
				transList = data.trans_token;
			}
			if (!transList.length) {
				$('.table_wrap').html('You have no Transactions History yet.');
			} else {
							// Creating Table

				transList.reverse();
				const tableArr=['<table>'];
				tableArr.push('<tr><th>Date</th><th>Recipient/Sender</th><th>Amount</th><th>Balance</th></tr>');
				transList.forEach( (item) => {
					tableArr.push('<tr><td>'+item.date+'</td><td>'+item.username+'</td><td>'+item.amount+'</td><td>'+item.balance+'</td></tr>');
				});
				tableArr.push('</table>');
				$('.table_wrap').html(tableArr.join('\n'));
			}
		},

		error: function(data){
			dialog('Request failed!', data.status + ' ' + data.statusText + '<br>' + 
					data.responseText);

		}
	});
});