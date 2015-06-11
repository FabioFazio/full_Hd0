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
    
    $reportsMod.on('change','form input[name="report"]', function(e){
    		// prevent submit if date is not set
    		if($(this).val().length>0)
    		{
    			$(this).closest('form').find('button[type="submit"]').removeAttr('disabled');
    		} else {
    			$(this).closest('form').find('button[type="submit"]').attr('disabled', 'disabled');
    		}
    	});
}

function reportsLoad(e)
{
	// ^ clean old data
	tableReports.rows().remove();
	tableReports.draw();
	// $ clean old data

	var data = {
		reports: {
			0:{
				'filename': 'hd0_2015-01.xls',
				'format': 'XLS - Microsoft Excel',
				'date': '2015-01',
				'creationDate': '2015-01-16',
			},
		}
		
	}; // MOCK
	
//	$.ajax({
//		url:			reports_url,
//		type:			"POST",
//		datatype:		"json",
//		data:{
//			secret:			getUser().password
//		},
//		async: true,
//		success: function(data, status) {
//			window.console&&console.log(data); // for debugging
			populateReports(data['reports']);
			$reportsMod.prop('reports', data['reports']);
//		},
//		error: function(data, status) {
//				window.console&&console.log('<ajaxConsole ERROR> '+data+' <ajaxConsole ERROR>');
//			},
//	});
}

function populateReports(data){
	$download = $('<a></a>').attr('title','Scarica')
		.addClass('btn btn-sm btn-success');
	$remove = $('<a></a>').attr('title','')
		.addClass('btn btn-sm btn-danger').attr('data-toggle','confirmation')
			.attr('data-original-title', 'Vuoi davvero cancellare questo report?');
	$download.html(
			'<span class="glyphicon glyphicon-save"></span>');
	$remove.html(
			'<span class="glyphicon glyphicon-trash"></span>');
	
	$.each(data, function(index, report){
		var $downloadButton = $download.clone().attr('data-file','/report/'+report.filename);
		var $removeButton = $remove.clone().attr('data-file',report.filename);
		
		tableReports.row.add([
           $('<div>&nbsp;</div>').append($removeButton)
           		.prepend($downloadButton).html(),
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
			secret:		getUser().password,
			id:			item.id,
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