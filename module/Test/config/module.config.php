<?php
use Test\Entity\User;
return array(
        'controllers' => array(
        		'invokables' => array(
        				'Test\Controller\Frontend' => 'Test\Controller\FrontendController',
        		),
        ),
        'router' => array(
        		'routes' => array(

        		        'login' => array(
        		        		'type'    => 'literal',
        		        		'options' => array(
        		        				'route'    => '/login',
        		        				'defaults' => array(
        		        						'__NAMESPACE__' => 'Test\Controller',
        		        						'controller'    => 'Frontend',
        		        						'action'        => 'login',
        		        				),
        		        		),
        		        ),
        		        
        		        'logout' => array(
        		        		'type'    => 'literal',
        		        		'options' => array(
        		        				'route'    => '/logout',
        		        				'defaults' => array(
        		        						'__NAMESPACE__' => 'Test\Controller',
        		        						'controller'    => 'Frontend',
        		        						'action'        => 'logout',
        		        				),
        		        		),
        		        ),
        		        
        		        'test' => array(
        		                'type'    => 'segment',
        						'options' => array(
        								'route'    => '/test[/:controller[/:action[/:id]]]',
        								'constraints' => array(
        										'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
        										'action' => '(?!\bpage\b)(?!\border_by\b)(?!\bASC|DESC\b)(?!\bsearch_by\b)[a-zA-Z][a-zA-Z0-9_-]*',
        										'id'     => '[0-9]+(_[0-9]+)*',
        								),
        								'defaults' => array(
        										'__NAMESPACE__' => 'Test\Controller',
        										'controller' => 'Frontend',
        										'action'     => 'index',
        								),
        						),
        				),
        		),
        ),
        'view_manager' => array(
        		'template_path_stack' => array(
        				'test' => __DIR__ . '/../view',
        		),
        ),
        
        'doctrine' => array(
        		'driver' => array(
        				'application_entities' => array(
        						'class' =>'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
        						'cache' => 'array',
        						'paths' => array(__DIR__ . '/../src/Test/Entity')
        				),
        
        				'orm_default' => array(
        						'drivers' => array(
        								'Test\Entity' => 'application_entities'
        						)
        				)
        		),
                'authentication' => array(
                		'orm_default' => array(
                				'objectManager' => 'Doctrine\ORM\EntityManager',
                				'identityClass' => 'Test\Entity\User',
                				'identityProperty' => 'username',
                				'credentialProperty' => 'password',
                				'credentialCallable' => function(User $user, $passwordGiven) {
                					return $user->getPassword() === $passwordGiven;
                				}
                		),
                ),

        ),
);