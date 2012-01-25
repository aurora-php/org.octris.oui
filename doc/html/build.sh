#!/usr/bin/env bash

#
# Build script for html documentation.
#

set -e

cd `dirname $0`

rm -rf dst/*

_done=""

function include {
    local typ=$1
    local dst=$2
    local upd=$3

    local incl=false

    _done="$_done,$typ,"

    echo -n "."

    while read row; do
        if [[ "$row" =~ [a-z0-9]{1,}: ]]; then
            if [ "$row" = "$typ:" ]; then
                incl=true

                continue
            else
                incl=false
            fi
        fi

        if [ $incl = true ]; then
            row=${row/#- /}

            if [[ "$row" = libsjs/* ]]; then
                echo "        <script type=\"text/javascript\" src=\"../../$upd$row\"></script>" >> $dst

                _typ=`basename $row .js`

                if [[ "$_done" != *,$_typ,* ]]; then
                    include $_typ $dst $upd
                fi
            elif [[ "$row" = styles/* ]]; then
                echo "        <link rel=\"stylesheet\" type=\"text/css\" href=\"../../$upd$row\" />" >> $dst
            fi
        fi
    done < ../../etc/depend.yml
}

for src in `find src/* -type f -name "*.html"`; do
    dst=${src/#src/dst}
    dir=`dirname $dst`

    upd=${src//[^\/]/}
    upd=${upd//\//..\/}
    
    typ=`basename $src .html`
    
    _done=""

    mkdir -p $dir

    echo "<html>" >> $dst
    echo "    <head>" >> $dst

    include default $dst $upd
    include $typ $dst $upd

    echo "    </head>" >> $dst
    echo "    <body>" >> $dst
    echo "        <div id=\"dialog\"></div>" >> $dst

    cat $src >> $dst

    echo "    </body>" >> $dst
    echo "</html>" >> $dst
done

echo ""

