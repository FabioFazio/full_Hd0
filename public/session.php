<?php
$session = array();
if(isset($_COOKIE['PHPSESSID']))
{
	$cwd = getcwd();
	require '../init_autoloader.php';
	Zend\Mvc\Application::init(require 'config/application.config.php');
	$session = $_SESSION;
}
?>
<h2>PHP Session</h2>
<pre>
<?php echo str_replace("\n","<br />", print_r($session, 1)); ?>
</pre>