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
     * Documentation utils.
     *
     * @octdoc      c:util/doc
     * @copyright   copyright (c) 2012 by Harald Lapp     
     * @author      Harald Lapp <harald@octris.org>
     */
    class doc 
    /**/
    {
        /**
         * Constructor.
         *
         * @octdoc  m:doc/__construct
         */
        protected function __construct()
        /**/
        {
        }

        /**
         * Load and prepare dependencies file.
         *
         * @octdoc  m:doc/load
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
         * Return a list of arguments of a widget definition.
         *
         * @octdoc  m:doc/getComponents
         * @param   string          $component              Name of component to lookup.
         * @return  array                                   Arguments.
         */
        public static function getArguments($component)
        /**/
        {
            $deps   = self::load();
            $return = array();

            if (isset($deps['components'][$component])) {
                $file = false;
                
                foreach ($deps['components'][$component] as $dep) {
                    if (basename($dep, '.js') == $component) {
                        $file = $dep;
                        break;
                    }
                }
                
                if ($file !== false && ($fp = fopen(__DIR__ . '/../../' . $file, 'r'))) {
                    $block = false;
                    $no    = -1;
                    
                    while (!feof($fp)) {
                        $row = trim(fgets($fp, 4096));
                        
                        if (preg_match('/@octdoc\s+' . $component . '\/attach/', $row)) {
                            $block = true;
                            continue;
                        } elseif (!$block) {
                            continue;
                        } elseif (substr($row, 0, 1) != '*' || substr($row, 0, 2) == '*/') {
                            $block = false;
                            continue;
                        }
                        
                        if (preg_match('/@param_def\s+(?P<type>[^\s]+)\s+(?P<name>[^\s]+)\s+(?P<description>.*)/', $row, $match)) {
                            $return[++$no] = array(
                                'type'        => $match['type'],
                                'name'        => $match['name'],
                                'description' => trim($match['description'])
                            );
                        } elseif (isset($return[$no])) {
                            $return[$no]['description'] .= ' ' . $row;
                        }
                    }
                    
                    fclose($fp);
                }
            }

            return $return;
        }
    }
}
