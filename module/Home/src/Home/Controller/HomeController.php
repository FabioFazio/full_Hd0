<?php

namespace Home\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class HomeController extends AbstractActionController
{

    public function indexAction()
    {
        $this->redirect()->toUrl("/hd0/assistenza");
        //return new ViewModel();
    }
}

