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

define('CONFIG_LDAP', '/var/www/hd0/ldap-config.ini');

class FrontendController extends ZtAbstractActionController {

    public function loginAction(){
        
        $username = $this->getRequest()->getPost('username');
        $password = $this->getRequest()->getPost('password');
        
        $auth = new AuthenticationService();
        
        $configReader = new ConfigReader();
        $configData = $configReader->fromFile(CONFIG_LDAP);
        $config = new Config($configData, true);
        
        $log_path = $config->develop->ldap->log_path;
        $options = $config->develop->ldap->toArray();
        unset($options['log_path']);
        
        $adapter = new AuthAdapter($options,
        		$username,
        		$password);
        
        $result = $auth->authenticate($adapter);
        
        if ($log_path) {
        	$messages = $result->getMessages();
        
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
        return $this->jsonModel($messages);
    }
    
    public function doctrineAction()
    {
        $objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        
        $user = new \Test\Entity\User();
        $user->setFullName('Marco Pivetta');
        $user->setEmail('marco@vetta.it');
        
        $objectManager->persist($user);
        $objectManager->flush();
        
        die(var_dump($user->getId())); // yes, I'm lazy
    }
        
    public function indexAction()
    {
        $modals = array (
    		array (
				'modalName' => 'modal/demo-ticket.phtml',
				'modalParams' => array ()
    		),
        );
        
        return $this->viewModel ( array (
        		'modals' => $modals,
            )
        );
    }
    
    public function index2Action()
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
}

