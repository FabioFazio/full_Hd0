<?php
namespace ZtZend\Authentication\Storage;

use Zend\Authentication\Storage;
use Zend\Session\Container;

class AuthStorage extends Storage\Session
{
	public function setRememberMe($rememberMe = 0, $time = 1209600)
	{
		if ($rememberMe == 1) {
			$this->session->getManager()->rememberMe($time);
		}
	}
	 
	public function forgetMe()
	{
		$this->session->getManager()->forgetMe();
	}
	
	public function clear()
	{
	    $session = new Container('session');
	    $session->getManager()->getStorage()->clear();
	    return parent::clear();
	}
}