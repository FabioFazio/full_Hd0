<?php
namespace ZtZend\Navigation\Service\DefaultNavigationFactory;

use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\Navigation\Service\DefaultNavigationFactory;
use Zend\Session\Container;

class ZtNavigation extends DefaultNavigationFactory
{
	
	protected function getPages(ServiceLocatorInterface $serviceLocator)
	{
		//$adapter = $serviceLocator->get('Zend\Db\Adapter\Adapter');
		
		if (null === $this->pages) {
			
			/* Test */
			$mock = array ();
			$session = new Container('session');
			$dynamics = $session->mockMapsite = $mock;
			//$dynamics = isset($session->mapsite)?$session->mapsite:array();
			
			$default = parent::getPages($serviceLocator);
			
			if (empty($default)) {
				throw new Exception\InvalidArgumentException(sprintf(
						'Failed to find a navigation container by the name "%s"',
						$this->getName()
				));
			}
			
			$structure = array_merge_recursive ($default , $dynamics) ;			

			$application = $serviceLocator->get('Application');
			$routeMatch  = $application->getMvcEvent()->getRouteMatch();
			$router      = $application->getMvcEvent()->getRouter();
			$pages       = $this->getPagesFromConfig($structure);

			$this->pages = $this->injectComponents($pages, $routeMatch, $router);
		}
		return $this->pages;
	}
}