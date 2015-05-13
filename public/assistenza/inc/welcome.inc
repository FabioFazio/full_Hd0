<script type="text/javascript">
<!--
$( function($) {
//  $( '#welcome' ).modal({
// 	});

    $( '#welcome div.modal-xl' ).css( "width", $(window).innerWidth()-50 );
	
    $('#welcome').on('hidden.bs.modal', function (e) {
        if (e) {
        	if ( !authenticated ) {
	            $( '#login' ).modal({
	                keyboard : false,
	                backdrop: 'static',
	            });
        	} else {
				content();
            }
        }
    });
});
-->
</script>

<!-- Modal -->
<div class="modal fade in" id="welcome" tabindex="-1" role="dialog" aria-labelledby="loginLabel" aria-hidden="true">
  
  <!--  <div class="modal-dialog visible-lg-modal-xl visible-md-modal-xl visible-sm-modal-l visible-xs-modal-m"> -->
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header" style="background-color: #f5f5f5;">
         <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3 class="modal-title form-signin-heading text-center" id="loginLabel">translate('Benvenuto/a nel servizio di Help Desk')</h3>
      </div>
        <div class="modal-body">
            <div class="row" style="margin: 50px 0px;">
                <div class=" col-md-offset-4 col-md-4">
                    <img src="img/zenatek.png" width="100%" height="100%">
                </div>
            </div>
            <div class="row">
                <div class="col-md-10 col-md-offset-1">
                <h4>
                    translate('
                            Benvenuto, questa è la tua interfaccia al servizio %s dedicato agli utenti di %s!'),
                       'Help Desk', 'Iper Montebello')
                   <br />
                    translate('
                            Grazie a questa applicazione puoi accedere con una unica interfaccia a ');
                    <span class="strong">translate('tutti servizi di assistenza')</span>
                    translate('
                            erogati dal %s tramite un qualsiasi browser http,
                            inviando una opportuna segnalazione (trouble ticket).'),
                        'S.I. Gruppo Iper');
                </h4>
                <h4>
                translate("
                            La tua segnalazione determinerà l'analisi e l’identificazione
                            delle cause delle anomalie e l'attivazione di tutte le azioni
                            necessarie alla rimozione delle stesse, per il ripristino 
                            delle corrette funzionalità operative.");
                </h4>
                <h4><ul><li>
                    translate('
                            identificazione utente');
                    </li><li>
                        translate('
                            <b>registrazione</b> del trouble ticket relativo alla <b>segnalazione</b>');
                    </li><li>
                        translate('
                            <b>presa in carico</b> ed <b>analisi</b> del ticket');
                    </li><li>
                        translate('
                            assegnazione del ticket a personale con competenze specifiche');
                    </li><li>
                        translate('
                            lavorazione e <b>risoluzione</b> (mediante eventuale escalation)');
                    </li><li>
                       translate('
                            <b>chiusura</b> del ticket');
                    </li></ul>
                </h4>
                </div>
            </div>

<script type="text/javascript">
<!--
var button;
if (!authenticated) {
    button = '<button class="btn btn-primary btn-lg btn-block" type="button" data-dismiss="modal">translate("Entra")</button>';
} else {
    button = '<button class="btn btn-success btn-lg btn-block" type="button" data-dismiss="modal">translate("Continua")</button>';
}
$(function(){
	$('#welcome-bottom').html(button);
});
-->
</script>
            
            <div id="welcome-bottom" class="row col-md-10 col-md-offset-1" style="margin-top: 20px;">    
            </div>

		</div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
 
</div><!-- /.modal -->