<script type="text/javascript">
<!--
	$(function(){

		/////////////////////////////////////////////
		///////////// __TOOLTIP__ ///////////////////
	    // http://www.tutorialspoint.com/bootstrap/bootstrap_tooltip_plugin.htm
		/////////////////////////////////////////////

	    if (typeof(initHelp) == "function"){
			initHelp();
	    }
	    
	    var optTooltBase = {
			aniumation:	false,
			delay:		{ "show": 100, "hide": 100 },
			html:		true,
	    };

	    $('[data-toggle="tooltip"][title_0]:not([title])').each(function(){
	    	var t = 0, n = 0;
	    	$(this).attr('data-current', n);
	    	
	    	var attr = $(this).attr('title_'+ t);
	    	while ((typeof attr !== typeof undefined) && (attr !== false))
	    		attr = $(this).attr('title_'+ ++t);
	    	
	    	$(this).attr('data-total', t);
	    	
	    	var paging = "<br /><small>1/"+ t +"<small>";
	    	$(this).attr('title', $(this).attr('title_' + n)  + paging );
	    	//$('span.glyphicon-question-sign', this).addClass('alert-warning');
	    });
	    
	    $('[data-toggle="tooltip"][data-current]').on( 'click', function(){
	    	var n = parseInt($(this).attr('data-current'),10) + 1;
	    	var t = parseInt($(this).attr('data-total'),10);
	    	n = (n >= t)? 0 : n;
	    	$(this).attr('data-current', n);
	    	var paging = "<br /><small>" + (n+1) + "/"+ t +"<small>";
	    	$(this).attr('title', $(this).attr('title_' + n) + paging);
	    	
	    	$(this).tooltip('destroy');
	    	$(this).tooltip(optTooltBase);
	    	$(this).tooltip('show');
	    	$(this).on('hidden.bs.tooltip', function () {
	    		$('.tooltip').remove();
	    	});
	    });
	    
	    $('[data-toggle="tooltip"][title]').tooltip(optTooltBase);

		content();
	});
//-->
</script>

<span id="feedback"></span>

<div class="row">

	<!-- <div id="bacheca" class="col-md-12">
    </div>
