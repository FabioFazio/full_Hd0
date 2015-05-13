<?php
return array(
        'controllers' => array(
        		'invokables' => array(
        				'Home\Controller\Index' => 'Home\Controller\HomeController',
        		),
        ),
        'view_manager' => array(
        		'template_path_stack' => array(
        				'test' => __DIR__ . '/../view',
        		),
        ),
);