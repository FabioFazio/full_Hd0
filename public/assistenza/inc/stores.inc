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
                                    <label for="name" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Nome Punto Vendita
                                    </label>
                				    <input type="text" class="form-control text-right" name="name" 
                				        placeholder="Nome completo"
                				        data-validation-error-msg="Lunghezza attesa tra 3 e 25 caratteri alfanumerici"
                                        data-validation="required alphanumeric length" 
                                        data-validation-length="3-25"
                				        />
                                </div>
                                 
            					<div class="form-group input-group col-md-12">
                                    <label for="address" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Indirizzo
                                    </label>
                				    <input type="text" class="form-control text-right" name="address" 
                				        placeholder="Indirizzo"
                				        data-validation-error-msg="Lunghezza attesa non superiore a 50 caratteri"
                                        data-validation="length"
                                        data-validation-length="max50" 
                				        />
                                </div>
    
                                <div class="form-group input-group col-md-12">
                                    <label for="manager" class="control-label">
                                       <i class="glyphicon glyphicon-user"></i> Responsabile
                                    </label>
                                    <select class="form-control valid" name="manager" aria-invalid="false">
                                        <option value="0" selected="selected">--- Non Definito ---</option>
                                    </select>
                                </div>
                           </div>     
                                                        
                            <div class="col-md-6">
                                
                               <div class="form-group input-group bg-danger col-md-12">
                                    <label for="sectorList" class="control-label alert-info input-group-addon">
                                       Dipartimenti
                                    </label>
                                    <div class="form-control well well-sm">
                                        <table class="table table-striped table-condensed text-center">
                                            <thead>
                                                <tr>
                                                    <th>Nome Dipartimento</th>
                                                    <th>Responsabile di Dipartimento</th>
                                                    <th>Settori Relativi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="mock">Nome</td>
                                                    <td class="mock">Responsabile</td>
                                                    <td class="mock">1</td>
                                                </tr>
                                                <tr>
                                                    <td class="mock">Nome</td>
                                                    <td class="mock">Responsabile</td>
                                                    <td class="mock">1</td>
                                                </tr>
                                                <tr>
                                                    <td class="mock">Nome</td>
                                                    <td class="mock">Responsabile</td>
                                                    <td class="mock">1</td>
                                                </tr>
                                            </tbody>
                                        </table>
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