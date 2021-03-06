<?php
error_reporting(E_ALL);

# Please define the connection information here:
//$url      = "http://ztac.zenatek.eu/otrs/json.pl";
$url	  = "http://ztac.zenatek.eu/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector";
$username = "fabio.fazio";
$password = "aaAA11!!";
$namespace = 'http://www.otrs.org/TicketConnector/';
$operation = 'TicketCreate';

$XMLArray = [
	'UserLogin' =>'fabio.fazio',
	'Password' =>'aaAA11!!',
	'Ticket' => [
		'Title'=>'some title',
		'CustomerUser'=>'fmfazio@gmail.com',
		'Queue'=>'ZTAC Incoming Queue',
		'Type'=>'default',
		'State'=>'new',
		'Priority'=>'2 very low',//'2 very low',//'3 normal',//'4 high',//'5 very high',
	],
	'Article' => [
		'Subject'=>'some subject',
		'Body'=>'some body',
		'ContentType'=>'text/plain; charset=utf8',
	],
];

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

# Creating a Ticket Number

$ticketId = $soapclient->$operation (
	new SoapParam ( $XMLArray['UserLogin'], 'ns1:UserLogin' ),
	new SoapParam ( $XMLArray['Password'], 'ns1:Password' ),
	new SoapParam ( $XMLArray['Ticket'], 'Ticket' ),
	new SoapParam ( $XMLArray['Article'], 'Article' )
);

$req = str_replace("\n", "<br/>", htmlspecialchars($soapclient->__getLastRequest()));
$req = str_replace("&lt;/item&gt;&lt;item&gt;", "&lt;/item&gt; <br/> &lt;item&gt;", $req);
$req = preg_replace("/(&gt;)([\\w\\s\\.!]+)(&lt;)/i", "$1<b>$2</b>$3", $req);

$res = str_replace("&gt;&lt;", "&gt; <br/> &lt;", htmlspecialchars($soapclient->__getLastResponse()));

print "<h3>Request</h3> ". $req ."\n";
print "<h3>Response</h3> ". $res ."\n";

//print $soapclient->__getLastRequest(); echo "<!--"; print $soapclient->__getLastResponse(); echo "-->"; exit(0);

# A ticket is not usefull without at least one article. The function
# returns an Article ID. 

echo "</body>\n";
echo "</html>\n";

?>
