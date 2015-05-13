<script type="text/javascript">
<!--
$( function($) {
	
	// $( '#settings' ).modal({
	// 	keyboard : false,
	// 	backdrop: 'static',
	// });
	
    $('#settings').on('show.bs.modal', function (e) {
        var user = getUser();
        $(this).find('form').attr('action',settings_url);
    	$('button[data-dismiss="modal"]', $('#settings')).fadeIn();
    	$('input[name="id"]', $('#settings')).val(user.id);
    	$('input[name="name"]', $('#settings')).val(user.name);
    	$('input[name="username"]', $('#settings')).val(user.username);
    	$('input[name="email_confirmation"]', $('#settings'))
    	   .add('input[name="email"]', $('#settings'))
    	       .val(user.email);
    });
});
-->
</script>

<!-- Modal -->
<div class="modal fade in" id="settings" tabindex="-1" role="dialog" aria-labelledby="settingsLabel" aria-hidden="true">
  <div class="modal-dialog modal-m">
    <div class="modal-content">
      <div class="modal-header">
         <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title form-signin-heading text-center" id="settingsLabel">translate('Impostazioni Utente')</h4>
      </div>
      <form id="profile" class="form-settings" data-refresh="0" data-async data-validate data-target="#settings [name='feedback']" 
        action="" method="POST">
      <div class="modal-body">
         <span name="feedback">
             <p class="alert alert-warning">
                <b>translate('Hd0')</b> translate('richiede l\'email di lavoro!')<br/>
                <u><b>translate('Può esser richiesto l\'invio di mail')</b></u> >translate('per comunicare con gli operatori')
             </p>
         </span>
         <input name="id" type="hidden">
          <div class="form-group">
            <label for="inputUsername">translate('Nome Utente'):</label>
            <input name="username" type="username" id="inputUsername" class="form-control"
                placeholder="translate('Nome Utente')" disabled="disabled">
          </div>
          <div class="form-group">
            <label for="inputName">translate('Nome'):</label>
            <input name="name" type="name" id="inputName" class="form-control"
                data-validation-error-msg="Attesi massimo di 30 caratteri"
                placeholder="translate('Nome')" data-validation="length" 
                data-validation-length="max30">
          </div>
          <div class="form-group">
            <label for="inputEmail">translate('Email'):</label>
            <input name="email_confirmation" data-validation="email domain required" id="inputEmail"
                data-validation-error-msg="Inserire una email di lavoro valida (@iper.it, @ortofin.it o @unes.it)" class="form-control"
                placeholder="translate('Il tuo indirizzo email')">
          </div>
          <div class="form-group">
            <label for="inputEmail">translate('Conferma Email'):</label>
                <input name="email" data-validation="confirmation required" 
                    data-validation-error-msg="Riscrivere l'email per conferma!" id="inputEmail" 
                    class="form-control" placeholder="translate('Conferma la tua email')">
          </div>
          <center>
          <button type="submit" class="btn btn-primary">translate('Salva')</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">translate('Annulla')</button>
          </center>
      </div>
    </form>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->