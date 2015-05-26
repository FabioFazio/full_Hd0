<script type="text/javascript">
<!--
$( function($) {

	$( '#login' ).find('form').attr('action',login_url);

	if ( !(splashscreen || authenticated) )
	{
        $( '#login' ).modal({
            keyboard : false,
            backdrop: 'static',
        });
        
    }
	
    $('#login').on('hidden.bs.modal', function (e) {
        
        if ( $('#auth_email').length > 0 && !$('#auth_email').val().length )
        {
            $( '#settings' ).modal({
        		keyboard : false,
        		backdrop: 'static',
        	});
        	$('button[data-dismiss="modal"]', $('#settings')).fadeOut();
        }
    });
});
-->
</script>

<!-- Modal -->
<div class="modal fade in" id="login" tabindex="-1" role="dialog" aria-labelledby="loginLabel" aria-hidden="true">
  <div class="modal-dialog modal-m">
    <div class="modal-content">
      <div class="modal-header">
         <!-- <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> -->
        <h3 class="modal-title form-signin-heading text-center" id="loginLabel">Autenticazione</h3>
      </div>
      <form id="auth" class="form-signin" data-refresh="0" data-async data-validate data-target="#login [name='feedback']" 
        method="POST" action> <!-- todo@buisnesslogic -->
      <div class="modal-body" style="background-color: #f5f5f5;">
<!-- ?php if($user): ? -->
        <input type="hidden" id="auth_id" name="id" value="">
        <input type="hidden" id="auth_username" name="username" value="">
        <input type="hidden" id="auth_name" name="name" value="">
        <input type="hidden" id="auth_email" name="email" value="">
<!-- ?php endif; ? -->
        <span name="feedback"></span>
        
         <div class="form-group">
            <label for="inputUsername" class="sr-only">Nome Utente</label>
                <input name="username" data-validation="required" 
                    data-validation-error-msg="Questo campo è obbligatorio!" 
                    id="inputUsername" class="form-control" placeholder="Nome Utente">
         </div>
         
         <div class="form-group">
            <label for="inputPassword" class="sr-only">Password</label>
                <input name="password" data-validation="required" type="password" 
                    data-validation-error-msg="Questo campo è obbligatorio!" 
                    id="inputPassword" class="form-control" placeholder="Password">
        </div>
        
        <div class="checkbox">
          <label for="checkboxRemember">Ricordami</label>
                <input  name="rememberme" id="checkboxRemember" type="checkbox" value="1" checked="checked">
        </div>
        <button class="btn btn-primary btn-block" type="submit">Entra</button>
      </div>
    </form>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->