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

require_once(__DIR__ . '/libs/phphttpd.inc.php');

// main
$dependencies = array('editor');

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

        $dependencies[] = $test;
    }
}

require_once(__DIR__ . '/../libs/util/depend.class.php');
require_once(__DIR__ . '/../libs/util/doc.class.php');

$depend = \org\octris\oui\util\depend::getDependencies($dependencies);

?>
<?xml version="1.0" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>OUI -- Octris User Interfaces</title>
        <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<?php
foreach ($depend->getCssDeps() as $file) {
    printf("        <link rel=\"stylesheet\" type=\"text/css\" href=\"/?css=%s\" />\n", $file);
}
foreach ($depend->getJsDeps() as $file) {
    printf("        <script type=\"text/javascript\" src=\"/?js=%s\"></script>\n", $file);
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
        #editor {
            border:           1px dotted #aaa;
            padding:          5px;
        }
        #source {
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
        pre#example {
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
        table.args {
            background-color: #fff;
        }
        table.args thead tr {
            background-color: #ddd;
        }
        table.args thead tr th {
            text-align: left
        }
        table.args tbody tr {
            background-color: #eee;
        }
        </style>
    </head>
    
    <body>
        <h1>OUI &ndash; Octris User Interfaces</h1>
<?php
if (isset($doc)) {
?>
        <p>
            <a href="/">overview</a> &gt; <?php print "$section:$test"; ?>
        </p>

        <h2><?php print "$section:$test"; ?></h2>

        <h3>example</h3>

        <div id="dialog"></div>

        <br />

        <div id="editor">
            <div id="source"></div>

            <button id="exec">Run</button>
        </div>

<?php
        require(__DIR__ . '/../test/js/' . $section . '/' . $test . '.php');
?>
        
        <script type="text/javascript">
        var docserver = {
            'editor': null
        };

        (function() {
            var source  = oui.$('#source').get(0);
            var example = oui.$('#example').get(0);

            oui.$(document).ready(function() {
                docserver.editor = new CodeMirror(source, {
                    'value': example.text.replace(/^\n*/, '').replace(/\n*$/, ''),
                    'mode':  'javascript'
                });

                oui.$('#exec').on('click', function() {
                    var code = docserver.editor.getValue();

                    oui.$('#dialog').empty();

                    eval(code);
                });
            });
        })();
        </script>
<?php
    $args = \org\octris\oui\util\doc::getArguments($test);

    if (count($args) > 0) {
?>
    <h3>arguments</h3>
    
    <table width="100%" cellspacing="1" cellpadding="5" class="args">
        <thead>
            <tr>
                <th width="15%">type</th>
                <th width="15%">name</th>
                <th width="70%">description</th>
            </tr>
        </thead>
        <tbody>
<?php
    foreach ($args as $arg) {
?>
            <tr>
                <td valign="top"><?php print htmlspecialchars($arg['type']); ?></td>
                <td valign="top"><?php print htmlspecialchars($arg['name']); ?></td>
                <td valign="top"><?php print htmlspecialchars($arg['description']); ?></td>
            </tr>
<?php
    }
?>
        </tbody>
    </table>
<?php
    }
} else {
?>
        <p>
            overview
        </p>
        
<?php
    $sections = glob(__DIR__ . '/../test/js/*', GLOB_ONLYDIR);

    foreach ($sections as $section) {
        $section_name = basename($section);
?>
        <div class="box">
            <h2><?php print $section_name; ?></h2>
            <ul>
<?php
        $tests = glob($section . '/*.php');

        foreach ($tests as $test) {
            $test_name = basename($test, '.php');
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
