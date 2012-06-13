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
     * Dependency resolver.
     *
     * @octdoc      c:util/depend
     * @copyright   copyright (c) 2012 by Harald Lapp     
     * @author      Harald Lapp <harald@octris.org>
     */
    class depend 
    /**/
    {
        /**
         * Contents of dependencies configuration file.
         *
         * @octdoc  p:depend/$depend
         * @var     array
         */
        protected static $depend = null;
        /**/

        /**
         * Files depending on.
         *
         * @octdoc  p:depend/$files
         * @var     array
         */
        protected $files = array(
            'js'  => array(),
            'css' => array()
        );
        /**/

        /**
         * Constructor.
         *
         * @octdoc  m:depend/__construct
         * @param   array           $dependencies           Dependencies.
         */
        protected function __construct(array $dependencies)
        /**/
        {
            foreach ($dependencies as $file) {
                $ext = pathinfo($file, PATHINFO_EXTENSION);

                $this->files[$ext][] = $file;
            }
        }

        /**
         * Load and prepare dependencies file.
         *
         * @octdoc  m:depend/load
         * @return  array                                   Loaded dependency configuration.
         */
        protected static function load()
        /**/
        {
            $data = json_decode(file_get_contents(
                __DIR__ . '/../../etc/depend.json'
            ), true);

            if (is_null($data)) {
                $code = json_last_error();

                switch ($code) {
                case JSON_ERROR_NONE:
                    $msg = 'no errors';
                    break;
                case JSON_ERROR_DEPTH:
                    $msg = 'maximum stack depth exceeded';
                    break;
                case JSON_ERROR_STATE_MISMATCH:
                    $msg = 'underflow or the modes mismatch';
                    break;
                case JSON_ERROR_CTRL_CHAR:
                    $msg = 'unexpected control character found';
                    break;
                case JSON_ERROR_SYNTAX:
                    $msg = 'syntax error, malformed JSON';
                    break;
                case JSON_ERROR_UTF8:
                    $msg = 'malformed UTF-8 characters, possibly incorrectly encoded';
                    break;
                default:
                    $msg = 'unknown error';
                    break;
                }

                throw new \Exception($msg, $code);
            }

            return $data;
        }

        /**
         * Get a list of all available components.
         *
         * @octdoc  m:depend/getComponents
         * @return  array                                   Component names.
         */
        public static function getComponents()
        /**/
        {
            if (is_null(self::$depend)) {
                self::$depend = self::load();
            }

            return (isset(self::$depend['components'])
                    ? array_keys(self::$depend['components'])
                    : array());
        }

        /**
         * Get a list of all available components.
         *
         * @octdoc  m:depend/getComponents
         * @param   array           $components             Optional component names to resolve dependencies for.
         * @return  array                                   Dependencies.
         */
        public static function getDependencies(array $components = array())
        /**/
        {
            if (is_null(self::$depend)) {
                self::$depend = self::load();
            }

            if (count($components) == 0) {
                $components = $this->getComponents();
            }

            $result = self::$depend['default'];
            $solved = array();

            $resolve = function($component, $deps) use (&$result, &$solved, &$resolve) {
                $solved[$component] = true;

                foreach ($deps as $d) {
                    if (ctype_alnum($d)) {
                        // reference to other dependency
                        if (!isset($solved[$d]) && isset(self::$depend['components'][$d]) && is_array(self::$depend['components'][$d])) {
                            $resolve($d, self::$depend['components'][$d]);
                        }
                    } else {
                        $result[] = $d;
                    }
                }
            };

            foreach ($components as $component) {
                if (isset($solved[$component])) continue;

                if (isset(self::$depend['components'][$component]) && is_array(self::$depend['components'][$component])) {
                    $resolve($component, self::$depend['components'][$component]);
                }
            }

            return new static($result);
        }

        /**
         * Get javascript specific dependencies.
         *
         * @octdoc  m:depend/getJsDeps
         */
        public function getJsDeps()
        /**/
        {
            return $this->files['js'];
        }

        /**
         * Get css specific dependencies.
         *
         * @octdoc  m:depend/getCssDeps
         */
        public function getCssDeps()
        /**/
        {
            return $this->files['css'];
        }
    }
}
