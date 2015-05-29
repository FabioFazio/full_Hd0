<script type="text/javascript">
<!--
var tableStores = null;

var table_stores_options = {
		"order": [[ 1, "asc" ]],	    
		"aoColumnDefs" : [{
				"bSortable" : false,
				"aTargets" : [ 0 ],
		},{
				"sClass": "center",
				"aTargets": [ 4 ]
		},{
    			"sClass": "text-nowrap",
    			"aTargets": [ 0 ]
		}],
		"iDisplayLength" : 5,
		"lengthMenu": [ 5, 25, 50, 75, 100 ],
		"language": {
			   "url": "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Italian.json",
        },
        "dom": '<"row"<"col-md-5"l><"col-md-5"i><"col-md-2"f>><"well"t>p',
        "fnInitComplete": function(){},
};

var confirmation_delete_store_options = $.extend(true, {}, confirmation_delete_options);
confirmation_delete_store_options.onConfirm = function(){storeDelete(toastr, this);};

$( function($) {

    storesInit();
	
    $('#storesModal').on('show.bs.modal', function (e) {
    	$(this).find('form').attr('action',store_save_url);
        storesLoad(e);
    });
});
-->
</script>

<!-- Modal -->
<div class="modal fade in" id="storesModal">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h3 class="modal-title form-signin-heading text-center">Pannello di Controllo dei Punti Vendita</h3>
            </div>

            <div class="modal-body">
            
                <div id="storesEditor" data-flip="#storesList" class="hidden">
                <form id="storeForm" data-async method="post" data-validate action="">
                        
                        <input type="hidden" name="id" value="0"/>
                        <input type="hidden" name="secret" value="0"/>
                
           				<div class="row">
            				<div class="col-md-6">
            					
            					<div class="form-group input-group col-md-12">
                                    <label for="username" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Nome Utente
                                    </label>
                				    <input type="text" class="form-control text-right" name="username" 
                				        placeholder="Nome Utente"
                				        data-validation-error-msg="Lunghezza attesa tra 3 e 12 caratteri alfanumerici"
                                        data-validation="alphanumeric length" 
                                        data-validation-length="3-12"
                				        />
                                </div>
                                
            					<div class="form-group input-group col-md-12">
                                    <label for="name" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Nome Completo
                                    </label>
                				    <input type="text" class="form-control text-right" name="name" 
                				        placeholder="Nome completo"
                				        data-validation-error-msg="Campo non superiore a 50 caratteri"
                                        data-validation="length" 
                                        data-validation-length="max50"
                				        />
                                </div>
                                 
            					<div class="form-group input-group col-md-12">
                                    <label for="email" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Email
                                    </label>
                				    <input type="email" class="form-control text-right" name="email" 
                				        placeholder="Email aziendale"
                				        data-validation-error-msg="Inserire una email di lavoro valida (@iper.it, @ortofin.it o @unes.it)"
                                        data-validation="email domain required" 
                				        />
                                </div>
                                
                                
                                 <div role="tablist" class="panel panel-default">
                                    <div class="panel-heading" id="labelSPass" role="tab">
                                        <h3 class="panel-title strong text-center">
                                            <a href="#spass" aria-controls="spass" aria-expanded="true" data-toggle="collapse">
                                                Password
                                            </a>
                                        </h3>
                                    </div>
                                    
                                        <div class="panel-collapse collpse in" role="tabpanel" aria-labeledby="labelSPass" id="spass">
                                            <div class="panle-bpdy">
                            					<div class="form-group input-group col-md-12" style="margin-top: 15px;">
                                                    <label for="password_confirmation" class="control-label">
                                                        <i class="glyphicon glyphicon-edit"></i> Nuova Password
                                                    </label>
                                				    <input type="password" class="form-control text-right" name="password_confirmation"
                                				        placeholder="Nuova Password" 
                                                        data-validation-error-msg="Password non abbastanza sicura"
                                                        data-validation="strength"
                                                        data-validation-strength="1"
                                                        />
                                                </div>                                
                                                                                
                            					<div class="form-group input-group col-md-12">
                                                    <label for="password" class="control-label">
                                                        <i class="glyphicon glyphicon-edit"></i> Conferma Nuova Password
                                                    </label>
                                                    <input type="password" class="form-control text-right" name="password" 
                                                        placeholder="Conferma Password"
                                                        data-validation="confirmation"
                                                        data-validation-error-msg="Riscrivere la password per conferma!"
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                    
                                </div>
                                
                           </div>     
                                                        
                            <div class="col-md-6">

                                <div class="form-group input-group col-md-12">
                                    <label for="sector" class="control-label">
                                       <i class="glyphicon glyphicon-list"></i> Settore Aziendale
                                    </label>
                                    <select class="form-control valid" name="sector" aria-invalid="false">
                                        <option value="0" selected="selected">--- Non Definito ---</option>
                                    </select>
                                </div>
                                
                               <div class="form-group input-group bg-danger col-md-12">
                                    <label for="newsId" class="control-label alert-danger input-group-addon">
                                       <i class="glyphicon glyphicon-check"></i> Privilegi di Amministratore
                                    </label>
                                    
                                    <div class="form-control checkbox">
                                      <label class="pull-right">
                                        <input type="checkbox" name="administrator" value="1">
                                      </label>
                                    </div>
                                    
                                </div>                            
                            </div>
                        </div>

                       <div class="text-right" style="margin-top: 10px;">
                            <button type="submit" class="btn btn-success">Salva</button>
                            <button data-hide="#storesEditor" type="button" class="btn btn-default">Annulla</button>
                        </div>
                    </form>
                 </div>


                 <div id="storesList" data-flip="#storesEditor" class="table-responsive">
                 
                     <table id="stores" class="display" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Nome Punto Vendita</th>
                          <th>Indirizzo</th>
                          <th>Responsabile</th>
                          <th>Dipartimenti</th>
                        </tr>
                      </thead>

                      <tbody>
                      </tbody>

                    </table>
                    
                    <div class="text-right" style="margin-top: 10px;">
                        <button data-show="#storesEditor" type="button" data-id="0" class="btn btn-primary">
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
