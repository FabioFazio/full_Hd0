<?php
ini_set('display_errors', 1);

$session = array();

if(isset($_COOKIE['PHPSESSID']))
{
	$cwd = getcwd();
	chdir('..');
	require 'init_autoloader.php';
	Zend\Mvc\Application::init(require 'config/application.config.php');
	chdir($cwd);
	
	session_start();
	$session =isset($_SESSION)?$_SESSION:[];
}
?>
<h2>PHP Session</h2>
<pre>
<?php echo str_replace("\n","<br />", print_r($session, 1)); ?>
</pre>