#!/usr/bin/env php
<?php

/*
 * Build-script for documentation
 */

$dir  = __DIR__;
$deps = array();

// process dependency file
if (($fp = fopen("$dir/../../etc/depend.yml", 'r'))) {
    $prefix = '';
    $key    = '';

    while (!feof($fp)) {
        $row = trim(fgets($fp, 4096));

        if ($row == 'default:') {
            $key = 'default';

            continue;
        } elseif ($row == 'widgets:') {
            $prefix = 'widget.';

            continue;
        } elseif (preg_match('/([a-z]+):/', $row, $match)) {
            $key = $prefix . $match[1];

            continue;
        } elseif (substr($row, 0, 1) != '-' || $key == '') {
            continue;
        }
        
        if (!isset($deps[$key])) {
            $deps[$key] = array();
        }

        $deps[$key][] = substr($row, 2);
    }

    fclose($fp);
}

print_r($deps);

// cleanup documentation destination directory
`rm -rf $dir/dst/*`;

// process documentation sources
function build($fp, $ch, $type) {
    global $deps;

    $done = array();

    $cb = function($type) use ($deps, $fp, $ch, &$done, &$cb) {
        if (!isset($deps[$type])) {
            return;
        }

        foreach ($deps[$type] as $file) {
            if (preg_match('|^styles/|', $file)) {
                fputs($fp, "        <link rel=\"stylesheet\" type=\"text/css\" href=\"$ch$file\" />\n");
            } elseif (preg_match('|^libsjs/|', $file)) {
                fputs($fp, "        <script type=\"text/javascript\" src=\"$ch$file\"></script>\n");
            }
        }
    };

    $cb($type);
}

$descriptors = array(
    array('pipe', 'r'),
    array('pipe', 'w'),
    array('file', '/dev/null', 'w')
);

$cmd = "find src/* -type f -name \"*.html\"";

$pipes = array();

$fh = proc_open($cmd, $descriptors, $pipes, $dir);

if (is_resource($fh)) {
    fclose($pipes[0]);

    while (($name = trim(fgets($pipes[1])))) {
        $dst = preg_replace('|^src/|', 'dst/', $name);
        $ch  = str_repeat('../', substr_count($name, '/') + 2);

        mkdir(dirname($dst), 0777, true);

        if (!($fp = fopen($dst, 'w'))) {
            continue;
        }

        fputs($fp, "<html>\n");
        fputs($fp, "    <head>\n");

        build($fp, $ch, 'default');
        build($fp, $ch, 'widget.' . basename($name, '.html'));

        fputs($fp, "    </head>\n");
        fputs($fp, "    <body>\n");

        fputs($fp, file_get_contents($dir . '/' . $name));

        fputs($fp, "    </body>\n");
        fputs($fp, "</html>\n");

        fclose($fp);
    }

    print "done\n";

    fclose($pipes[1]);

    proc_close($fh);
}

