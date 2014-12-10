<?php

namespace Test\Controller;

use ZtZend\Mvc\Controller\ZtAbstractActionController as ZtAbstractActionController;

class FrontendController extends ZtAbstractActionController {

    public function indexAction()
    {
        $modals = array (
    		array (
				'modalName' => 'modal/ticket.phtml',
				'modalParams' => array ()
    		),
        );
        
        return $this->viewModel ( array (
        		'modals' => $modals,
            )
        );
    }
}

