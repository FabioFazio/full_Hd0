<?php
/*
 *	$Id: client2.php,v 1.4 2007/11/06 14:48:24 snichol Exp $
 *
 *	Client sample.
 *
 *	Service: SOAP endpoint
 *	Payload: rpc/encoded
 *	Transport: http
 *	Authentication: none
 */
require_once('lib/nusoap.php');

$url = 'http://ztac.zenatek.eu/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector';
$proxyhost = isset($_POST['proxyhost']) ? $_POST['proxyhost'] : 'http://ztac.zenatek.eu/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector';
$proxyport = isset($_POST['proxyport']) ? $_POST['proxyport'] : '';
$proxyusername = isset($_POST['proxyusername']) ? $_POST['proxyusername'] : 'fabio.fazio';
$proxypassword = isset($_POST['proxypassword']) ? $_POST['proxypassword'] : 'aaAA11!!';
$useCURL = isset($_POST['usecurl']) ? $_POST['usecurl'] : '0';
$operation =  isset($_POST['operation']) ? $_POST['operation'] : 'TicketCreate';
$defencoding = isset($_POST['defencoding']) ? $_POST['defencoding'] : 'UTF-8';

$client = new nusoap_client($url, false, $proxyhost, $proxyport, $proxyusername, $proxypassword);

$err = $client->getError();
if ($err) {
	echo '<h2>Constructor error</h2><pre>' . $err . '</pre>';
	echo '<h2>Debug</h2><pre>' . htmlspecialchars($client->getDebug(), ENT_QUOTES) . '</pre>';
	exit();
}

$client->setUseCurl($useCURL);
$client->soap_defencoding = $defencoding;
$client->useHTTPPersistentConnection();

$param = [
        'UserLogin' => $proxyusername,
        'Password' => $proxypassword,
        'Ticket' => [
                'Title'=>'some title',
                'CustomerUser'=>'fmfazio@gmail.com',
                'Queue'=>'ZTAC Incoming Queue',
                'Type'=>'default',
                'State'=>'new',
                'Priority'=>'1 very low',
        ],
        'Article' => [
                'Subject'=>'some subject',
                'Body'=>'some body',
                'ContentType'=>'text/xml; charset=utf8',
        ],
];


$result = $client->call('TicketCreate', $param, $url, $proxyhost);

if ($client->fault) {
	echo '<h2>Fault</h2><pre>'; print_r($result); echo '</pre>';
} else {
	$err = $client->getError();
	if ($err) {
		echo '<h2>Error</h2><pre>' . $err . '</pre>';
	} else {
		echo '<h2>Result</h2><pre>'; print_r($result); echo '</pre>';
	}
}
echo '<h2>Request</h2><pre>' . htmlspecialchars($client->request, ENT_QUOTES) . '</pre>';
echo '<h2>Response</h2><pre>' . htmlspecialchars($client->response, ENT_QUOTES) . '</pre>';
echo '<h2>Debug</h2><pre>' . htmlspecialchars($client->getDebug(), ENT_QUOTES) . '</pre>';

#echo $client->request, ENT_QUOTES;
#echo $client->response, ENT_QUOTES;
# echo $client->getDebug(), ENT_QUOTES;
?>
