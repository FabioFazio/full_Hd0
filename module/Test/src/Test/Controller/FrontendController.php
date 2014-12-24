<?php

namespace Test\Controller;

use ZtZend\Mvc\Controller\ZtAbstractActionController as ZtAbstractActionController;

class FrontendController extends ZtAbstractActionController {

    public function doctrineAction()
    {
        $objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        
        $user = new \Application\Entity\User();
        $user->setFullName('Marco Pivetta');
        
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
    	);
    
    	return $this->viewModel ( array (
    			'modals' => $modals,
    	        )
    	);
    }
}

