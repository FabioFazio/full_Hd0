<?php
namespace ZtZend\Navigation\Service\DefaultNavigationFactory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class ZtNavigationFactory implements FactoryInterface
{
	public function createService(ServiceLocatorInterface $serviceLocator)
	{
		$navigation =  new ZtNavigation();
		return $navigation->createService($serviceLocator);
	}
}