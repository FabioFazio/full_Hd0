<?php
return array(
        'controllers' => array(
        		'invokables' => array(
        				'Test\Controller\Frontend' => 'Test\Controller\FrontendController',
        		),
        ),
        'router' => array(
        		'routes' => array(
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
);