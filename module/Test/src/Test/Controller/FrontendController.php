<?php

namespace Test\Controller;

use ZtZend\Mvc\Controller\ZtAbstractActionController as ZtAbstractActionController;

use Zend\Authentication\AuthenticationService;
use Zend\Authentication\Adapter\Ldap as AuthAdapter;
use Zend\Config\Reader\Ini as ConfigReader;
use Zend\Config\Config;
//use Zend\Log\Logger;
//use Zend\Log\Writer\Stream as LogWriter;
//use Zend\Log\Filter\Priority as LogFilter;
use Test\Entity\Service;
use Zend\Validator\File\Sha1;
use Doctrine\Common\Collections\ArrayCollection;

class FrontendController extends ZtAbstractActionController {

    protected $baseauthservice;
    protected $ldapauthservice;
    protected $storage;
    protected $logservice;
    protected $objectManager;

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
    
    public function getObjectManager()
    {
        if (! $this->objectManager) {
        	$this->objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        }
        return $this->objectManager;
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
            $objectManager = $this->getObjectManager();
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
    
    private function getUserQueues()
    {
        $user = $this->getSession()->user;
        $result = [];
        
        if (!isset($this->getSession()->queues))
        {
        	$queues = [];
        	$objectManager = $this->getObjectManager();
        	$userObj = $objectManager->getRepository('Test\Entity\User')->find($user['id']);
        
        	if (count($objectManager->getRepository('Test\Entity\Group')->findAll())){
        	    $queues = $userObj->getQueues();
        	}else{
        		$queues = $objectManager->getRepository('Test\Entity\Queue')->findBy(['removed'=>false],['order'=>'ASC']);
        	}

        	$this->getSession()->queues = $queues;
        }
        
        return $this->getSession()->queues;
    }
    
    public function getCategoriesAction()
    {
        return $this->jsonModel ( $this->getUserQueues() );
    }
    
    public function getTicketsAction()
    {
        $user = $this->getSession()->user;
        $email = $user['email'];
        $result = [];
        
        $objectManager = $this->getObjectManager();
        $queues = $this->getUserQueues();
        
        // Genero le query per gli OTRS allo code relative di cui l utente ha accesso
        $serviceType = Service::$TYPE_OTRS;
        $otrsServices = $objectManager->getRepository('Test\Entity\Service')->findBy(['type'=>$serviceType]);
        
        foreach($otrsServices as $otrs){
            global $otrsId;
            $otrsId = $otrs->getId();
            $func = function($v){
            	global $otrsId;
            	return $v['service_id'] == $otrsId;
            };
            $otrsQueues = array_filter($queues, $func);
            
            $otrsFpQueues = array_filter($queues, function($v){return $v['focalpoint'];});
            $otrsQueues = array_filter($otrsQueues, function($v){return !$v['focalpoint'];});
            $globalQueues = array_merge($otrsQueues, $otrsFpQueues);
            
            $fpQueueCodes = array_column($otrsFpQueues, 'code');
            $queueCodes = array_column($otrsQueues, 'code');
            
            unset($otrsId);
            
            /*
            $queueIds = array_column($otrsQueues, 'id');
            $criteria = new \Doctrine\Common\Collections\Criteria();
            $criteria->expr()->eq('queue', array_pop($queueIds));
            foreach ($queueIds as $id)
                $criteria->orWhere('queue = '.$id);
            $extraTickets = $user->getTracks()->findBy($criteria);
            $extraTicketsCode = array_column($extraTickets, 'code');
            */

            $param_queues = [
                'otrs' => $otrs,
                'queueCodes' => $queueCodes,
                'email' => $email,
                'focalpoint' => false,
                //'extraTickets' => &$extraTicketsCode, TODO
            ];
            
            $param_fpQueues = array_merge( $param_queues, [ 'queueCodes' => $fpQueueCodes, 'focalpoint' => true ] );
            
            $callName = "ticketSearch_" . ucfirst(strtolower($serviceType));
            
            $ticketList = call_user_func_array([$this, $callName], $param_queues);
            
            if(!empty($fpQueueCodes))
            {
                $fpTicketList = call_user_func_array([$this, $callName], $param_fpQueues);
                $ticketList = array_merge_recursive($ticketList, $fpTicketList);
            }
            
            $tickets = [];
            
            foreach($ticketList as $state => $list)
            {
                array_walk($list, function(&$v,$k,$qs){
                   global $f; $f=$v['QueueID'];
                   $q = current(array_filter($qs, function($q){global $f; return $q['code']==$f;}));
                   unset($f);
                   $articles = array_filter($v['Article'], function($a){
                            return in_array($a['ArticleType'], $this->getOtrsArticleTypes());
                        });
            	   $v = array_merge ( $v, [
            	           'ArticleNum' => count($articles)-1,
            	           'Article' => [current($v['Article'])],
            	           'Author' => current($v['Article'])['From'],
            	           'QueueName' => $q['name'],
            	           'QueueColor' => 'color-' . $q['order'],
            	           'QueueOrder' => $q['order'],
            	           'ServiceId' => $q['service_id'],
                        ]);
                }, $globalQueues);
                $tickets[$state] = array_values($list);
            }
            
           	$result += $tickets;
        }
        
        // Popola i messaggi
        $userObject = $objectManager->find('Test\Entity\User', $user['id']);
        $sectors = [];
        $result['messages'] = [];
        
        // Prenso i messaggi per i settori e non per i gruppi: funzionalità disponibile ma non implementata
        foreach($userObject->getGroups()->toArray() as $group)
            $sectors = array_merge($sectors, [$group->getSector()]);
        
        foreach($sectors as $sector)
        	$result['messages'] = array_merge($result['messages'], $sector->getAnnouncements()->toArray());

        $broadcasts = $objectManager->getRepository('Test\Entity\Announcement')->findBy(array('broadcast' => 1));
        $result['messages'] = array_merge($result['messages'], $broadcasts);
        
        array_walk($result['messages'], function(&$v){$v = $v->toArray();});
        
        if ($this->request->getQuery('dump', false))
            die(var_dump( $result ));
        else
            return $this->jsonModel ( $result );
    }
    
    public function getArticlesAction()
    {
        $result = [];
        $input = [];
        //validate input
        $errors = $this->inputEvaulate ($input, [
        		'id'		             => '/^\\d+$/',
                'service-id'		     => '/^\\d+$/',
        		]);
        
        if ($errors){
        	return $this->jsonModel ( $errors ); // not managed by now
        }
        
        // mi fido che sia otrs altrimenti non mi chiamata TODO chiamare solo se otrs
        $objectManager = $this->getObjectManager();
        $service = $objectManager->find('Test\Entity\Service', intval($input['service-id']));
        
        $serviceType = Service::$TYPE_OTRS;
        if ($service->getType() == $serviceType)
        {
            $param_arr = [
            'otrs' => $service,
            'input' => $input,
            ];
            
            $callName = "ticketGet_" . ucfirst(strtolower($serviceType));
            $resp = call_user_func_array([$this, $callName], $param_arr);
            $result += $resp[0]['Article'];
            
            global $filter;
            $filter = $this->getOtrsArticleTypes();
            $result = array_filter($result,
            		function($v){ global $filter; return in_array($v['ArticleType'], $filter); });
            unset($filter);
            
            usort($result, function($a,$b){
            	return ($a['Created']==$b['Created'])? 0: ($a['Created'] < $b['Created'])? -1: 1;
            });
            array_shift($result);
        }
        
        return $this->jsonModel ( $result );
    }
    
    public function saveTicketAction()
    {
        //return $this->jsonModel ($this->request->getPost ()->toArray ());
        $user = $this->getSession()->user;
        $objectManager = $this->getObjectManager();

        $result = [];
        $input = [];
        
        //validate input
        $errors = $this->inputEvaulate ($input, [
               'id'		     => '/^\\d+$/',
               'service-id'  => '/^\\d+$/',
    	       'title'	     => '/[.]*/',
               'description' => '/[.]*/',
               'queue-id'	 => '/[.]*/',
               'queue-name'	 => '/[.]*/',
               'queue-color' => '/[.]*/',
    	   ]);
        
        if ($errors){
            return $this->jsonModel ( $errors );
        }
        if (!in_array($input['queue-id'], array_column($this->getUserQueues(), 'id'))){
            return $this->jsonModel ( [
                    'alert-danger' => $this->formatErrorMessage('Mancano i permessi per creare questa segnalazione!') 
                ] );
        }
        
        $queue = $objectManager->find('Test\Entity\Queue', intval($input['queue-id']));
        $taxonomie = [];
        
        if (isset($input['taxonomie']) && $input['taxonomie'])
        {
        	foreach(explode("-",$input['taxonomie']) as $responce)
        	{
                $filter = $objectManager->find( 'Test\Entity\Filter', (int)$responce );
                $taxonomie[] = $filter->getResponce();
        	}
        }
        $input['taxonomie'] = $taxonomie;
        
        $service = $queue->getService();
        $input += ['queueCode' => $queue->getCode()];
        $input += ['email' => $user['email']];
        $serviceType = Service::$TYPE_OTRS;
        
        if ($service->getType() == $serviceType)
        {
            $param_arr = [
                'otrs' => $service,
                'input' => $input,
            ];
            
            $callName = "ticketCreate_" . ucfirst(strtolower($serviceType));
            $resp = call_user_func_array([$this, $callName], $param_arr);
        }
        if(count($resp)>1)
            $result = $resp + ['alert-success' => $this->formatSuccessMessage('La segnalazione è stata presa in consegna!')];
        else
            $result = [ 'alert-danger' => $this->formatErrorMessage(current($resp)) ];
    	return $this->jsonModel ( $result );
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
        
        
        if (!($user = $this->authentication($input)) || $user->isDisabled())
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
    	    $this->getSession()->user = $user->toArray(); // push on session
    	    $queues = $this->getUserQueues();
    	    
    	    $email = ($user->getEmail() == $user->getUsername())? '' : $user->getEmail();
    	    $alertSuccess = $this->formatSuccessMessage('Benvenuto/a '. $user->getName()?:$user->getUsername() . '!', 0);
    	    
    	    $arrayUser = $user->toArray(); 
    	    $arrayUser['email'] = $email;
    	    
    	    $arrayUser['password'] = sha1($arrayUser['password']);
    	    unset($arrayUser['tracks_id']);
    	    
    		$result = $arrayUser + [
    		    'queues' => $queues,
                'alert-success' => $alertSuccess,
		    ];
    	}
    	return $this->jsonModel ( $result );
    }
    
