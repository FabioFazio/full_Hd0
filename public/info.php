<html>
<head>
<meta charset="utf-8">
<title>SilverSea - Web Compass</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript">
<!--
/** Detect UA and alert compatibility
 *  
 */

function get_browser() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] == 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) { return 'Opera ' + tem[1]; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return M[0];
}
 
function get_browser_version() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        //return 'IE '+(tem[1]||'');
        return (tem[1] || '');
    }
    if (M[1] == 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        //if(tem!=null)   {return 'Opera '+tem[1];}
        if (tem != null) { return tem[1]; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return M[1];
}

$(document).ready(function () {
    var browserK = get_browser();
    var browserV = get_browser_version();
//     if (browserK.indexOf('IE') < 0 && browserV < 9)
//    	alert('Internet Explorer supported from ver.9. Actually you are using ver.: ' + browserV);
    alert(browserK +' ver.' + browserV);
});
//-->
</script>

</head>
<body>
<?php
phpinfo();
?>
</body>
</html>