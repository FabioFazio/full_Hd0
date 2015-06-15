// Extra actions on successfull submit
fallbackForm['reportForm'] = function fallback (data, status, $msgBox, $form) {
	$.each(data, function(i, msg){
		if($.inArray(i,['success','error','warning','info'])>=0){
			toastr[i](msg);
		}
	});
	if (!('error' in data)){
		reportsLoad();
	}
};

/* Library for reports.inc */
function reportsInit()
{
	$reportsMod.find('div.modal-xl').css( "width", $(window).innerWidth()-50 );
    tableReports = tableReports?tableReports:$('#reports').dataTable(table_reports_options).api();
	
    // ^ populate date

    var $input = $reportsMod.find('form input');
    var startDate = new Date();
    var endDate = new Date();
    var nowDate = new Date();
    startDate.setFullYear(nowDate.getFullYear() - 1);
    start = $.format.date(startDate, 'yyyy-MM');
    endDate.setMonth(nowDate.getMonth() - 1);
    end = $.format.date(endDate, 'yyyy-MM');
    	
    $input.datepicker({
        format: "yyyy-mm",
        startDate: start,
        endDate: end,
        minViewMode: 1,
        language: "it",
    });
    
    // $ populate date
    
    // ^ custom falidate submit
    var handler = function (e) {
		// prevent submit if date or queue not set
    	$form = $(this).closest('form');
    	$input = $form.find('input[name="report"]');
    	$select = $form.find('select[name="queue"]');
    	
		if($input.val().length>0 && $select.val()>0)
		{
			$form.find('button[type="submit"]').removeAttr('disabled');
		} else {
			$form.find('button[type="submit"]').attr('disabled', 'disabled');
		}
    };
    $reportsMod.on('change','form select[name="queue"]', handler);
    $reportsMod.on('change','form input[name="report"]', handler);
    // $ custom falidate submit
}

function reportsLoad(e)
{
    // ^ populate queues
	if ($reportsMod.prop('queues') == undefined)
		populateReportsQueues();
    // $ populate queues
	
	// ^ clean old data
	tableReports.rows().remove();
	tableReports.draw();
	// $ clean old data

	$.ajax({
		url:			reports_url,
		type:			"POST",
		datatype:		"json",
		data:{
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			populateReports(data['reports']);
			$reportsMod.prop('reports', data['reports']);
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
	});
}

function populateReportsQueues()
{
	$.ajax({
		url:			queues_url,
		type:			"POST",
		datatype:		"json",
		data:{
			all:	1
		},
		async: false,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			$select = $reportsMod.find('form select[name="queue"]');
			
			// if not admin filter from queues what is not seen as focal point
			if (!(getUser().administrator))
			{
				var focal = getQueues(true, true); var filtered = {};
				$.each(data['queues'], function(i, v){
					if (i in focal)
						filtered[i] = v; 
				});
				data['queues'] = filtered;
			}
			  
			$.each(data['queues'], function(index, queue){
				$select.append($('<option>').val(queue.id).text(queue.name));
			});
			$reportsMod.prop('queues', data['queues']);
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
			},
	});
}

function populateReports(reports){
	$download = $('<a></a>').attr('title','Scarica').attr('target','_blank')
		.addClass('btn btn-sm btn-success');
	$remove = $('<a></a>').attr('title','')
		.addClass('btn btn-sm btn-danger').attr('data-toggle','confirmation')
			.attr('data-original-title', 'Vuoi davvero cancellare questo report?');
	$download.html(
			'<span class="glyphicon glyphicon-save"></span>');
	$remove.html(
			'<span class="glyphicon glyphicon-trash"></span>');
	
	// if not admin filter from reports queues what is not seen as focal point
	if (!(getUser().administrator))
	{
		var focal = getQueues(true, true); var filtered = {};
		$.each(reports, function(i, v){
			if (v['queue'] in focal)
				filtered[i] = v; 
		});
		reports = filtered;
		$remove.attr('disabled','disabled');
	}
	
	queues = $reportsMod.prop('queues');
	
	$.each(reports, function(index, report){
		var $downloadButton = $download.clone().attr('href','../reports/'+report.filename);
		var $removeButton = $remove.clone().attr('data-filename',report.filename);
		
		tableReports.row.add([
           $('<div>&nbsp;</div>')//.append($removeButton) .addClass('hidden') // hidden because no php grants to delete bug FIXME
           		.prepend($downloadButton).html(),
       		queues[report['queue']].name,
       		report.date,
       		report.format,
       		report.creationDate,
       ]);
	});
	
	tableReports.draw();
	$reportsMod.find('a[data-toggle="confirmation"]').confirmation(confirmation_delete_report_options);
}

function reportDelete(toastr, item)
{
	$.ajax({
		url:			report_delete_url,
		type:			"POST",
		datatype:		"json",
		data:{
			filename:			item.filename,
		},
		async: true,
		success: function(data, status) {
			window.console&&console.log(data); // for debugging
			$.each(data, function(i, msg){
				if($.inArray(i,['success','error','warning','info'])>=0){
					toastr[i](msg);
				}
			});
			if ('success' in data){
				$tr = $reportsMod.find('a.btn-danger[data-id='+item.id+']').closest('tr');
				$tr.addClass('remove');
				tableReports.row('.remove').remove().draw( false );
			}
		},
		error: function(data, status) {
				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
				toastr['error'] = 'Non è stato possibile cancellare il report. Riprovare più tardi.'; //FIXME doesnt trigger if we receve 404
		},
	});
}