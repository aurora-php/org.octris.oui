#!/usr/bin/env bash

#
# Build script for html documentation.
#

set -e

cd `dirname $0`

rm -rf dst/*

for src in `find src/* -type f -name "*.html"`; do
    dst=${src/#src/dst}
    dir=`dirname $dst`

    upd=${src//[^\/]/}
    upd=${upd//\//..\/}
    
    type=`basename $src .html`
    
    incl=false

    mkdir -p $dir

    echo "<html>" >> $dst
    echo "    <head>" >> $dst

    while read row; do
        if [[ "$row" =~ [a-z0-9]{1,}: ]]; then
            if [ "$row" = "default:" ]; then
                incl=true

                continue
            elif [ "$row" = "$type:" ]; then
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
            elif [[ "$row" = styles/* ]]; then
                echo "        <link rel=\"stylesheet\" type=\"text/css\" href=\"../../$upd$row\" />" >> $dst
            fi
        fi
    done < ../../etc/depend.yml

    echo "    </head>" >> $dst
    echo "    <body>" >> $dst
    echo "        <div id=\"dialog\"></div>" >> $dst

    cat $src >> $dst

    echo "    </body>" >> $dst
    echo "</html>" >> $dst
done

