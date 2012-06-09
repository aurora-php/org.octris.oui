#!/usr/bin/env php
<?php

/**
 * OUI Documentation server. PHP 5.4 required.
 *
 * @octdoc      h:bin/mktests
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

$sapi = php_sapi_name();
$info = posix_getpwuid(posix_getuid());

if ($sapi == 'cli') {
    // test php version
    $version = '5.4.0RC7';

    if (version_compare(PHP_VERSION, $version) < 0) {
        die(sprintf("unable to start webserver. please upgrade to PHP version >= '%s'. your version is '%s'\n", $version, PHP_VERSION));
    }

    // restart octdocd using php's webserver
    $cmd    = exec('which php', $out, $ret);
    $router = __FILE__;

    if ($ret !== 0) {
        die("unable to locate 'php' in path\n");
    }

    $host = '127.0.0.1';
    $port = '8888';

    $pid = exec(sprintf('((%s -d output_buffering=on -S %s:%s %s 1>/dev/null 2>&1 & echo $!) &)', $cmd, $host, $port, $router), $out, $ret);
    sleep(1);

    if (ctype_digit($pid) && posix_kill($pid, 0)) {
        die(sprintf("docserver started on '%s:%s' with PID %d\n", $host, $port, $pid));
    } else {
        die(sprintf("unable to start docserver on '%s:%s'\n", $host, $port));
    }
} elseif ($sapi != 'cli-server') {
    die("unable to execute octdocd server in environment '$sapi'\n");
}

// remove shebang from output
ob_end_clean();

// main
if (isset($_GET['js']) || isset($_GET['css'])) {
    if (isset($_GET['js'])) {
        $base = rtrim(realpath(__DIR__ . '/../'), '/') . '/libsjs/';
        $file = realpath(__DIR__ . '/../' . $_GET['js']);
        $mime = "text/javascript";
    } else {
        $base = rtrim(realpath(__DIR__ . '/../'), '/') . '/styles/';
        $file = realpath(__DIR__ . '/../' . $_GET['css']);
        $mime = "text/css";
    }

    header('Content-Type: ' . $mime);

    if (is_dir($base) && substr($file, 0, strlen($base)) === $base) {
        readfile($file);
    }

    exit;
} elseif (isset($_GET['doc'])) {
    list($section, $test) = explode(':', $_GET['doc']);

    if (ctype_alnum($section) && ctype_alnum($test)) {
        $doc = true;

        require_once(__DIR__ . '/../libs/util/depend.class.php');

        $depend = \org\octris\oui\util\depend::getDependencies(array($test));
    }
}

?>
<?xml version="1.0" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>OUI -- Octris User Interfaces</title>
        <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<?php
if (isset($doc)) {
    foreach ($depend->getCssDeps() as $file) {
        printf("<link rel=\"stylesheet\" type=\"text/css\" href=\"/?css=%s\" />\n", $file);
    }
    foreach ($depend->getJsDeps() as $file) {
        printf("<script type=\"text/javascript\" src=\"/?js=%s\"></script>\n", $file);
    }
} else {
?>
        <script type="text/javascript" src="/?js=libsjs/vendor/jquery-1.7.1.js"></script>
        <script type="text/javascript" src="/?js=libsjs/oui.js"></script>
<?php
}
?>
        <style type="text/css">
        body {
            font-family: Verdana, Arial, Helvetica, sans-serif;
        }
        #dialog {
            border:           1px dotted #aaa;
            padding:          5px;
        }
        #source {
            border:           1px dotted #aaa;
            padding:          5px;
            background-color: #eee;
        }
        table.doc {
            width: 100%;
            background-color: #eee;
        }
        table.doc th {
            background-color: #ddd;
            border-bottom:    1px dotted #000;
            padding:          2px 10px;
            text-align:       left;
        }
        table.doc td {
            border-bottom:    1px dotted #aaa;
            padding:          2px 10px;
        }
        pre {
            overflow: scroll;
        }
        div.box {
            float:      left;
            margin:     5px;
            padding:    5px;
            background: #eee;
        }
        div.box ul {
            padding: 0 0 0 20px;
        }
        </style>
    </head>
    
    <body>
        <h1>OUI &mdash; Octris User Interfaces</h1>
<?php
if (isset($doc)) {
?>
        <p>
            &gt; <a href="/">overview</a> &gt; <?php print "$section:$test"; ?>
        </p>

        <h2><?php print "$section:$test"; ?></h2>

        <h3>example</h3>

        <div id="dialog"></div>

        <pre id="source"></pre>

<?php
        readfile(__DIR__ . '/../test/' . $section . '/' . $test . '.html');
?>
        
        <script type="text/javascript">
        (function() {
            var source  = oui.$('#source').get(0);
            var example = oui.$('#example').get(0);

            oui.$(document).ready(function() {
                if ('outerHTML' in source) {
                    source.outerHTML = '<pre id="source">' + example.text.replace(/^\n*/, '').replace(/\n*$/, '') + '</pre>';
                } else {
                    source.innerHTML = example.text.replace(/^\n*/, '').replace(/\n*$/, '');
                }
            });
        })();
        </script>
<?php
} else {
?>
        <p>
            &gt; overview
        </p>
        
<?php
    $sections = glob(__DIR__ . '/../test/*', GLOB_ONLYDIR);

    foreach ($sections as $section) {
        $section_name = basename($section);
?>
        <div class="box">
            <h2><?php print $section_name; ?></h2>
            <ul>
<?php
        $tests = glob($section . '/*.html');

        foreach ($tests as $test) {
            $test_name = basename($test, '.html');
?>
                <li><a href="/?doc=<?php print "$section_name:$test_name"; ?>"><?php print $test_name; ?></a></li>
<?php
        }
?>
            </ul>
        </div>
<?php
    }
}
?>
    </body>
</html>