// Extra actions on successfull submit
fallbackForm['profile'] = function fallback (data, status, $msgBox, $form) {
	var name = data['auth_name'];
	var email = data['auth_email'];
	var user = getUser();
	user.name = name;
	user.email = email;
	
	setUser(user);
	$('#name').html(name);
};