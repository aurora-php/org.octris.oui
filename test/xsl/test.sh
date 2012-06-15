#!/usr/bin/env bash

xmllint --noblanks ../../doc/oui.xml | xsltproc ../../etc/oui.xsl - | php -r "require_once(__DIR__ . '/../../libs/vendor/jsbeautifier.class.php'); \$js = file_get_contents('php://stdin'); \$opts = new BeautifierOptions(); \$opts->indent_size = 4; print js_beautify(\$js, \$opts);"

echo ""

