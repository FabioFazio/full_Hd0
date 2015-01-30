<?php
$operation = 'TicketSearch';

$XMLArray = [
    'UserLogin' =>'fabio.fazio',
    'Password' =>'aaAA11!!',

    'TicketNumber' => [],
    'Title' => [],
    'Queues'=> [
        'ZTAC Incoming Queue',
        'Junk'
    ],
    'QueueIDs'  => [],
    'UseSubQueues' => '',
    'Types'     => ['default'],
    'TypeIDs'   => [],
    'States'    => ['new','closed successful'],
    'StateIDs'  => [],
    'StateType' => [],
    'StateTypeIDs' => [],
    'Priorities' => [],
    'PriorityIDs' => [],
    'Services' => [],
    'ServiceIDs' => [],
    'SLAs' => [],
    'SLAIDs' => [],
    'Locks' => [],
    'LockIDs' => [],
    'OwnerIDs' => [],
    'ResponsibleIDs' => [],
    'WatchUserIDs' => [],
    'CustomerID' => [],
    'CustomerUserLogin' => [],
    'CreatedUserIDs' => [],
    'CreatedTypes' => [],
    'CreatedTypeIDs' => [],
    'CreatedPriorities' => [],
    'CreatedPriorityIDs' => [],
    'CreatedStates' => [],
    'CreatedStateIDs' => [],
    'CreatedQueues' => [],
    'CreatedQueueIDs' => [],
    'DynamicFields' => [
        //'Equals' => '',
        //'Like' => '',
        //'GreaterThan' => '',
        'GreaterThanEquals' => '',
        //'SmallerThan' => '',
        //'SmallerThanEquals' => '',
        ],                
    'Ticketflag' => [
        'Seen' => '',
        ],
    'From' => 'fmfazio@gmail.com',

    'To' => '',
    'Cc' => '',
    'Subject' => '',
    'Body' => '',
    'FullTextIndex' => '',
    'ContentSearch' => '',
    'ConditionInline' => '',
    'ArticleCreateTimeOlderMinutes' => '',
    'ArticleCreateTimeNewerMinutes' => '',
    'ArticleCreateTimeNewerDate' => '',
    'ArticleCreateTimeOlderDate' => '',
    'TicketCreateTimeOlderMinutes' => '',
    'ATicketCreateTimeNewerMinutes' => '',
    'TicketCreateTimeNewerDate' => '',
    'TicketCreateTimeOlderDate' => '',
    'TicketChangeTimeOlderMinutes' => '',
    'TicketChangeTimeNewerMinutes' => '',
    'TicketChangeTimeNewerDate' => '',
    'TicketChangeTimeOlderDate' => '',
    'TicketCloseTimeOlderMinutes' => '',
    'TicketCloseTimeNewerMinutes' => '',
    'TicketCloseTimeNewerDate' => '',
    'TicketCloseTimeOlderDate' => '',
    'TicketPendingTimeOlderMinutes' => '',
    'TicketPendingTimeNewerMinutes' => '',
    'TicketPendingTimeNewerDate' => '',
    'TicketPendingTimeOlderDate' => '',
    'TicketEscalationTimeOlderMinutes' => '',
    'TTicketEscalationTimeNewerMinutes' => '',
    'TicketEscalationTimeNewerDate' => '',
    'TicketEscalationTimeOlderDate' => '',
    'ArchiveFlags' => '',
    
    'OrderBy' => [],
    'SortBy' => [],
    'CustomerUserID' => [],
];


error_reporting(E_ALL);

$url	  = "http://ztac.zenatek.eu/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector";
$username = "fabio.fazio";
$password = "aaAA11!!";
$namespace = 'http://www.otrs.org/TicketConnector/';

echo "<html>\n";
echo "	<head>\n";
echo "		<title>Test SOAP-Interface</title>\n";
echo "	</head>\n";
echo "	<body>\n";
echo "		<h1>Test SOAP-interface of OTRS</h1>\n";

# Set up a new SOAP connection:

$soapclient = new SoapClient(null, array('location'  => $url,
                     'uri'       => $namespace,
                     'trace'     => 1,
                     'login'     => $username,
                     'password'  => $password,
                     'style'     => SOAP_RPC,
     				 'use'       => SOAP_ENCODED,
			     ));

# Creating Call

$param_arr = [];
foreach ($XMLArray as $k => $v)
{
	if(is_array($v)){
	    if (!empty($v) && array_keys($v) !== range(0, count($v) - 1)){
	        $param_arr[] = new SoapParam ( $v, $k );
	    }else{
	       foreach($v as $vv){
	           $param_arr[] = new SoapParam ( $vv, 'ns1:'.$k );
	       }
	    }
	}else{
        $param_arr[] = new SoapParam ( $v, 'ns1:'.$k );
	}
}

$ticketIds = call_user_func_array([$soapclient, $operation], $param_arr);

foreach ([$soapclient->__getLastRequest(), $soapclient->__getLastResponse()] as $k => $r)
{
    $r = str_replace("\n", "<br/>", htmlspecialchars($r));
    $r = str_replace("&lt;/item&gt;&lt;item&gt;", "&lt;/item&gt; <br/> &lt;item&gt;", $r);
    $r = preg_replace("/(&gt;)([\\w\\s\\.@\\-:]+)(&lt;)/i", "$1<b>$2</b>$3", $r);
    $r = str_replace("&gt;&lt;", "&gt; <br/> &lt;", $r);
    $xml[] = $r;
}

print "<h3>Request</h3> ". $xml[0] ."\n";
print "<h3>Response</h3> ". $xml[1] ."\n";

echo "</body>\n";
echo "</html>\n";
?>