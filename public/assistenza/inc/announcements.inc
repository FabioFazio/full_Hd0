<script type="text/javascript">
<!--
var $msgsMod = $( '#msgsModal' ); 

var tableMsgs = null;

var table_msgs_options = {
		"order": [[ 1, "asc" ]],	    
		"aoColumnDefs" : [{
				"bSortable" : false,
				"aTargets" : [ 0 ],
		},{
				"sClass": "center",
				"aTargets": [ 1 ]
		},{
    			"sClass": "text-nowrap",
    			"aTargets": [ 0 ]
		}],
		"iDisplayLength" : 5,
		"lengthMenu": [ 5, 25, 50, 75, 100 ],
		"language": {
			   "url": "js/Italian.json",
        },
        "dom": '<"row"<"col-md-5"l><"col-md-5"i><"col-md-2"f>><"well"t>p',
        "fnInitComplete": function(){},
};

var confirmation_delete_msg_options = $.extend(true, {}, confirmation_delete_options);
confirmation_delete_msg_options.onConfirm = function(){msgDelete(toastr, this);};

$( function($) {

    msgsInit();
	
    $msgsMod.on('show.bs.modal', function (e) {
    	$(this).find('form').attr('action',msgs_save_url);
        msgsLoad(e);
    });
});
-->
</script>

<!-- Modal -->
<div class="modal fade in" id="msgsModal">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h3 class="modal-title form-signin-heading text-center">Gestione del Servizio di Notifiche</h3>
            </div>

            <div class="modal-body">
            
                <div id="msgsEditor" data-flip="#msgsList" class="hidden">
                <form id="msgForm" data-async method="post" data-validate action>
                        
                        <input type="hidden" name="id" value="0"/>
                        <input type="hidden" name="secret" value="0"/>
                
           				<div class="row">
            				<div class="col-md-6">
            					
            					<div class="form-group input-group col-md-12">
                                    <label for="message" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Testo del Messaggio
                                    </label>
                				    <textarea class="form-control text-right" name="message" 
                				        placeholder="Testo del messaggio"
                				        data-validation-error-msg="Atteso un messaggio non vuoto di massima 500 caratteri"
                                        data-validation="length" 
                                        data-validation-length="1-500">
                				    </textarea>
                                </div>
                                
                                <div class="form-group input-group col-md-12">
                                    <label for="sector" class="control-label">
                                       <i class="glyphicon glyphicon-list"></i> Settore Aziendale a cui &egrave; rivolto
                                    </label>
                                    <select class="form-control valid" name="sector" aria-invalid="false">
                                        <option value="0" selected="selected">--- Non Definito ---</option>
                                    </select>
                                </div>
                                
                        </div>
                        
                        <div class="col-md-6">

                            <div class="form-group input-group bg-danger col-md-12">
                                    <label for="warning" class="control-label alert-danger input-group-addon">
                                       <i class="glyphicon glyphicon-check"></i> Messaggio Urgente!
                                    </label>

                                    <div class="form-control checkbox">
                                      <label class="pull-right">
                                        <input type="checkbox" name="warning" value="1">
                                      </label>
                                    </div>
                                    
                                </div>
                                
                               <div class="form-group input-group bg-danger col-md-12">
                                    <label for="broadcast" class="control-label alert-warning input-group-addon">
                                       <i class="glyphicon glyphicon-check"></i> Messaggio Pubblico
                                    </label>

                                    <div class="form-control checkbox">
                                      <label class="pull-right">
                                        <input type="checkbox" name="broadcast" value="1">
                                      </label>
                                    </div>
                                    
                                </div>
                           </div>     
                                                        
                            <div class="col-md-6 row">
        
                            </div>
                        </div>

                       <div class="text-right" style="margin-top: 10px;">
                            <button type="submit" class="btn btn-success">Salva</button>
                            <button data-hide="#msgsEditor" type="button" class="btn btn-default">Annulla</button>
                        </div>
                    </form>
                 </div>


                 <div id="msgsList" data-flip="#msgsEditor" class="table-responsive">
                 
                     <table id="msgs" class="display" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Testo del messaggio</th>
                          <th>Destinatari</th>
                          <th>Tipo di Messaggio</th>
                          <th>Ultima Modifica</th>
                          <th>Autore Ultima Modifica</th>
                        </tr>
                      </thead>

                      <tbody>
                      
                      </tbody>

                    </table>
                    
                    <div class="text-right" style="margin-top: 10px;">
                        <button data-show="#msgsEditor" type="button" data-id="0" class="btn btn-primary">
                            <span class="glyphicon glyphicon-plus"></span> Aggiungi
                        </button>                        
                        <button type="button" class="btn btn-default" data-dismiss="modal">
                            Chiudi
                        </button>
                    </div>
                    
                </div>
                
            </div><!-- /.modal-body -->    
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal-content -->
</div><!-- /.modal -->
