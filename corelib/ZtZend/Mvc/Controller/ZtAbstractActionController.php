<?php
namespace ZtZend\Mvc\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Zend\Session\Container;
use Zend\Session\Storage\SessionArrayStorage;
use Zend\I18n\Translator\Translator;

class ZtAbstractActionController extends AbstractActionController {
    
    private $session;
    static $config;
    
    const TICKET_SEARCH  = 'TicketSearch';
    const TICKET_CREATE  = 'TicketCreate';
    const TICKET_GET     = 'TicketGet';
    const TICKET_UPDATE  = 'TicketUpdate';
    
    private $OTRS_ARTICLE_TYPES  = [
        'webrequest',
        'email-external'
        // 'note-internal',
    ];
    
    private $OTRS_INLAV_STATEIDS  = [1,4,6,7,8];  // new, open, pending reminder, pending close+, pending close- 
    
    private $OTRS_CHIUSE_STATEIDS  = [2,3,10];    // closed_succ, closed_unsucc, closed_w_workaround
    
    private $OTRS_INVIS_STATEIDS  = [5,9];        // removed, merged
    
    public function getConfig()
    {
    	if (empty(ZtAbstractActionController::$config))
    	    ZtAbstractActionController::$config = $this->getServiceLocator()->get('Config');
    	
    	return ZtAbstractActionController::$config;
    }
    
    public function getOtrsArticleTypes()
    {
    	return $this->OTRS_ARTICLE_TYPES;
    }
    
    public function getOtrsInlavStateIds()
    {
    	return $this->OTRS_INLAV_STATEIDS;
    }
    
    public function getOtrsChiuseStateIds()
    {
    	return $this->OTRS_CHIUSE_STATEIDS;
    }
    
    public function ticketSearch_Otrs ($otrs, $queueCodes, $email, $focalpoint = false, &$extraTickets = [], $history = [])
    {
        $location = $otrs->getLocation();
        $username = $otrs->getUsername();
        $password = $otrs->getPassword();
        $namespace = $otrs->getNamespace();
        
        $mergeList = $extraTickets;
        
        $ticketList = $stateList = [];
        
        $xml = [
            'UserLogin' => $username,
            'Password' => $password,
        ];
        
        $searchXml      = $xml + [ 'QueueIDs' => $queueCodes ]; 
        $ticketIdList   = [];
        
        if(empty($history))
             $history = [
                'do' => $this->getConfig()['defaultHistoryOpened'],
                'dc' => $this->getConfig()['defaultHistoryClosed'],
                'fo' => $this->getConfig()['fpHistoryOpened'],
                'fc' => $this->getConfig()['fpHistoryClosed']
            ]; 
        
        if (!$focalpoint)
        {
            $filter_date = !$history['do']?[]:[ 'ArticleCreateTimeNewerDate' => date('Y-m-d H:i:s',strtotime("-". $history['do'] ." days"))];
            
            $filter_from    = [ 'From' => $email ];
            $filter_to      = [ 'To' => $email ];
            $filter_cc      = [ 'Cc' => $email ];
            
            $respFrom   = $this->callOtrs($location, $username, $password, $namespace,
            		self::TICKET_SEARCH, $searchXml + $filter_from + $filter_date);
            $respTo     = $this->callOtrs($location, $username, $password, $namespace,
            		self::TICKET_SEARCH, $searchXml + $filter_to + $filter_date);
            $respCc     = $this->callOtrs($location, $username, $password, $namespace,
            		self::TICKET_SEARCH, $searchXml + $filter_cc + $filter_date);
            
            $listFrom    = $this->extractTagFromSoapResp($respFrom, 'TicketID');
            $listTo      = $this->extractTagFromSoapResp($respTo,   'TicketID');
            $listCc      = $this->extractTagFromSoapResp($respCc,   'TicketID');
             
            $ticketIdList = $listFrom + array_diff($listTo, $listFrom);
            $ticketIdList += array_diff($listCc, $ticketIdList);
            $ticketIdList += array_diff($mergeList, $ticketIdList);
        }else
        {
            $filter_date = !$history['fo']?[]:[ 'ArticleCreateTimeNewerDate' => date('Y-m-d H:i:s',strtotime("-". $history['fo'] ." days"))];
            
            $resp     = $this->callOtrs($location, $username, $password, $namespace,
            		self::TICKET_SEARCH, $searchXml + $filter_date);
            
            $ticketIdList    = $this->extractTagFromSoapResp($resp, 'TicketID');
        }

        $ticketList    = $this->getTicket_Otrs ($otrs, $ticketIdList);

        // new list of states with all tickets
        $stateList = [];
        $states = array_column($ticketList , 'State', 'StateID');
        global $filterState; global $filterDate;
        foreach ($states as $id => $state){
            $filterState = $id;
            if(in_array($id, $this->getOtrsChiuseStateIds()))
                if($focalpoint)
                    $filterDate =  $history['fc']? strtotime("-". $history['fc'] ." days") : 0;
                else
                    $filterDate =  $history['dc']? strtotime("-". $history['dc'] ." days") : 0;
            else
                $filterDate = 0;
            
            $stateList[$id] = array_filter($ticketList , 
                    function($v){
                        global $filterState; global $filterDate;
                        $valid = $v['StateID']==$filterState;
                        $valid &= strtotime($v['Changed']) >= $filterDate;
                        return $valid;
                    });
        }
        unset($filterState);
        unset($filterDate);
        
        if (!$focalpoint){
            // aggiorno la lista dei ticket tracciati da rimuovere perchè già raggiungibili TODO
            $extraTickets = array_intersect($extraTickets, $listFrom, $listTo, $listCc);
        }
        
        return $stateList;
    }
    
