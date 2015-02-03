<?php
namespace ZtZend\Mvc\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Zend\Session\Container;
use Zend\Session\SessionManager;
use Zend\Session\Storage\SessionArrayStorage;
use Zend\I18n\Translator\Translator;

class ZtAbstractActionController extends AbstractActionController {
    
    private $session;
    
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
    		preg_match($expected_params[$par], $pars[$par]) !== 1)
    			return ['alert-danger' => $this->formatErrorMessage('Dati trasmessi incompleti o errati!') ];
    		else
    			$input[$par] = $pars[$par];
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
     	
     	// Table sizes
   		$sm = $this->getServiceLocator ();
   		$config = $sm->get ( 'Config' );
   		//$displayLength = $config ['tableItems'] [ZtAbstractActionController::getClientDeviceType ()];

        // Default parameters
        $default = array(
        		'alert' =>  $alert,
        		'here' => $page,
        		//'displayLength' => $displayLength,
        		'name' => $name,
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