    public function logoutAction()
    {
    	$user = $this->getSession()->user;
        $username = ($user)?$user['username']:'[?]';
    
    	$this->getStorageService()->forgetMe();
    	$this->getAuthService()->clearIdentity();
    	$this->getStorageService()->clear('');
    
    	$this->getLogService()->debug("Auth: $username Session terminated.");
    	$result = [
    	   'alert-success' => 'Sessione di lavoro terminata!'
        ];
    	return $this->jsonModel( $result );
    }
    
    public function saveSettingsAction()
    {
        //validate input
        $input = [];
        $errors = $this->inputEvaulate ($input, [
        	   'id'		=> '/'. $this->getSession()->user['id'] .'/',
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
    	$this->getSession()->user = $user->toArray(); // push on session
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
    
    public function homeAction()
    {
    	$user = [];
    	$queues = [];
    	if ($user = $this->getSession()->user) {
    		$user['email'] = ($user['email'] == $user['username'])? '' : $user['email'];
    		$queues = $this->getUserQueues();
    	}
    	$modals = array (
    			array (
    					'modalName' => 'modal/ticket.phtml',
    					'modalParams' => array ()
    			),
    	        array (
    	        		'modalName' => 'modal/welcome.phtml',
    	        		'modalParams' => array ( 'user' => $user ),
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
    			'queues' => $queues,
    	        'otrsInlav' => $this->getOtrsInlavStateIds(),
    	        'otrsChiuse' => $this->getOtrsChiuseStateIds(),
    	)
    	);
    }
    
    public function staticAction()
    {
        $user = [];
        $queues = [];
        if ($user = $this->getSession()->user) {
        	$user = [
        		    'id'	=> $user->getId(),
        		    'username'	=> $user->getUsername(),
        		    'name'	=> $user->getName(),
        		    'email'	=> ($user->getEmail() == $user->getUsername())? '' : $user->getEmail(),
                ];
            $queues = $this->getUserQueues();
        }
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
	         'queues' => $queues,
	        )
    	);
    }
    
    public function getUsersAction()
    {
        $input = $this->request->getPost ()->toArray();
        $short = $this->request->getQuery('short', false);
        $user = $this->getSession()->user;
    	$result = [];

    	$userObject = $this->getObjectManager()->find('Test\Entity\User', $user['id']);
    	if ((!isset($input['secret']) || sha1($userObject->getPassword())!==$input['secret'] ||
    	       !$userObject->isAdministrator()) && !$this->request->getQuery('dump', false))
    	{
    		$result['error'] = "La sessione è terminata. Effetturare Logout, Login e riprovare";
    		return $this->jsonModel ( $result );
    	}
    	$result['users'] = [];
    
    	$users = $this->getObjectManager()->getRepository("Test\Entity\User")->findBy(['disabled'=>false]);
    	
    	if ($short)
    	{
    	    array_walk($users, function(&$v){
    	    	$v = ['id' => $v->getId(), 'fullname' => $v->getFullname()];
    	    });
    	} else {
        	array_walk($users, function(&$v){
                $qs = $v->getQueues(true);
                $ss = $v->getSectors();
                
        	    $v = $v->toArray();
        	    unset($v['groups_id']);
        	    unset($v['tracks_id']);
        	    unset($v['sectors']);
    
        	    array_walk($qs, function(&$q){
        	        $q = [ 'id' => $q['id'], 'name' => $q['name'], 'fp' => $q['focalpoint']];
        	    });
        	    $v['focalpoint'] = array_values(array_filter($qs,   function($q){return $q['fp'];}));
        	    $v['queues'] = array_values(array_filter($qs,       function($q){return !$q['fp'];}));
        	    $v['password'] = sha1($v['password']);
        	    $v['sector'] = !empty($ss)?current($ss)->toArray():null;
        	});
        }
        
    	foreach ($users as $user){
    	    $result['users'][$user['id']] = $user;
    	}
    
    	if ($this->request->getQuery('dump', false))
    		die(var_dump( $result ));
    	else
    		return $this->jsonModel ( $result );
    }
    
    public function getStoresAction()
    {
    	$input = $this->request->getPost ()->toArray();
    	$user = $this->getSession()->user;
    	$result = [];
    
    	$userObject = $this->getObjectManager()->find('Test\Entity\User', $user['id']);
    	if ((!isset($input['secret']) || sha1($userObject->getPassword())!==$input['secret'] ||
    			!$userObject->isAdministrator()) && !$this->request->getQuery('dump', false))
    	{
    		$result['error'] = "La sessione è terminata. Effetturare Logout, Login e riprovare";
    		return $this->jsonModel ( $result );
    	}
    	$result['stores'] = [];
    
    	$stores = $this->getObjectManager()->getRepository("Test\Entity\Store")->findBy(['disabled'=>false]);
    
    	array_walk($stores, function(&$v){
    		$v = $v->toArray();
    	});
    		 
    		foreach ($stores as $store){
    			$result['stores'][$store['id']] = $store;
    		}
    
    		if ($this->request->getQuery('dump', false))
    			die(var_dump( $result ));
    		else
    			return $this->jsonModel ( $result );
    }
    
    public function getQueuesAction()
    {
    	$input = $this->request->getPost ()->toArray();
    	$user = $this->getSession()->user;
    	$result = [];
    
    	$userObject = $this->getObjectManager()->find('Test\Entity\User', $user['id']);
    	if ((!isset($input['secret']) || sha1($userObject->getPassword())!==$input['secret'] ||
    	       !$userObject->isAdministrator()) && !$this->request->getQuery('dump', false))
    	{
    		$result['error'] = "La sessione è terminata. Effetturare Logout, Login e riprovare";
    		return $this->jsonModel ( $result );
    	}
    	$result['queues'] = [];
    
    	$queues = $this->getObjectManager()->getRepository("Test\Entity\Queue")->findBy(['disabled'=>false]);
    
    	array_walk($queues, function(&$v){
    		$v = $v->toArray();
    		unset($v['filters']);
    	});
    	
	    foreach ($queues as $queue){
	    	$result['queues'][$queue['id']] = $queue;
	    }
    
		if ($this->request->getQuery('dump', false))
			die(var_dump( $result ));
		else
			return $this->jsonModel ( $result );
    }
    
    public function getSectorsAction()
    {
    	$input = $this->request->getPost ()->toArray();
    	$user = $this->getSession()->user;
    	$result = [];
    
    	$userObject = $this->getObjectManager()->find('Test\Entity\User', $user['id']);
    	if ((!isset($input['secret']) || sha1($userObject->getPassword())!==$input['secret'] ||
    	!$userObject->isAdministrator()) && !$this->request->getQuery('dump', false))
    	{
    		$result['error'] = "La sessione è terminata. Effetturare Logout, Login e riprovare";
    		return $this->jsonModel ( $result );
    	}
    	$result['sectors'] = [];
    
    	$sectors = $this->getObjectManager()->getRepository("Test\Entity\Sector")->findBy(['disabled'=>false]);
    
    	array_walk($sectors, function(&$v){
    		$v = $v->toArray();
    		unset($v['filters']);
    	});
    
	    foreach ($sectors as $sector){
	    	$result['sectors'][$sector['id']] = $sector;
	    }    	
    	
		if ($this->request->getQuery('dump', false))
			die(var_dump( $result ));
		else
			return $this->jsonModel ( $result );
    }
    
    public function saveUserAction()
    {
        $defaultError = ['error'=>'Si è verificato un errore. Riprovare più tardi!']; //TODO set it universally!
        $input = $this->request->getPost ()->toArray();
        $user = $this->getSession()->user;
        $om = $this->getObjectManager();
        $result = [];
        
        $userObject = $om->find('Test\Entity\User', $user['id']);
        if (!isset($input['secret']) || sha1($userObject->getPassword())!==$input['secret'] ||
        !$userObject->isAdministrator())
        	return $this->jsonModel ( $defaultError );

    	$userToSave = ($input['id'])?$om->find('Test\Entity\User', $input['id']) : new \Test\Entity\User();
    	
        $userToSave->setName($input['name']);
        $userToSave->setEmail($input['email']);
        
        if (isset($input['password']))
            $userToSave->setPassword($input['password']);

        $userToSave->setAdministrator(isset($input['administrator'])?true:false);
        
        if (isset($input['username']))
            $userToSave->setUsername($input['username']);

        // Manage grants sector with single group
        $username = $userToSave->getUsername();
        $groups = new ArrayCollection();
        $group = null;
        
        if ($input['id']){
            $groups = $userToSave->getGroups()->filter(function($entry)use($username){return ($entry->getCode() == $username);});
        }

        if ($groups->isEmpty()){
            $group = new \Test\Entity\Group();
            $group->setCode($username);
            $group->setName($username);
        } else {
        	$group = $groups->first();
        }
        
    	$sector = ($input['sector'])?$om->find("Test\Entity\Sector", $input['sector']):null;
        $group->setSector($sector);
        
        // Reset grants
        $grants = $group->getGrants()->toArray();
        $group->setGrants(new ArrayCollection());
        foreach($grants as $grant){
        	$om->remove($grant);
        }
        
        if(isset($input['queues'])){
            $grant = new \Test\Entity\Grant();
            $grant->setCode($username);
            $grant->setName($username);
            $grant->setFocalpoint(false);
            foreach ($input['queues'] as $queue){
        	   $queue = $om->find("Test\Entity\Queue", $queue);
        	   if (empty($queue))
        	       return $this->jsonModel ( $defaultError );
        	   if (!in_array($queue, $grant->getQueues()->toArray()))
        	       $grant->getQueues()->add($queue);
            }
            $om->persist($grant);
            $group->getGrants()->add($grant);
        }
        
        if(isset($input['focalpoint'])){
            $fpgrant = new \Test\Entity\Grant();
            $fpgrant->setCode($username."-fp");
            $fpgrant->setName($username."-fp");
            $fpgrant->setFocalpoint(true);
            foreach ($input['focalpoint'] as $queue){
                $queue = $om->find("Test\Entity\Queue", $queue);
                if (empty($queue))
                	return $this->jsonModel ( $defaultError );
                if (!in_array($queue, $fpgrant->getQueues()->toArray()))
                    $fpgrant->getQueues()->add($queue);
            }
            $om->persist($fpgrant);
            $group->getGrants()->add($fpgrant);
        }
        
        $om->persist($group);
        
        $groups = New ArrayCollection(); 
        $groups->add($group);
        $userToSave->setGroups($groups);
        
        $om->persist($userToSave);
        try {
            $func = __FUNCTION__;
            $currentUser = $userObject->getUsername();
            $action = $input['id']? "edit" : "create";
            $extra = "\n".print_r($input, 1);
            
            $om->flush();
        }
        catch (\Exception $e) {
            
            $error = $e->getMessage();
            $this->getLogService()->emerg( "$func@<$currentUser>: $action <$username>: $error $extra");
            
            return $this->jsonModel ( $defaultError );
        }
        
        $this->getLogService()->info(  "$func@<$currentUser>: $action <$username>: $extra");
        $result['success'] = 'Utente salvato correttamente!';

        
        if ($this->request->getQuery('dump', false))
        	die(var_dump( $result ));
        else
        	return $this->jsonModel ( $result );
    }
    
    public function deleteUserAction()
    {
    	$input = $this->request->getPost ()->toArray();
    	$user = $this->getSession()->user;
    	$om = $this->getObjectManager();
    	$result = [];
    
    	$userObject = $om->find('Test\Entity\User', $user['id']);
    	if (!isset($input['secret']) || sha1($userObject->getPassword())!==$input['secret'] ||
    	   !$userObject->isAdministrator())
    	{
    		$result['error'] = "La sessione è terminata. Effetturare Logout, Login e riprovare";
    		return $this->jsonModel ( $result );
    	}
   	    if (isset($input['id']) && 
    	       $userToDelete = $om->find('Test\Entity\User', $input['id']))
    	{
            $userToDelete->setDisabled(true);
            // ^ rename unique fields to regenerate same user without problems
            $post = "_".time();
            $username = $userToDelete->getUsername();
            $userToDelete->setUsername($userToDelete->getUsername().$post);
            $userToDelete->setEmail($userToDelete->getEmail().$post);
            $groups = $userToDelete->getGroups()->filter(function($entry)use($username){return ($entry->getCode() == $username);});
            if(!$groups->isEmpty()){
                $group = $groups->first();
                $group->setCode($group->getCode().$post);
                foreach ($group->getGrants()->toArray() as $grant){
                	$grant->setCode($grant->getCode().$post);
                	$om->persist($grant);
                }
                $om->persist($group);
            }
            // $ rename unique fields to regenerate same user without problems
            
            $db = $om->persist($userToDelete);
            $om->flush();
            $result['success'] = 'Utente cancellato correttamente!';
    	}else{
    	}

		if ($this->request->getQuery('dump', false))
			die(var_dump( $result ));
		else
			return $this->jsonModel ( $result );
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

