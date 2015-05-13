<script type="text/javascript">
<!--
$( function($) {
	
    var $modal = $('#filterModal');
 	
    $modal.on('show.bs.modal', function (e) {
    		onShowFilterModal(e);
		});     
});
-->
</script>

<!-- Pref Modal -->
<div id="filterModal" class="modal fade" tabindex="-2" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="col-md-12 form-control wizard">
            	<div id="rootwizard">
                	<div class="navbar">
                    	<div class="navbar-inner">
                        	<ul>
                            	<li><a href="#tab0" data-toggle="tab">Per Cominciare</a></li>
                            	<li><a href="#tab1" data-toggle="tab">Nel Dettaglio</a></li>
                            </ul>
						</div>
					</div>
					<div id="bar" class="progress progress-striped active">
	                	<div class="bar progress-bar"></div>
	                </div>
	                <div class="tab-content">
	                	<div class="tab-pane" id="tab0">
	                    	<div class="row form-group">
		                        <label for="year" class="col-md-12 control-label">Question</label>
								<div class="col-md-12">
		                            <select class="form-control col-md-1" id="q_0-0" name="q_0-0" value="0">
		                                <option value='0' selected="selected">---</option>
		                            </select>
				                </div>
		                    </div>
	                	</div>
	                	<div class="tab-pane" id="tab1">
	                	</div>
	                	
						<ul class="pager wizard">
	                    	<li class="previous first" style="display:none;"><a href="#">Primo</a></li>
	                        <li class="previous"><a href="#">Indietro</a></li>
	                        <!-- -->
	                        <li class="next"><a class="hidden" href="#">Avanti</a></li>
	                        <!-- -->
	                        <li class="next finish" style="display:none;">
	                        	<a id="ticketLaucher" class="hidden btn alert-success" data-toggle="modal"
	                        		data-target="#ticketModal" data-service-id="N" data-queue-id="N"
	                        		data-queue-name="N" data-queue-color="color-N" data-id="0"
	                        		data-num="N" data-ticket-priority="0" data-articles="0"
	                        		data-ticket-title="" data-ticket-desc="" data-filter=""
	                        		data-questions="" data-responces="" data-dismiss="modal">
									Crea
									<span class="glyphicon glyphicon-plus"></span>
								</a>
							</li>
							<li><a href="#" class="closer fright" data-dismiss="modal">Annulla</a></li>
						</ul>
					</div>	
				</div> 
			</div>
		</div>
	</div>
</div>    				