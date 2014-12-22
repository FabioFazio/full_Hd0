<?php

namespace Test\Controller;

use ZtZend\Mvc\Controller\ZtAbstractActionController as ZtAbstractActionController;

class FrontendController extends ZtAbstractActionController {

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

