<?php
$operation = 'TicketCreate';

$content = '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';
$contentType = 'image/jpeg';
$filename = 'fester.jpg';


$XMLArray = [
    'UserLogin' =>'hd0',
    'Password' =>'hd0',
    
    'Ticket' => [
        'Title' => 'Test Title',
        //'QueueID' => '',
        'Queue' => 'ZTAC Incoming Queue',
        //'TypeID' => '',
        'Type' => 'default',   //'Incident','Incident:Disaster','Incident:ServiceRequest','Problem','Problem:KnownError','Problem:PendingRfC','RfC','default'
        //'ServiceID' => '',
        'Service' => '',
        //'SLAID' => '',
    	'SLA' => '',
    	//'StateID' => '',
    	'State' => 'new', //'closed successful','closed unsuccessful','closed with workaraund','merged','new','open','pending auto close+','pending auto close-','pending reminder','removed'
        //'PriorityID' => '',
    	'Priority'=>'3 normal', //'1 very low',//'2 low',//'3 normal',//'4 high',//'5 very high',
    	//'OwnerID' => '',
    	'Owner' => '',
    	//'ResponsibleID' => '',
        'Responsible' => '',
        'CustomerUser'=> 'fmfazio@gmail.com',
    	'CustomerID' => '',
    	/*
    	 'PendingTime' => [
    	       'Year' => '',
    	       'Month' => '',
    	       'Day' => '',
    	       'Hour' => '',
    	       'Minute' => '',
    	   ],
    	 */
    ],
    
    'Article' => [
        
        //'ArticleTypeID' => '',
        'ArticleType' => '',
        //'SenderTypeID' => '',
        'SenderType' => '',
        
        'From' => 'fmfazio@gmail.com',
        'Subject' => 'Test Subject',
        'Body' => 'Test Description',
        
        'ContentType'=>'text/plain; charset=utf8',
        //'Charset' => 'utf8',
        //'MimeType' => 'text/plain',
        
        'HistoryType' => '', 
        'HistoryComment' => '',
        'AutoResponseType' => '',
        'TimeUnit' => '',
        'NoAgentNotify' => '',
        //'ForceNotificationToUserID' => [],
        //'ExcludeNotificationToUserID' => [],
        //'ExcludeMuteNotificationToUserID' => [],
    ],
    
    'DynamicField' => [
            [
            'Name' => 'Sorgente',
            'Value' >= ['Servizio Hd0'],
            ],
        ],

    'Attachment' => [
            [
            'Content' => $content, //'cid:61886944659',
            'ContentType' => $contentType,
            'Filename' => $filename,
            ],
        ],
];

error_reporting(E_ALL);

$url	  = "http://localhost/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector";
$username = "hd0";
$password = "hd0";
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

function isAssoc($array){
	return !empty($array) && array_keys($array) !== range(0, count($array) - 1);
}

function parametrize($array){
    $param_arr = [];
    foreach ($array as $k => $v)
    	if(is_array($v))
    		if (isAssoc($v))
    			$param_arr[] = new SoapParam ( $v, $k );
    		else
    			foreach($v as $vv)
    		        if(isAssoc($vv))
    		            $param_arr[] = parametrize(['ns1:'.$k => $vv]);
    		        else
    				    $param_arr[] = new SoapParam ( $vv, 'ns1:'.$k );
    	else
    		$param_arr[] = new SoapParam ( $v, 'ns1:'.$k );
    return $param_arr;
}

$param_arr = parametrize($XMLArray);

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