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

function onShowSettingsModal(e){
    var user = getUser();
    $('button[data-dismiss="modal"]', $('#settings')).fadeIn();
	$('input[name="id"]', $('#settings')).val(user.id);
	$('input[name="name"]', $('#settings')).val(user.name);
	$('input[name="username"]', $('#settings')).val(user.username);
	$('input[name="email_confirmation"]', $('#settings'))
	   .add('input[name="email"]', $('#settings'))
	       .val(user.email);
}