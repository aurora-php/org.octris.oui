<?php

/*
 * This file is part of the 'org.octris.oui' package.
 *
 * (c) Harald Lapp <harald@octris.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace org\octris\oui {
    /**
     * Helper class for creating and setting up template engine for
     * code-generator.
     *
     * @octdoc      c:libs/tpl
     * @copyright   copyright (c) 2014 by Harald Lapp
     * @author      Harald Lapp <harald@octris.org>
     */
    class tpl
    /**/
    {
        /**
         * Create, setup and return instance of template engine to use
         * for code-generator.
         *
         * @octdoc  m:tpl/getTemplate
         */
        public static function getTemplate()
        /**/
        {
            $path_cache = \org\octris\core\app::getPath(\org\octris\core\app::T_PATH_CACHE, 'org.octris.oui');
            $path_host  = \org\octris\core\app::getPath(\org\octris\core\app::T_PATH_HOST);
            $path_work  = \org\octris\core\app::getPath(\org\octris\core\app::T_PATH_WORK);
            $path_tpl   = \org\octris\core\app::getPath(\org\octris\core\app::T_PATH_WORK_TPL, 'org.octris.oui');

            $tpl = new \org\octris\core\tpl();

            $tpl->setL10n(\org\octris\core\l10n::getInstance());
            $tpl->setOutputPath('tpl', $path_cache . '/templates_c/');
            $tpl->setOutputPath('css', $path_host . '/styles/');
            $tpl->setOutputPath('js',  $path_host . '/libsjs/');
            $tpl->setResourcePath('css', $path_work);
            $tpl->setResourcePath('js',  $path_work);
            $tpl->addSearchPath($path_tpl);
            
            return $tpl;
        }    
    }
}
