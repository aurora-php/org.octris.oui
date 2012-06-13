<?php

/*
 * This file is part of the 'org.octris.oui' package.
 *
 * (c) Harald Lapp <harald@octris.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace org\octris\oui\util {
    /**
     * Build javascript files from an OUI xml description file.
     *
     * @octdoc      c:util/ouibuilder
     * @copyright   copyright (c) 2012 by Harald Lapp     
     * @author      Harald Lapp <harald@octris.org>
     */
    class ouibuilder
    /**/
    {
        /**
         * Constructor.
         *
         * @octdoc  m:ouibuilder/__construct
         */
        public function __construct()
        /**/
        {
        }

        /**
         * Build javascript code from specified OUI xml description.
         *
         * @octdoc  m:ouibuilder/build
         */
        public function build($file)
        /**/
        {
            $xml = new \SimpleXMLElement($file, 0, true); 

            // resolve includes
            $dom = dom_import_simplexml($xml);
            $dom->ownerDocument->xinclude();

            // validation
            $schema = \org\octris\core\app::getPath(\org\octris\core\app::T_PATH_ETC) . '/oui.dtd';

            // if (!$dom->ownerDocument->schemaValidate($schema)) {
            //     // invalid config file
            // }

            $ui      = array();
            $builder = function(\SimpleXMLElement $node, array $ui) {
                if (count($node->children()) > 0) {

                }
            };

            $builder($xml, $ui);
        }
    }
}
