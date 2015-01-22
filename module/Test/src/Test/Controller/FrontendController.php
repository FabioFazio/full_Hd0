<?php

namespace Test\Controller;

use ZtZend\Mvc\Controller\ZtAbstractActionController as ZtAbstractActionController;

use Zend\Authentication\AuthenticationService;
use Zend\Authentication\Adapter\Ldap as AuthAdapter;
use Zend\Config\Reader\Ini as ConfigReader;
use Zend\Config\Config;
use Zend\Log\Logger;
use Zend\Log\Writer\Stream as LogWriter;
use Zend\Log\Filter\Priority as LogFilter;

define('CONFIG_LDAP', SERVER_ROOT . '/config/ldap-config.ini');

class FrontendController extends ZtAbstractActionController {

    public function loginAction() {
    	$pars = $this->request->getPost ()->toArray ();
    	$input = [];
    
    	//validate input
    	$expected_params = [
    	'username'		=> '/[.]*/',
    	'password'		=> '/[.]*/',
    	];
    
    	// check paramers
    	foreach (array_keys($expected_params) as $par)
    	{
    		if (!array_key_exists($par, $pars) ||
                    preg_match($expected_params[$par], $pars[$par]) !== 1)
    			return $this->jsonModel ( ['alert-danger' =>
    			        $this->formatErrorMessage('Dati trasmessi incompleti o errati!') ] );
    		else
    			$input[$par] = $pars[$par];
    	}
    
    	$auth = new AuthenticationService();
    	
    	$configReader = new ConfigReader();
    	$configData = $configReader->fromFile(CONFIG_LDAP);
    	$config = new Config($configData, true);
    	
    	$log_path = $config->develop->ldap->log_path;
    	$options = $config->develop->ldap->toArray();
    	unset($options['log_path']);
    	
    	$adapter = new AuthAdapter($options,
    			$input['username'],
    			$input['password']);
    	
    	$result = $auth->authenticate($adapter);
    	$messages = $result->getMessages();
    	
    	if ($log_path) {
    		
    		$logger = new Logger;
    		$writer = new LogWriter($log_path);
    	
    		$logger->addWriter($writer);
    	
    		$filter = new LogFilter(Logger::DEBUG);
    		$writer->addFilter($filter);
    	
    		foreach ($messages as $i => $message) {
    			if ($i-- > 1) { // $messages[2] and up are log messages
    				$message = str_replace("\n", "\n  ", $message);
    				$logger->debug("Ldap: $i: $message");
    			}
    		}
    	}
    	
    	if ((strtolower($messages[0]) == 'invalid credentials')) {
    	    $result = ['alert-danger' =>
    	    		$this->formatErrorMessage('Nome Utente o Password errati!', 0) ];
    	} else {
    	    // check db: if not exists, create. if has no email, require it
    	    $objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
    	    $user = $objectManager
        	    ->getRepository('Test\Entity\User')
        	    ->findOneBy(array('username' => $input['username']));
    	    if (!$user)
    	    {
    	    	$user = new \Test\Entity\User();
    	    	$user->setUsername($input['username']);
    	    	$user->setEmail($input['username']); // Temporary value
    	    	$objectManager->persist($user); // local commit
    	    }
    	    $this->getSession()->user = $user; // push on session
    	    $objectManager->flush(); // push on db    	    
    	    
    		$result = [
    		    'id'	=> $user->getId(),
    		    'username'	=> $user->getUsername(),
    		    'name'	=> $user->getName(),
    		    'email'	=> ($user->getEmail() == $user->getUsername())? '' : $user->getEmail(),
                'alert-success' => $this->formatSuccessMessage('Benvenuto/a '. $user->getUsername() .'!', 0),
		    ];
    	}
    	return $this->jsonModel ( $result );
    }
    
    public function settingsAction() {
    	$pars = $this->request->getPost ()->toArray ();
    	$input = [];
    
    	//validate input
    	$expected_params = [
        	'id'		=> '/'. $this->getSession()->user->getId(). '/',
        	'name'		=> '/[.]*/',
        	'email'		=> '/[.]*/',
    	];
    
    	// check paramers
    	foreach (array_keys($expected_params) as $par)
    	{
    		if (!array_key_exists($par, $pars) ||
    		  preg_match($expected_params[$par], $pars[$par]) !== 1)
    			return $this->jsonModel ( ['alert-danger' =>
    			        $this->formatErrorMessage('Dati trasmessi incompleti o errati!') ] );
    		else
    			$input[$par] = $pars[$par];
    	}
    
    	// db update email
    	$objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
    	$user = $objectManager->find('Test\Entity\User', $input['id']);
    	$user->setEmail($input['email']);
    	$user->setName($input['name']);
    	$objectManager->persist($user); // local commit
    	$this->getSession()->user = $user; // push on session
    	$objectManager->flush(); // push on db
    	$error = false;
    	
    	if ($error) {
    		$result = ['alert-danger' =>
    		  $this->formatErrorMessage('Nome Utente o Password errati!', 0)];
    	} else {
    		$result = [
    		  'alert-success' => 
    		      $this->formatSuccessMessage('Profilo Utente aggiornato!'),
    		  'auth_email' => $input['email'],
    		  'auth_name' => $input['name'],
			];
    	}
    	return $this->jsonModel ( $result );
    }
        
    public function doctrineAction()
    {
    	$objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
    
    	$user = new \Test\Entity\UserTest();
    	$user->setFullName('Marco Pivetta');
    	$user->setEmail('marco@vetta.it');
    
    	$objectManager->persist($user);
    	$objectManager->flush();
    
    	die(var_dump($user->getId())); // yes, I'm lazy
    }
    
    public function staticAction()
    {
    	$modals = array (
            array (
				'modalName' => 'modal/demo2-ticket.phtml',
				'modalParams' => array ()
			),
	        array (
        		'modalName' => 'modal/login.phtml',
        		'modalParams' => array ()
	        ),
	        array (
        		'modalName' => 'modal/settings.phtml',
        		'modalParams' => array ()
	        ),
    	);
    
    	return $this->viewModel ( array (
			'modals' => $modals,
	        )
    	);
    }
    
    public function indexAction()
    {
    	$modals = array (
    		array (
    			'modalName' => 'modal/demo-ticket.phtml',
    			'modalParams' => array ()
    		),
    	);
    	return $this->viewModel ( array ( 'modals' => $modals ));
    }
}

