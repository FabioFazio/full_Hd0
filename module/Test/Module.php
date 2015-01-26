<?php
namespace Test;

use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\Authentication\Storage;
use Zend\Authentication\AuthenticationService;
use Zend\Authentication\Adapter\Ldap as AuthAdapter;    
use Zend\Config\Reader\Ini as ConfigReader;
use Zend\Config\Config;
use Zend\Session\Container;

use Zend\Log\Logger;
use Zend\Log\Writer\Stream as LogWriter;
use Zend\Log\Filter\Priority as LogFilter;

class Module
{
    public function getServiceConfig()
    {
    	return array(
    	'factories'=>array(
    			'StorageService' => function($sm){
    			    
    				return new \ZtZend\Authentication\Storage\AuthStorage('authStorage');
    			},

    			'LogService' => function($sm) {
    				
			    	$logger = new Logger;
			    	
			    	$writer = new LogWriter($sm->get('Config')['logPath']);
			    	
			    	$logger->addWriter($writer);
			    	 
			    	$filter = new LogFilter(Logger::DEBUG);
			    	$writer->addFilter($filter);
			    	 
                    return $logger;
    			},
    			
    			'AuthService' => function($sm) {

    			    $authService = new AuthenticationService();
    				
    				$configReader = new ConfigReader();
    				$configData = $configReader->fromFile($sm->get('Config')['configLdap']);
    				$config = new Config($configData, true);
    				 
    				$log_path = $config->develop->ldap->log_path;
    				$options = $config->develop->ldap->toArray();
    				unset($options['log_path']);
    				
    				$authAdapter = new AuthAdapter($options);
    				$authService->setAdapter($authAdapter);
    				
    				
    				$authService->setStorage($sm->get('StorageService'));
    
    				return $authService;
    			},
    		),
    	);
    }
    
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }
}
