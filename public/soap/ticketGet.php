<?php
$operation = 'TicketGet';

$XMLArray = [
    'UserLogin' =>'fabio.fazio',
    'Password' =>'aaAA11!!',
    
    'TicketID' => [
        '1010'
		],

	'DynamicFields' => '',
	'Extended' => true,
	'AllArticles' => true,
	'ArticleSenderType' => '',
	'ArticleOrder' => '', // come si usa?
	'ArticleLimit' => '',
	'Attachments' => true,
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