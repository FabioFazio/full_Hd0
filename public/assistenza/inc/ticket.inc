<script type="text/javascript">
<!--
$( function($) {
	
    $('#ticketModal').on('show.bs.modal', function (e) {
    	   $(this).find('form').attr('action',ticket_save_url);
    		onShowTicketModal(e);
		});       
});
-->
</script>

<!-- Pref Modal -->
<div id="ticketModal" class="modal fade" tabindex="-2" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
		    <form method="post" data-validate data-refresh="3000" data-async data-target="#ticketModal [name='feedback']" method="POST"
		      action>
		    
		    <div class="zero-clipboard" data-name="queue-name" data-prop="title" title="Queue" >
		      <span class="queue-color btn-clipboard" >
		          <span id="ticketQueue" data-name="queue-name"></span>
		          <span class="glyphicon glyphicon-tag"></span>
	          </span>
          </div>
		    
			<div class="modal-header b-grey">
				<button type="button" class="close" data-dismiss="modal"
					aria-hidden="true">&times;</button>
				<div class="row">
    				<div class="col-md-9">	
    				    <input type="text" class="form-control" name="title" 
    				        data-name="ticket-title" data-prop="value" placeholder="Titolo..."
    				        data-validation-error-msg="Campo obbligatorio non superiore a 50 caratteri"
                            data-validation="required length" 
                            data-validation-length="max50"
				        />
    				</div>
				</div>
			</div>
			<div class="modal-body">
    			<div class="row">
        			<span name="feedback"></span>
        			<span name="hint"></span>
    
    				<input name="id" type="hidden" value="0" />
    				<input name="num" type="hidden" value="0" />
    				<input name="service-id" type="hidden" value="" />
    				<input name="queue-id" type="hidden" value="" />
    				<input name="queue-name" type="hidden" value="" />
    				<input name="queue-color" type="hidden" value="" />
    				<input name="articles" type="hidden" value="" />
    				<input name="taxonomie" type="hidden" value="" />
    				
    				<div class="col-md-9">
        				    
   				        <textarea class="col-md-12 form-control" name="description"
   				            data-name="ticket-desc" data-prop="value" placeholder="Descrizione..."
     				        data-validation-error-msg="Testo atteso non inferiore a 25 caratteri"
                            data-validation="length" 
                            data-validation-length="min25"></textarea>
    				</div>
    				<div class="col-md-3">
    				    <div id="priority" data-toggle="buttons">
    				        <label title="Non posso lavorare!" class="btn btn-default"><input name="priority" data-name="ticket-priority" data-prop="checked" type="checkbox" />Bloccante <span class="glyphicon glyphicon-exclamation-sign alert-danger"></span></label>
    				    </div>
    				    <div id="taxonomie" class="row text-center"></div>
    				</div>
<!-- start@articles -->
    				<div class="col-md-12">
    				
    				     <div class="well alert articoli">
                            <h4 class="article-title"><span title="aggiornamenti" class="glyphicon glyphicon-comment"></span> Aggiornamenti</h4>
    				        <p class="text-center"><em><a data-toggle="alert"
			                ><b>[Demo]</b> Come inviare un nuovo Aggiornamento ...</a></em></p>
			                
			                <div class="panel-group" id="articoli" role="tablist" aria-multiselectable="true">
			                     <div class="panel panel-default mock hidden">
			                         <div class="panel-heading" role="tab" id="h_a0">
			                             <h4 class="panel-title">
			                                <a data-toggle="collapse" data-parent="#articoli" href="#a0" aria-expanded="false" aria-controls="a0">
                                                Da: <span data-name="authorName">Autore</span>
                                            </a>
                                            <em class="pull-right small"><span data-name="created">aaaa-mm-gg hh:mm:ss</span></em>
                                         </h4>
			                         </div>
			                         <div id="a0" class="panel-collapse collapse" role="tabpanel" aria-labelledby="h_a0">
                                          <div class="panel-body">
                                            <span data-name="body">Testo</span>
                                          </div>
			                         </div>
			                     </div>
			                </div>    				     
    				    </div>
    				</div>
<!-- end@articles -->
				</div>
            </div>
			<div class="modal-footer b-grey">
			     <!-- if wizards disabled="disabled" che lo attiva lui -->
				<button id="send" type="submit" class="btn btn-info">
				    <span class="glyphicon glyphicon-send"></span> Invia
                </button>
				<button id="cancel" type="button" class="btn btn-default" data-dismiss="modal">
				    Annulla
                </button>
                <button id="close" type="button" class="btn btn-default hidden" data-dismiss="modal">
				    Chiudi
                </button>
			</div>
		</form>
		</div>
	</div>
</div>    				