    public function ticketCreate_Otrs ($otrs, $input)
    {
    	$location = $otrs->getLocation();
    	$username = $otrs->getUsername();
    	$password = $otrs->getPassword();
    	$namespace = $otrs->getNamespace();
    
    	$xml = [
    	'UserLogin' => $username,
    	'Password' => $password,
    	];
    
    	$type           = ['TypeID'  => 1]; // 1 default
    	$priority       = ['PriorityID'  => (isset($input['priority']))?4:3]; // 3 normal, 4 high
    	$state          = ['StateID' => 1]; // 1 new
    	$queue          = [ 'QueueID' => $input['queueCode'] ];
    	$title          = ['Title' => $input['title']];
    	$user           = ['CustomerUser' => $input['email']];
    	$article        = [
               //'ArticleType' => '',
               //'SenderType'  => '',
    	       'From'        => $input['email'],
    	       'Subject'     => $input['title'],
               'Body'        => $input['description'],
    	       'ContentType' => 'text/plain; charset=utf8',
    	];
    	
//	    $dynamicField = [ [ 'Name' => 'Sorgente', 'Value' => [ 'Servizio Hd0' ] ] ];
// 	    if(!empty($input['taxonomie']))
// 	    {
// 	        $dynamicField[] = [
//                 'Name' => 'Taxonomie',
//                 'Value' => $input['taxonomie']
// 	        ];
// 	    }
//      $xml['DynamicField'] = $dynamicField;
    	
    	$createXml = $xml + [ 'Ticket' => $type + $priority + $state + $queue + $title + $user ] + [ 'Article' => $article ];
    
    	$resp   = $this->callOtrs($location, $username, $password, $namespace,
    			self::TICKET_CREATE, $createXml);
    
    	$errorMsg     = $this->extractTagFromSoapResp($resp, 'ErrorMessage');
    	$articleId    = $this->extractTagFromSoapResp($resp, 'ArticleID');
    	$ticketId     = $this->extractTagFromSoapResp($resp, 'TicketID');
    	$ticketNumber = $this->extractTagFromSoapResp($resp, 'TicketNumber');
    
    	return $errorMsg?:[
    	       'articleId'  => $articleId,
    	       'ticketId'  => $ticketId,
    	       'ticketNumber'  => $ticketNumber,
        ];
    }
    
    public function ticketGet_Otrs ($otrs, $input)
    {
    	return $this->getTicket_Otrs ($otrs, [$input['id']], false);
    }
    
    private function getTicket_Otrs ($otrs, $ticketIdList = [], $attachments = false)
    {
    	$location = $otrs->getLocation();
    	$username = $otrs->getUsername();
    	$password = $otrs->getPassword();
    	$namespace = $otrs->getNamespace();
    
    	$ticketList = [];
    
    	$xml = [
    	'UserLogin' => $username,
    	'Password' => $password,
    	];
    
    	// Search for all tickets
    	$getXml      = $xml + [
        	'Extended' => true,
        	'AllArticles' => true,
        	// gli attachments solo in apertura della preview
        	'Attachments' => $attachments,
    	];
    	
    	$respTickets = $this->callOtrs($location, $username, $password, $namespace,
    			self::TICKET_GET, $getXml + ['TicketID' => $ticketIdList]);
    
    	$result = $this->extractTagFromSoapResp($respTickets, 'Ticket');
    	return $result;
    }
    
