#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

xmllint --noblanks $DIR/../../doc/oui.xml | xsltproc $DIR/../../etc/oui.xsl - | php -r "require_once('$DIR/../../libs/vendor/jsbeautifier.class.php'); \$js = file_get_contents('php://stdin'); \$opts = new BeautifierOptions(); \$opts->indent_size = 4; print js_beautify(\$js, \$opts);"
