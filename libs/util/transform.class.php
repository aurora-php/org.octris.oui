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
     * Transform an OUI xml description file to javascript code.
     *
     * @octdoc      c:util/transform
     * @copyright   copyright (c) 2012 by Harald Lapp     
     * @author      Harald Lapp <harald@octris.org>
     */
    class transform
    /**/
    {
        /**
         * Constructor.
         *
         * @octdoc  m:transform/__construct
         */
        protected function __construct()
        /**/
        {
        }

        /**
         * Execute 
         *
         * @octdoc  m:transform/build
         * @param   string      
         */
        public static function exec($file)
        /**/
        {
            $path = \org\octris\core\app::getPath(\org\octris\core\app::T_PATH_ETC);

            // resolve includes
            $xml = new DOMDocument(); 
            $xml->loadXML($file, LIBXML_NOBLANKS); 
            $xml->ownerDocument->xinclude();

            // validation
            $schema = $path . '/oui.dtd';

            // if (!$xml->ownerDocument->schemaValidate($schema)) {
            //     // invalid config file
            // }

            // transform
            $xsl  = new DOMDocument(); 
            $xsl->load($path . '/oui.xsl', LIBXML_NOCDATA); 
            
            $proc = new XSLTProcessor();             
            $proc->registerPHPFunctions();
            $proc->importStylesheet($xsl); 
            
            return $proc->transformToXML($xml);
        }
    }
}
