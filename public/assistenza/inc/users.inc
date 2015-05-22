<script type="text/javascript">
<!--
$( function($) {

	$( '#usersModal div.modal-xl' ).css( "width", $(window).innerWidth()-50 );
	
	$('#users').DataTable({
		"order": [[ 1, "asc" ]],	    
		"aoColumnDefs" : [{
				"bSortable" : false,
				"aTargets" : [ 0 ],
		},{
				"sClass": "center",
				"aTargets": [ 6, 7, 8 ]
		}],
		"iDisplayLength" : 5,
		"lengthMenu": [ 5, 25, 50, 75, 100 ],
		"language": {
			   "url": "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Italian.json",
        },
        "dom": '<"row"<"col-md-5"l><"col-md-5"i><"col-md-2"f>><"well"t>p',
        "fnInitComplete": function(){},
	});

    var duallist_default_options = {
		  preserveSelectionOnMove: 'moved',
		  moveOnSelect: false,
		  filterTextClear: 'Mostrali tutti',
		  filterPlaceHolder: 'Filtro di ricerca',
		  moveSelectedLabel: 'Sposta gli elementi selezionati',
		  moveAllLabel: 'Spostali tutti',
		  removeSelectedLabel: 'Rimuovi gli elementi selezionati',
		  removeAllLabel: 'Rimuovili tutti',
		  selectorMinimalHeight: 100, //100 is default
		  infoText:	'Mostra tutti i {0} elementi',
		  infoTextFiltered: '<span class="label label-warning">Filtro Attivo</span> {0} di {1}',
		  infoTextEmpty: 'Lista vuota',
	    };

    var user_queues_options = JSON.parse(JSON.stringify(duallist_default_options));
    user_queues_options.nonSelectedListLabel = '<span class="h4">Categorie di Segnalazione disponibili</span>';
    user_queues_options.selectedListLabel = '<p class="h4 text-info">Categorie seguite come Utente</p>';

    var user_fps_options = JSON.parse(JSON.stringify(duallist_default_options));
    user_fps_options.nonSelectedListLabel = '<span class="h4">Categorie di Segnalazione disponibili</span>';
    user_fps_options.selectedListLabel = '<p class="h4 text-danger">Categorie seguite come Focal Point</p>';
	
	$('#user-queues').bootstrapDualListbox(user_queues_options);
	$('#user-fps').bootstrapDualListbox(user_fps_options);
	
    $('#usersModal').on('show.bs.modal', function (e) {
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
                <form data-validate>
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
                				    <input type="text" class="form-control text-right" name="email" 
                				        placeholder="Email aziendale"
                				        data-validation-error-msg="Inserire una email di lavoro valida (@iper.it, @ortofin.it o @unes.it)"
                                        data-validation="email domain required" 
                				        />
                                </div>
                                                                
            					<div class="form-group input-group col-md-12">
                                    <label for="password_confirmation" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Cambia Password
                                    </label>
                				    <input type="password" class="form-control text-right" name="password_confirmation"
                				        placeholder="Password" 
                                        data-validation-error-msg="Password non abbastanza sicura"
                                        data-validation="strength"
                                        data-validation-strength="1"
                                        />
                                </div>                                
                                                                
            					<div class="form-group input-group col-md-12">
                                    <label for="password" class="control-label">
                                        <i class="glyphicon glyphicon-edit"></i> Conferma Password
                                    </label>
                                    <input type="password" class="form-control text-right" name="password" 
                                        placeholder="Conferma Password"
                                        data-validation="confirmation"
                                        data-validation-error-msg="Riscrivere la password per conferma!"
                                        />
                                </div>
                                
                                <div class="form-group input-group col-md-12">
                                    <label for="newsId" class="control-label">
                                       <i class="glyphicon glyphicon-list"></i> Settore Aziendale
                                    </label>
                                    <select class="form-control valid" id="newsId" name="newsId" aria-invalid="false">
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
                                                        
                            <div class="col-md-8 row">
                                <div class="form-group col-md-12">
                                    <select multiple="multiple" size="10" id="user-queues" name="userQueues[]">
                                        <option value="option1">Option 1</option>
                                        <option value="option2">Option 2</option>
                                        <option value="option3" selected="selected">Option 3</option>
                                        <option value="option4">Option 4</option>
                                        <option value="option5">Option 5</option>
                                        <option value="option6" selected="selected">Option 6</option>
                                        <option value="option7">Option 7</option>
                                        <option value="option8">Option 8</option>
                                        <option value="option9">Option 9</option>
                                        <option value="option10">Option 10</option>
                                    </select>
                                </div><div class="form-group col-md-12">
                                    <select multiple="multiple" size="10" id="user-fps" name="userFps[]">
                                        <option value="option1">Option 1</option>
                                        <option value="option2">Option 2</option>
                                        <option value="option3" selected="selected">Option 3</option>
                                        <option value="option4">Option 4</option>
                                        <option value="option5">Option 5</option>
                                        <option value="option6" selected="selected">Option 6</option>
                                        <option value="option7">Option 7</option>
                                        <option value="option8">Option 8</option>
                                        <option value="option9">Option 9</option>
                                        <option value="option10">Option 10</option>
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
                          <th>Servizi ICT</th>                          
                          <th>Focal Point</th>
                          <th>Amministratore</th>
                        </tr>
                      </thead>


                      <tbody>
                        <tr>
                            <td>
                                <a title="Modifica" class="btn btn-sm btn-info" data-show="#usersEditor">
                                    <span class="glyphicon glyphicon-pencil"></span>
                                </a>
                                <a class="btn btn-sm btn-danger" data-toggle="confirmation"
                                    title="" data-original-title="Vuoi davvero cancellare questo utente in modo permanente?">
                                    <span class="glyphicon glyphicon-trash"></span>
                                </a>
                            </td>
                          <td>fabio</td>
                          <td>Fabio</td>
                          <td>fabio.fazio@zenatek.it</td>
                          <td>*****</td>
                          <td>Busnago-Scatolame-Profumeria</td>
                          <td>1</td>
                          <td>0</td>
                          <td>Falso</td>
                        </tr>

                        <tr>
                            <td>
                                <a title="Modifica" class="btn btn-sm btn-info" data-show="#usersEditor">
                                    <span class="glyphicon glyphicon-pencil"></span>
                                </a>
                                <a class="btn btn-sm btn-danger" data-toggle="confirmation"
                                    title="" data-original-title="Vuoi davvero cancellare questo utente in modo permanente?">
                                    <span class="glyphicon glyphicon-trash"></span>
                                </a>
                            </td>
                            <td>fabio</td>
                            <td>Fabio</td>
                            <td>fabio.fazio@zenatek.it</td>
                            <td>*****</td>
                            <td>Busnago-Scatolame-Profumeria</td>
                            <td>1</td>
                            <td>0</td>
                            <td>Falso</td>
                        </tr>                        
                      </tbody>

                    </table>
                    
                    <div class="text-right" style="margin-top: 10px;">
                        <button data-show="#usersEditor" type="button" class="btn btn-primary">
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