    private function extractTagFromSoapResp($xmlResponce, $tagName)
    {
        $doc    = new \DOMDocument('1.0', 'utf-8');
        $doc->loadXML( $xmlResponce );
        $nodes  = $doc->getElementsByTagName($tagName);
        $list = [];
        foreach($nodes as $node){
            $value = $this->nodeToArray( $doc, $node);
        	$list[] = $value?:$node->nodeValue;
        }
        return $list;
    }
    
     /**
     * Returns an array representation of a DOMNode
     * Note, make sure to use the LIBXML_NOBLANKS flag when loading XML into the DOMDocument
     * @see http://php.net/manual/en/class.domnode.php#115448
     * 
     * @param DOMDocument $dom
     * @param DOMNode $node
     * @return array
     */
    private function nodeToArray( $dom, $node, $multiNode = ['Article']) {
        if(!is_a( $dom, 'DOMDocument' ) || !is_a( $node, 'DOMNode' )) {
            return false;
        }
        $array = false; 
        if( empty( trim( $node->localName ))) { // Discard empty nodes
            return false;
        }
        if( XML_TEXT_NODE == $node->nodeType ) {
            return $node->nodeValue;
        }
        foreach ($node->attributes as $attr) { 
            $array['@'.$attr->localName] = $attr->nodeValue; 
        } 
        foreach ($node->childNodes as $childNode) { 
            if ( isset($childNode->childNodes) && // added by @fbfz to prevent warning
                1 == $childNode->childNodes->length &&
                XML_TEXT_NODE == $childNode->firstChild->nodeType ) {
                // note by @fbfz: multiple nodes with same name are overriden
                //$array[$childNode->localName] = $childNode->nodeValue;
                if (in_array($childNode->localName, $multiNode)){
                	$array[$childNode->localName][] = $childNode->nodeValue;
                }else{
                	$array[$childNode->localName] = $childNode->nodeValue;
                }
            }  else {
                if( false !== ($a = self::nodeToArray( $dom, $childNode))) {
                    // replaced by @fbfz to support multiple nodes with same name
                    //$array[$childNode->localName] =     $a;
                	if (in_array($childNode->localName, $multiNode)){
                		$array[$childNode->localName][] = $a;
                	}else{
                	    $array[$childNode->localName] = $a;
                	}
                }
            }
        }
        return $array; 
    }
    
    private function callOtrs($location, $username, $password, $namespace, $operation, $xml)
    {
        // Set up a new SOAP Connection
        $soapclient = new \SoapClient(null, array('location'  => $location,
            'uri'       => $namespace,
            'trace'     => 1,
            'login'     => $username,
            'password'  => $password,
            'style'     => SOAP_RPC,
            'use'       => SOAP_ENCODED,
        ));
        
        // Preparing Params for call
        $param_arr = [];
//        $dump = false;
        foreach ($xml as $k => $v){
            
            if($k=='DynamicField'){
                if (!empty($v) && array_keys($v) !== range(0, count($v) - 1)){
                	{$param_arr[] = new \SoapParam ( $v, $k );} // usata?!?
                }else{
                	foreach($v as $vv){
                	    $items[] = $item = new \stdClass();
                	    $item->Name = $vv['Name'];
                	    $item->Value = $vv['Value'];
                	}
                	$param_arr[] = new \SoapVar($items, SOAP_ENC_ARRAY);
                	$dump = true;
            	}
            	
            }elseif(is_array($v)){
        		if (!empty($v) && array_keys($v) !== range(0, count($v) - 1)){
        		  {$param_arr[] = new \SoapParam ( $v, $k );}
        		}else{
        			foreach($v as $vv){
        		      {$param_arr[] = new \SoapParam ( $vv, 'ns1:'.$k );}
			}}}else{
                {$param_arr[] = new \SoapParam ( $v, 'ns1:'.$k );}
            }
        }
    	// Call
        $result = call_user_func_array([$soapclient, $operation], $param_arr);
        $req = $soapclient->__getLastRequest();
        $xml = $soapclient->__getLastResponse();
        
//        if ($dump) die( $req ."\r\r\r". $xml );
        
        return $xml;
    }
    
