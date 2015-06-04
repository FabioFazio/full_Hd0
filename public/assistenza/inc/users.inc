<script type="text/javascript">
<!--
var $modal = $( '#usersModal' ); 
var tableUsers = null;
var selectQueues = null;
var selectFps = null;

var table_users_options = {
		"order": [[ 1, "asc" ]],	    
		"aoColumnDefs" : [{
				"bSortable" : false,
				"aTargets" : [ 0 ],
		},{
				"sClass": "center",
				"aTargets": [ 4, 6, 7, 8 ]
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

var duallist_default_options = {
		  preserveSelectionOnMove: 'moved',
		  moveOnSelect: false,
		  filterTextClear: 'Mostrali tutti',
		  filterPlaceHolder: 'Filtro di ricerca',
		  moveSelectedLabel: 'Attiva gli elementi selezionati',
		  moveAllLabel: 'Attivali tutti',
		  removeSelectedLabel: 'Disattiva gli elementi selezionati',
		  removeAllLabel: 'Disattivali tutti',
		  selectorMinimalHeight: 100, //100 is default
		  infoText:	'Mostra tutti i {0} elementi',
		  infoTextFiltered: '<span class="label label-warning">Filtro Attivo</span> {0} di {1}',
		  infoTextEmpty: 'Lista vuota',
	    };

var duallist_queues_options = $.extend(true, {}, duallist_default_options);
duallist_queues_options.nonSelectedListLabel = '<span class="h4">Categorie di Segnalazione disponibili</span>';
duallist_queues_options.selectedListLabel = '<p class="h4 text-info">Categorie seguite come Utente</p>';

var duallist_fps_options = $.extend(true, {}, duallist_default_options);
duallist_fps_options.nonSelectedListLabel = '<span class="h4">Categorie di Segnalazione disponibili</span>';
duallist_fps_options.selectedListLabel = '<p class="h4 text-danger">Categorie seguite come Focal Point</p>';

var confirmation_delete_user_options = $.extend(true, {}, confirmation_delete_options);
confirmation_delete_user_options.onConfirm = function(){userDelete(toastr, this);};

$( function($) {

    usersInit();
	
    $('#usersModal').on('show.bs.modal', function (e) {
    	$(this).find('form').attr('action',user_save_url);
        usersLoad(e);
    });
});
-->
</script>

<!-- Modal -->
<div class="modal fade in" id="usersModal">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h3 class="modal-title form-signin-heading text-center">Pannello di Controllo degli Utenti Hd0</h3>
            </div>

            <div class="modal-body">
            
                <div id="usersEditor" data-flip="#usersList" class="hidden">
                <form id="userForm" data-async method="post" data-validate action>
                        
                        <input type="hidden" name="id" value="0"/>
                        <input type="hidden" name="secret" value="0"/>
                
           				<div class="row">
            				<div class="col-md-4">
            					
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
                                    <div class="panel-heading" id="labelPass" role="tab">
                                        <h3 class="panel-title strong text-center">
                                            <a href="#pass" aria-controls="pass" aria-expanded="true" data-toggle="collapse">
                                                Password
                                            </a>
                                        </h3>
                                    </div>
                                    
                                        <div class="panel-collapse collpse in" role="tabpanel" aria-labeledby="labelPass" id="pass">
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
                                
                                
                                <div class="form-group input-group col-md-12">
                                    <label for="sector" class="control-label">
                                       <i class="glyphicon glyphicon-list"></i> Settore Aziendale
                                    </label>
                                    <select class="form-control valid" name="sector" aria-invalid="false">
                                        <option value="0" selected="selected">--- Non Definito ---</option>
                                    </select>
                                </div>
                                
                               <div class="form-group input-group bg-danger col-md-12">
                                    <label for="administrator" class="control-label alert-danger input-group-addon">
                                       <i class="glyphicon glyphicon-check"></i> Privilegi di Amministratore
                                    </label>
                                    
                                    <div class="form-control checkbox">
                                      <label class="pull-right">
                                        <input type="checkbox" name="administrator" value="1">
                                      </label>
                                    </div>
                                    
                                </div>
                           </div>     
                                                        
                            <div class="col-md-8 row">
                                <div class="form-group col-md-12 well well-xs">
                                    <select multiple="multiple" size="10" id="user-queues" name="queues[]">
                                    </select>
                                </div><div class="form-group col-md-12 well well-xs">
                                    <select multiple="multiple" size="10" id="user-focalpoint" name="focalpoint[]">
                                      </select>
                                </div>        
                            </div>
                        </div>

                       <div class="text-right" style="margin-top: 10px;">
                            <button type="submit" class="btn btn-success">Salva</button>
                            <button data-hide="#usersEditor" type="button" class="btn btn-default">Annulla</button>
                        </div>
                    </form>
                 </div>


                 <div id="usersList" data-flip="#usersEditor" class="table-responsive">
                 
                     <table id="users" class="display" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Nome Utente</th>
                          <th>Nome Completo</th>
                          <th>Email</th>
                          <th>Password</th>
                          <th>Settore di Appartenenza</th>
                          <th>Categorie Utente</th>                          
                          <th>Categorie Focal&nbsp;Point</th>
                          <th>Amministratore</th>
                        </tr>
                      </thead>

                      <tbody>
                      </tbody>

                    </table>
                    
                    <div class="text-right" style="margin-top: 10px;">
                        <button data-show="#usersEditor" type="button" data-id="0" class="btn btn-primary">
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
