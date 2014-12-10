<?php
namespace ZtZend\Mvc\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
//use Zend\Db\Adapter\Adapter as Adapter;
//use Zend\Db\ResultSet\ResultSet;
use Zend\Session\Container;

class ZtAbstractActionController extends AbstractActionController {
    
    function formatErrorMessage ($message, $storedProcedure="")
    {
    	if ($storedProcedure)
    		return sprintf('<strong>Server Error:</strong> %s (%s)', $message, $storedProcedure);
    	else
    		return sprintf('<strong>Server Error:</strong> %s', $message);
    }
    
    function formatSuccessMessage ($message )
    {
    	return sprintf('<strong>Success:</strong> %s', $message);
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
    	if (isset($this->session))
    		return $this->session;
    
    	$this->session = new Container('session');
    	$error = null;
    	 
    	if (isset($this->session->voyageCurrent) &&
    	!isset($this->session->voyageFilter))
    		$error = $this->initVoyageFilter();
    
    	if($error)
    		$this->flashmessenger()->addErrorMessage($error);
    
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
    	
     	if (isset($session->username))
    		$username =
    			(strpos($session->username,'\\')===false)? // if is not a domain user1
    				$session->username :
    					substr($session->username, strpos($session->username,'\\')+1);
     	else
     		$username = null;

     	$page = $this->getServiceLocator()->get('structure')->findOneBy('active', 1);
     	     	
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
     	
     	// Table sizes
   		$sm = $this->getServiceLocator ();
   		$config = $sm->get ( 'Config' );
   		//$displayLength = $config ['tableItems'] [ZtAbstractActionController::getClientDeviceType ()];

        // Default parameters
        $default = array(
        		'alert' =>  $alert,
        		'here' => $page,
        		//'displayLength' => $displayLength,
        		'username' => $username,
        		//'log' => isset($this->getSession()->log)?$this->getSession()->log:array(),
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
    	$vars = array_merge_recursive($variables, $default);
    	
    	return new JsonModel($vars);
    }
}
