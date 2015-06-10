<script type="text/javascript">
<!--
var $filtersMod = $('#filtersModal');
var tableFilters = null;

var table_filters_options = {
		"order": [[ 1, "asc" ]],	    
		"aoColumnDefs" : [{
				"bSortable" : false,
				"aTargets" : [ 0 ],
		},{
				"sClass": "center",
				"aTargets": [ 3 ]
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

var confirmation_delete_filter_options      = $.extend(true, {}, confirmation_delete_options);
confirmation_delete_filter_options.onConfirm    = function(){filterDelete(toastr, this);};

$( function($) {

    filtersInit();
	
    $filtersMod.on('show.bs.modal', function (e) {
    	$(this).find('#filterForm')
 	      .attr('action', filter_save_url);
        filtersLoad(e);
    });
});
-->
</script>

<!-- Modal -->
<div class="modal fade in" id="filtersModal">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h3 class="modal-title form-signin-heading text-center">Pannello di Controllo dei Filtri di Cateogrie</h3>
            </div>

            <div class="modal-body">
            
            <div id="filtersEditor" data-flip="#filtersList" class="hidden">
                <form id="filterForm" data-async method="post" data-validate action="">
                        
                        <input type="hidden" name="id" value="0"/>
                        <input type="hidden" name="ids" value="0"/>
                        <input type="hidden" name="node" value="0"/>
                        <input type="hidden" name="secret" value="0"/>
                
           				<div class="row">
            				<div class="col-md-6">
            					
                                <div class="form-group input-group col-md-12">
                                    <label for="queue" class="control-label">
                                       <i class="glyphicon glyphicon-list"></i> Categoria di Segnalazione
                                    </label>
                                    <select class="form-control valid" name="queue" aria-invalid="false"
                				        data-validation-error-msg="Selezionare una categoria disponibile. Se non presenti, cancellare prima un vecchio filtro!"
                                        data-validation="select" >
                                        <option value="0" selected="selected">--- Non Definito ---</option>
                                    </select>
                                </div>
                                
                                <div class="form-group input-group col-md-12">
                                    <label for="type" class="control-label">
                                       <i class="glyphicon glyphicon-list"></i> Tipologia di Filtro
                                    </label>
                                    <select class="form-control valid" name="type" aria-invalid="false">
                                        <option value="0" selected="selected">--- Non Definito ---</option>
                                        <option value="1">Rivolgi una Domanda</option>
                                        <option value="2">Apri la Segnalazione</option>
                                        <option value="3">Inibisci la Segnalazione</option>
                                    </select>
                                </div>
                                
                                <div class="form-group input-group col-md-12 hidden">
                                    <label for="prevQuestion" class="control-label">
                                       <i class="glyphicon glyphicon-list"></i> Domanda Precedente
                                    </label>
                				    <input type="text" class="form-control text-right" name="prevQuestion" 
                				        disabled="disabled" value=""
                				        />
                                </div>
                                
               					<div class="form-group input-group col-md-12 hidden">
                                    <label for="responce" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Risposta
                                    </label>
                				    <input type="text" class="form-control text-right" name="responce" 
                				        placeholder="Risposta al filtro"
                				        data-validation-error-msg="Campo non vuoto con lunghezza massima supportata a 255 caratteri"
                                        data-validation="required length" 
                                        data-validation-length="max255"
                				        />
                                </div>
                                 
            					<div class="form-group input-group col-md-12 hidden">
                                    <label for="question" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i>
                                        <span id="questionLabel">Messaggio / Domanda</span>
                                    </label>
                				    <input type="text" class="form-control text-right" name="question" 
                				        placeholder="Motivazione inibzione apertura / Nuovo Filtro"
                				        data-validation-error-msg="Campo non vuoto con lunghezza non superiore a 255 caratteri"
                                        data-validation="required length"
                                        data-validation-length="max255" 
                				        />
                                </div>
                           </div>     
                                                        
                            <div class="col-md-6 well well-sm hidden">
                                
                                <table id="responces" class="table table-striped table-condensed table-bordered text-center">
                                    <thead>
                                        <tr>
                                            <th colspan="4" class="alert-info text-center">Risposte alla Domnada di Filtro</th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th class="btn-default">Risposta</th>
                                            <th class="btn-default">Azione</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                                
                                <div class="text-right" style="margin-top: 10px;">
                                    <button data-show="#filtersEditor" type="button" data-id="0"
                                            class="btn btn-sm btn-primary">
                                        <span class="glyphicon glyphicon-plus"></span> Aggiungi
                                    </button>                        
                                </div>
                                
                            </div>
                        </div>

                       <div class="text-right" style="margin-top: 10px;">
                            <button type="submit" class="btn btn-success">Salva</button>
                            <button data-hide="#filtersEditor" type="button" class="btn btn-default">Annulla</button>
                        </div>
                    </form>
                 </div>


                 <div id="filtersList" data-flip="#filtersEditor" class="table-responsive">
                 
                     <table id="filters" class="display" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Categoria di Segnalazione</th>
                          <th>Messaggio / Domanda</th>
                          <th>Scelte</th>
                        </tr>
                      </thead>

                      <tbody>
                      </tbody>

                    </table>
                    
                    <div class="text-right" style="margin-top: 10px;">
                        <button data-show="#filtersEditor" type="button" data-id="0" class="btn btn-primary">
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
