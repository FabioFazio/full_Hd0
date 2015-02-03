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

class FrontendController extends ZtAbstractActionController {

    protected $baseauthservice;
    protected $ldapauthservice;
    protected $storage;
    protected $logservice;

    public function getAuthService()
    {
    	return $this->getBaseAuthService();
        //return $this->getLdapAuthService();
    }
    
    public function authentication($input)
    {
        return $this->baseAuthentication($input);
        //return $this->ldapAuthentication($input);
    }
    
    public function getLdapAuthService()
    {
    	if (! $this->ldapauthservice) {
    		$this->ldapauthservice = $this->getServiceLocator()->get('LdapAuthService');
    	}
    	return $this->ldapauthservice;
    }
    
    public function getBaseAuthService()
    {
    	if (! $this->baseauthservice) {
    		$this->baseauthservice = $this->getServiceLocator()->get('BaseAuthService');
    	}
    	return $this->baseauthservice;
    }
    
    public function getStorageService()
    {
    	if (! $this->storage) {
    		$this->storage = $this->getServiceLocator()->get('StorageService');
    	}
    	return $this->storage;
    }
    
    public function getLogService()
    {
    	if (! $this->logservice) {
    		$this->logservice = $this->getServiceLocator()->get('LogService');
    	}
    	return $this->logservice;
    }
    
    protected function ldapAuthentication($input)
    {
        $result = $this->getLdapAuthService()->getAdapter()
            ->setUsername($input['username'])
            ->setPassword($input['password'])
            ->authenticate();
         
        /*
         // Gestione dei gruppi utenti FIXME @fbfz
        $groups = $this->getAuthService()->getAdapter()->getAllGroups();
        $userGroupsDn = []; $userGroupsCn = [];
        foreach ($groups as $group){
        if($this->getAuthService()->getAdapter()->isMemberOf($group['cn'][0]))
        	$userGroupsCn[] = $group['cn'][0];
        }
        // Gestione dei gruppi utenti - FINE
        */
         
        $messages = $result->getMessages();
         
        foreach ($messages as $i => $message) {
        	if ($i-- > 1) { // $messages[2] and up are log messages
        		$message = str_replace("\n", "\n  ", $message);
        		$this->getLogService()->debug("Auth Ldap: $i: $message");
        	}
        }
        
        if ($result->isValid()) /// if ( strtolower($messages[0]) == 'invalid credentials' )
        {
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
            $objectManager->flush(); // push on db
            
            return $user;
        }
        else
            return false;
    }
    
    protected function baseAuthentication($input)
    {
        $this->getBaseAuthService()->getAdapter()
        	->setIdentityValue($input['username'])
        	->setCredentialValue($input['password']);
        
        $result = $this->getBaseAuthService()->getAdapter()->authenticate();
    	
        $messages = $result->getMessages();
         
        foreach ($messages as $i => $message) {
    		$message = str_replace("\n", "\n  ", $message);
    		$username = $input['username'];
    		$this->getLogService()->debug("Auth Base: $i: $username $message");
        }
        
        $this->getLogService()->debug("Auth Base: ".$input['username']." $message");
        
    	return $result->isValid()?$result->getIdentity():false;
    }
    
    public function loginAction() {
        //validate input
        $input = [];
        $errors = $this->inputEvaulate ($input, [
    	       'username'		=> '/[.]*/',
    	       'password'		=> '/[.]*/',
    	   ]);
        if ($errors)
            return $this->jsonModel ( $errors );
        
        
        if (!($user = $this->authentication($input)))
        {
            $result = ['alert-danger' =>
            $this->formatErrorMessage( 'Nome Utente o Password errati!', 0) ];
        }else{

    	    if (isset($input['rememberme']))
    	    {
    	        $storage = $this->getServiceLocator()->get('StorageService');
    	        $storage->setRememberMe(1);
    	        $this->getAuthService()->setStorage($storage);
    	    }
    	    $this->getSession()->user = $user; // push on session
    	    
    	    $email = ($user->getEmail() == $user->getUsername())? '' : $user->getEmail();
    	    $alertSuccess = $this->formatSuccessMessage('Benvenuto/a '. $user->getName()?:$user->getUsername() .'!', 0);
    	    
    		$result = [
    		    'id'	=> $user->getId(),
    		    'username'	=> $user->getUsername(),
    		    'name'	=> $user->getName(),
    		    'email'	=> $email,
                'alert-success' => $alertSuccess,
		    ];
    	}
    	return $this->jsonModel ( $result );
    }
    
    public function logoutAction() {
        $user = $this->getSession()->user;
        $username = ($user)?$user->getUsername():'[?]';
        
        $this->getStorageService()->forgetMe();
        $this->getAuthService()->clearIdentity();
        $this->getStorageService()->clear('');
        
        $this->flashmessenger()->addSuccessMessage('Sessione di lavoro terminata!');
        $this->getLogService()->debug("Auth: $username Session terminated.");
        
        return $this->redirect()->toRoute('home');
    }
    
    public function settingsAction() {
        
        //validate input
        $input = [];
        $errors = $this->inputEvaulate ($input, [
        	   'id'		=> '/'. $this->getSession()->user->getId(). '/',
        	   'name'		=> '/[.]*/',
        	   'email'		=> '/[.]*/',
    	   ]);
        if ($errors)
        	return $this->jsonModel ( $errors );
    
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
        if ($user = $this->getSession()->user)
        	$user = [
        		    'id'	=> $user->getId(),
        		    'username'	=> $user->getUsername(),
        		    'name'	=> $user->getName(),
        		    'email'	=> ($user->getEmail() == $user->getUsername())? '' : $user->getEmail(),
                ];
            
    	$modals = array (
            array (
				'modalName' => 'modal/demo2-ticket.phtml',
				'modalParams' => array ()
			),
	        array (
        		'modalName' => 'modal/login.phtml',
        		'modalParams' => array ( 'user' => $user ),
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

