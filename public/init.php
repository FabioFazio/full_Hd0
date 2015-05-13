<?php
//$actions[] = 'cd ../vendor/bin/; ls -tharl';
$actions[] = '../doctrine-module orm:validate-schema';
//$actions[] = '../vendor/doctrine/doctrine-module/bin/doctrine-module orm:schema-tool:create';
//$actions[] = '/usr/bin/mysql -uhd0 -p hd0 < ../data/sql/install.sql';

foreach ($actions as $act){
    $output[] = '<b>'.$act.'</b>';
    $output[] = '<br/><br/>'.shell_exec($act);
}
?>
<pre>
<?php echo str_replace("\n","<br />", print_r($output, 1)); ?>
</pre>