</div> -->

	<div id="ambitiApplicativi" class="col-md-3 colBox">
		<div class="well titleBox bg-rgb">
			<span>Categorie di Segnalazione</span> <span class="pull-right"
				data-toggle="tooltip" data-placement="left"> <span
				class="alert-info glyphicon glyphicon-question-sign"></span>
			</span>
		</div>
		<ol id="catList" class="well sortable simple_with_no_drag bugsBox">

			<li id="cat_empty" class="text-center well"><i>Vuoto</i></li>
			<li id="qN" class="well color-? mock hidden">
				<p data-name="name"></p>
				<ol>
					<li class="well"><a href="#inLavorazione"><span id="qN_bozze"
							data-name="counter" title="segnalazioni aperte"
							class="badge alert-danger">0</span></a> <a href="#chiuse"><span
							id="qN_chiuse" data-name="counter" title="segnalazioni chiuse"
							class="badge alert-success">0</span></a>
						<span data-prop="title" title="Visibilità: Focal Point" class="hidden fp badge btn-default"><i class="glyphicon glyphicon-eye-open btn-default"></i></span>
						<div class="pull-right">
							<button data-toggle="modal" data-target="#ticketModal"
								class="btn btn-xs btn-primary" data-service-id="N"
								data-queue-id="N" data-queue-name="N" data-queue-color="color-N"
								data-id="0" data-num="N" data-ticket-priority="0"
								data-articles="0" data-ticket-desc=""
								data-filters="" data-taxonomie="">
								<span title="Apri una Nuova Segnalazione"
									class="glyphicon glyphicon-plus"></span>
							</button>
						</div>
					</li>
				</ol>
			</li>
		</ol>
	</div>

	<div id="bozze" class="col-md-3 colBox">
		<div id="inLavorazione" class="well titleBox bg-r">
			<span class="">Segnalazioni Aperte <span id="tot_bozze"
				data-name="counter" title="totale" class="badge">N</span></span> <span
				class="pull-right" data-toggle="tooltip" data-placement="left">
				<span class="alert-info glyphicon glyphicon-question-sign"></span>
			</span>
		</div>
		<ol class="well sortable simple_with_no_drag bugsBox">
			<li id="bozze_empty" class="text-center well"><i>Vuoto</i></li>
			<li data-ticket-id="0" class="bozze-ticket hidden bg-rgb well">
				<div class="row titleTicket">
					<div class="col-md-10 col-sm-10" data-name="Title">Default
						Title</div>
					<div
						class="col-sm-1 col-md-1 badge">
						<span data-name="Author" data-prop="title"
							title="Autore" class="glyphicon glyphicon-user tagQueue"></span>
					</div>
					<div
						class="col-md-1 badge queue-color">
						<span data-name="QueueName" data-prop="title"
							title="Categoria" class="glyphicon glyphicon-tag tagQueue"></span>
					</div>
				</div>
				<ol>
					<li class="well">
						<span class="badge alert-info"><span data-name="ArticleNum">?</span>
							<span title="aggiornamenti"
							class="glyphicon glyphicon-comment"></span>
						</span>
						
						<!-- span class="badge alert-info"><span  data-name="AttachmentNum">?</span> <span title="allegati" class="glyphicon glyphicon-paperclip"></span></span -->
						
						<span class="tag-waiting badge btn-default tagSize hidden">
							<span title="In attesa di risposta" data-prop="title"
								class="glyphicon glyphicon-asterisk alert-info"></span>
						</span>
						
						<span class="tag-working badge btn-default tagSize hidden">
							<span title="Presa in Carico" data-prop="title"
								class="glyphicon glyphicon-thumbs-up  alert-success"></span>
						</span>
						
						<span class="tag-urgent badge btn-default tagSize hidden">
							<span title="Bloccante!" data-prop="title"
								class="glyphicon glyphicon-fire alert-danger"></span>
						</span>
						<div class="pull-right">
							<button data-toggle="modal" data-target="#ticketModal"
								class="pull-right btn btn-xs btn-default" data-service-id="?"
								data-queue-id="?" data-queue-name="Default Queue"
								data-queue-color="color-?" data-id="?" data-num="?"
								data-ticket-title="Default Title"
								data-ticket-desc="Default Desc" data-ticket-priority="0"
								data-articles="0" data-filters="" data-taxonomie="">
								<span title="apri" class="glyphicon glyphicon-zoom-in"></span>
							</button>
						</div>
					</li>
				</ol>
			</li>
		</ol>
	</div>

	<div id="chiuse" class="col-md-3 colBox">
		<div class="well titleBox bg-g">
			<span class="">Segnalazioni Chiuse <span id="tot_chiuse"
				data-name="counter" title="totale" class="badge">N</span></span> <span
				class="pull-right" data-toggle="tooltip" data-placement="left">
				<span class="alert-info glyphicon glyphicon-question-sign"></span>
			</span>
		</div>
		<ol class="well sortable simple_with_no_drag bugsBox">
			<!-- form class="form-inline filter" role="form">
        <div class="input-group">
            <input type="text" class="form-control" id="filterSearch" placeholder="Filtro di ricerca...">
            <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
        </div>
        <!--  center class="small"><span id="filterCounter">2</span> segnalazione/i trovata/e</center ->
    </form -->
			<li id="chiuse_empty" class="text-center well"><i>Vuoto</i></li>
			<li data-ticket-id="0" class="chiuse-ticket hidden bg-rgb well">
				<div class="row titleTicket">
					<div class="col-md-10 col-sm-10" data-name="Title">Default
						Title</div>
					<div
						class="col-sm-1 col-md-1 badge">
						<span data-name="Author" data-prop="title"
							title="Autore" class="glyphicon glyphicon-user tagQueue"></span>
					</div>
					<div
						class="col-md-1 badge queue-color">
						<span data-name="QueueName" data-prop="title"
							title="Categoria" class="glyphicon glyphicon-tag tagQueue"></span>
					</div>
				</div>
				<ol>
					<li class="well">
						<span class="badge alert-success"><span
							title="Risolta con Successo!" data-prop="title"
								class="glyphicon glyphicon-ok"></span>
						</span>
						<span class="badge alert-danger"><span
							title="Chiusa senza Successo!" data-prop="title"
								class="glyphicon glyphicon-remove"></span>
						</span>
						
						<span class="badge alert-info"><span data-name="ArticleNum">?</span>
							<span title="Aggiornamenti" class="glyphicon glyphicon-comment"></span>
						</span>
						
						<!-- span class="badge alert-info"><span  data-name="AttachmentNum">?</span> <span title="allegati" class="glyphicon glyphicon-paperclip"></span></span -->
						
						<span class="tag-urgent badge btn-default tagSize hidden">
							<span title="Bloccante!" data-prop="title"
								class="glyphicon glyphicon-fire alert-danger"></span>
						</span>
												
						<div class="pull-right">
							<button data-toggle="modal" data-target="#ticketModal"
								class="pull-right btn btn-xs btn-default" data-queue-id="0"
								data-queue-name="Default Queue" data-queue-color="color-?"
								data-id="?" data-num="?" data-ticket-title="Default Title"
								data-ticket-desc="Default Desc" data-ticket-priority="0"
								data-articles="0" data-filters="" data-taxonomie="">
								<span title="apri" class="glyphicon glyphicon-zoom-in"></span>
							</button>
						</div>
					</li>
				</ol>
			</li>
		</ol>
	</div>

	<div id="legenda" class="col-md-3 colBox">
		<div class="well titleBox bg-rgb">
			<span>Legenda</span> <span class="pull-right" data-toggle="tooltip"
				data-placement="left"> <span
				class="alert-info glyphicon glyphicon-question-sign"></span>
			</span>
		</div>

		<div class="panel-group" id="accordion" role="tablist"
			aria-multiselectable="true">
			<div class="panel panel-default">
				<div class="panel-heading" role="tab" id="headingZero">
					<h4 class="panel-title">
						<a data-toggle="collapse" data-parent="#accordion"
							href="#collapseZero" aria-expanded="true"
							aria-controls="collapseZero"> Guida introduttiva <span
							class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
					</h4>
				</div>
				<div id="collapseZero" class="panel-collapse collapse in"
					role="tabpanel" aria-labelledby="headingZero">
					<div class="panel-body">
						<ul>
							<li>Ogni sezione prevede una guida che aiuta a capirne il
								significato.<br /> Posizionando il mouse sopra a <span
								class="alert-info glyphicon glyphicon-question-sign"></span> è
								possibile leggerne il contenuto
							</li>
							<li>Clickando sopra al <span
								class="glyphicon glyphicon-question-sign alert-info"></span>, è
								possibile visualizzare altri suggerimenti, se disponibili
							</li>
						</ul>
					</div>
				</div>
				<div class="panel-heading" role="tab" id="headingOne">
					<h4 class="panel-title">
						<a class="collapsed" data-toggle="collapse"
							data-parent="#accordion" href="#collapseOne"
							aria-expanded="false" aria-controls="collapseOne"> Categorie
							di Segnalazione <span
							class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
					</h4>
				</div>
				<div id="collapseOne" class="panel-collapse collapse"
					role="tabpanel" aria-labelledby="headingOne">
					<div class="panel-body">
						<p>
							<span class="badge alert-warning">N</span> <b>N</b> Segnalazioni
							Aperte
						</p>
						<p>
							<span class="badge alert-success">N</span> <b>N</b> Segnalazioni
							Chiuse
						</p>
						<p>
							<span class="badge btn-default"><i class="glyphicon glyphicon-eye-open btn-default"></i></span>
							Visibilità come <strong>Focal Point</strong>
						</p>
						<p>
							<button class="btn btn-xs btn-primary">
								<span class="glyphicon glyphicon-plus"></span>
							</button>
							Nuova segnalazione
						</p>
					</div>
				</div>
				<div class="panel-heading" role="tab" id="headingThree">
					<h4 class="panel-title">
						<a class="collapsed" data-toggle="collapse"
							data-parent="#accordion" href="#collapseThree"
							aria-expanded="false" aria-controls="collapseThree">
							Segnalazioni Aperte <span
							class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
					</h4>
				</div>
				<div id="collapseThree" class="panel-collapse collapse"
					role="tabpanel" aria-labelledby="headingThree">
					<div class="panel-body">
						<p>
							<span class="badge"><span  class="glyphicon glyphicon-user"></span></span>
							Autore della Segnalazione
						</p>
						<p>
							<span class="badge"><span class="glyphicon glyphicon-tag"></span></span>
							Colore di Categoria
						</p>
						<p>
							<span class="badge alert-info">N <span
								class="glyphicon glyphicon-comment"></span></span> <b>N</b>
							Aggiornamenti
						</p>
						<!-- 
						<p>
							<span class="badge alert-info">N <span
								class="glyphicon glyphicon-paperclip"></span></span> <b>N</b> Allegati
							<small>(non attivo nella demo)</small>
						</p>
						-->
						<p>
							<span class="badge btn-default tagSize">
								<span title="in attesa" class="glyphicon glyphicon-asterisk alert-info"></span>
							</span>
							In Aattesa di Risposta
						</p>
						<p>
							<span class="badge btn-default tagSize">
								<span title="presa in Carico" class="glyphicon glyphicon-thumbs-up  alert-success"></span>
							</span>
							Presa in Carico (in lavorazione)
						</p>
						<p>
							<span class="badge btn-default tagSize">
								<span title="Bloccante!" class="glyphicon glyphicon-fire alert-danger"></span>
							</span>
							Bloccante!
						</p>
						<p>
							<button class="btn btn-xs btn-default">
								<span class="glyphicon glyphicon-zoom-in"></span>
							</button>
							Visualizza la segnalazione
						</p>
					</div>
				</div>
				<div class="panel-heading" role="tab" id="headingFour">
					<h4 class="panel-title">
						<a class="collapsed" data-toggle="collapse"
							data-parent="#accordion" href="#collapseFour"
							aria-expanded="false" aria-controls="collapseFour">
							Segnalazioni Chiuse <span
							class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
					</h4>
				</div>
				<div id="collapseFour" class="panel-collapse collapse"
					role="tabpanel" aria-labelledby="headingFour">
					<div class="panel-body">
						<p>
							<span class="badge"><span  class="glyphicon glyphicon-user"></span></span>
							Autore della Segnalazione
						</p>
						<p>
							<span class="badge"><span class="glyphicon glyphicon-tag"></span></span>
							Colore di Categoria
						</p>
						<p>
							<button class="btn btn-xs btn-default">
								<span class="glyphicon glyphicon-search"></span>
							</button>
							Filtra la lista <small>(non attivo nella demo)</small>
						</p>
						<p>
							<span class="badge alert-success"><span
								class="glyphicon glyphicon-ok"></span></span> Risolta con successo
						</p>
						<p>
							<span class="badge alert-danger"><span
								class="glyphicon glyphicon-remove"></span></span> Chiusa senza successo
						</p>
						<p>
							<span class="badge alert-info">N <span
								class="glyphicon glyphicon-comment"></span></span> <b>N</b>
							Aggiornamenti
						</p>
						<!-- 
						<p>
							<span class="badge alert-info">N <span
								class="glyphicon glyphicon-paperclip"></span></span> <b>N</b> Allegati
							<small>(non attivo nella demo)</small>
						</p>
						-->
						<p>
							<span class="badge btn-default tagSize">
								<span title="Bloccante!" class="glyphicon glyphicon-fire alert-danger"></span>
							</span>
							Bloccante!
						</p>
						<p>
							<button class="btn btn-xs btn-default">
								<span class="glyphicon glyphicon-zoom-in"></span>
							</button>
							Visualizza segnalazione
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

</div>