    function translate ($string) {
        $translator = $this->getServiceLocator()->get('viewhelpermanager')->get('translate');
        return $translator($string);
    }
    
    function formatErrorMessage ($message, $type = 2 )
    {
        $presentation = [
            0 => '',
            1 => '<strong>'.$this->translate('Errore').':</strong> ',
            2 => '<strong>'.$this->translate('Errore Server').':</strong> ',
        ];
   		return sprintf($presentation[$type].'%s', $this->translate($message));
    }
    
    function formatSuccessMessage ($message, $type = 1 )
    {
        $presentation = [
            0 => '',
            1 => '<strong>'.$this->translate('Successo').':</strong> ',
        ];
    	return sprintf($presentation[$type].'%s', $this->translate($message));
    }
    
    public function inputEvaulate (&$input, $expected_params = []) {
    
    	$pars = $this->request->getPost ()->toArray ();
    
    	// check paramers
    	foreach (array_keys($expected_params) as $par)
    	{
    		if (!array_key_exists($par, $pars) ||
    		preg_match($expected_params[$par], $pars[$par]) !== 1){
    			return ['alert-danger' => $this->formatErrorMessage('Dati trasmessi incompleti o errati!') ];
    		}else{
    			$input[$par] = $pars[$par];
    		}
    	}
    	// add remaining
    	$diff = array_diff_key($pars, $input);
    	$input = array_merge($input, $diff);
    
    	return false;
    }
    
    /**
     * Is the user using IPAD?
     *
     * @return boolean
     */
    function getClientDeviceType()
    {
    	$userAgent = $_SERVER['HTTP_USER_AGENT'];
    	if (preg_match('/Apple/i', $userAgent) && preg_match('/iPad/i', $userAgent))
    		return 'ios';
    	else if (preg_match('/MSIE/i', $userAgent) && preg_match('/Win/i', $userAgent))
    		return 'win';
    	else
    		return 'other';
    }
    
    public function getSession()
    {
    	if (!isset($this->session))
    	    $this->session = new Container('session');
    	return $this->session;
    }
    
    function viewModel($variables = array(), $options = null)
    {
    	// Management system messages
    	$alert = ["alert-error"=>[],"alert"=>[],"alert-success"=>[],"alert-info"=>[]];
    	
    	// Retrive messages from _GET
    	foreach ( array_keys($alert) as $key)
    		$alert[$key] += array_key_exists ( $key , $_GET ) && !empty($_GET[$key]) ? [urldecode($_GET[$key])] : [] ;
    	
    	// Retrive messages from flash service
    	$alert['alert-error'] 	= array_merge ($alert['alert-error'], $this->flashMessenger()->getErrorMessages());
    	$alert['alert'] 		= array_merge ($alert['alert'], $this->flashMessenger()->getMessages());
    	$alert['alert-success'] = array_merge ($alert['alert-success'], $this->flashMessenger()->getSuccessMessages());
    	$alert['alert-info'] 	= array_merge ($alert['alert-info'], $this->flashMessenger()->getInfoMessages());

    	$session = $this->getSession();
    	
     	if (isset($session->user))
    		$name = ($session->user->getName())?:$session->user->getUsername();
     	else
     		$name = null;

     	$page = $this->getServiceLocator()->get('navigation')->findOneBy('active', 1);
     	     	
    	// Alerting for session penting events
     	$scripts = [
     		//'/\\/portal\\/homepage\\/mediaUpdate$/i',
     	];
     	$is_script = false;
     	for ( ; $scripts; $is_script || preg_match( array_shift( $scripts), $_SERVER['REQUEST_URI']));
     	
     	if (!$is_script)
     	{
   			// Session pending events alerts
   			if ($page->hasPages())
   				if($subpage = $page->findOneBy('active', 1))
   					$page = $subpage;
     	}

        // Default parameters
        $default = array(
        		'alert' =>  $alert,
        		'here' => $page,
        		'name' => $name,
        	);
        
        // Merge view vars with default 
        $vars = array_merge_recursive($variables, $default);

        return new ViewModel($vars, $options);
    }
    
    function jsonModel($variables = array())
    {
    	// Default parameters
    	$default = array(
    			//'success' =>  true,
    	);
    	
    	// Merge json vars with default
    	$vars = $variables + $default;
    	
    	return new JsonModel($vars);
    }
}
