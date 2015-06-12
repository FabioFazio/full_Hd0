<script type="text/javascript">
<!--
var $reportsMod = $( '#reportsModal' ); 

var tableReports = null;

var table_reports_options = {
		"order": [[ 1, "asc" ]],	    
		"aoColumnDefs" : [{
				"bSortable" : false,
				"aTargets" : [ 0 ],
		},{
    			"sClass": "text-nowrap center",
    			"aTargets": [ 0 ]
		},{
			"sClass": "center",
			"aTargets": [ 1 ]
	    }],
		"iDisplayLength" : 5,
		"lengthMenu": [ 5, 25, 50, 75, 100 ],
		"language": {
			   "url": "js/Italian.json",
        },
        "dom": '<"row"<"col-md-5"l><"col-md-5"i><"col-md-2"f>><"well"t>p',
        "fnInitComplete": function(){},
};

var confirmation_delete_report_options = $.extend(true, {}, confirmation_delete_options);
confirmation_delete_report_options.onConfirm = function(){reportDelete(toastr, this);};

$( function($) {

    reportsInit();
	
    $reportsMod.on('show.bs.modal', function (e) {
    	$(this).find('form').attr('action',report_create_url);
        reportsLoad(e);
    });
});
-->
</script>

<!-- Modal -->
<div class="modal fade in" id="reportsModal">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h3 class="modal-title form-signin-heading text-center">Lista dei Reports</h3>
            </div>

            <div class="modal-body">
                
                <div id="reportsList" class="table-responsive">
                 
                     <table id="reports" class="display" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Categoria di Segnalazione</th>
                          <th>Mese di Riferimento</th>
                          <th>Formato del Report</th>
                          <th>Data di Creazione</th>
                        </tr>
                      </thead>
                      <tbody>
                      </tbody>
                    </table>
                </div>
                
                <hr/>
                    
                <div class="row">
                    <div class="col-md-4 text-right">
                        <label>Se non hai trovato il report che stai cercando:</label>
                    </div>
                    <form id="reportForm" data-async method="post" action>
                        <div class="col-md-3">
                            <div class="form-group input-group">
                                <label for="queue" class="control-label input-group-addon">
                                   <i class="glyphicon glyphicon-list"></i> Categoria
                                </label>
                                <select type="select" name="queue" class="form-control">
                                    <option value="0">--- Non Definito ---</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group input-group">
                                <label for="report" class="control-label input-group-addon">
                                   <i class="glyphicon glyphicon-calendar"></i> Mese di Riferimento
                                </label>
                                <input type="text" name="report" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <button type="submit" disabled="disabled" class="btn btn-primary">
                                <span class="glyphicon glyphicon-open"></span> Genera il Report
                            </button>
                        </div>
                    </form>
                </div>
                
                <hr/>
                
                <div class="text-right">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        Chiudi
                    </button>
                </div>
                
            </div><!-- /.modal-body -->    
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal-content -->
</div><!-- /.modal -->
