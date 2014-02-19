<?php

/*
 * This file is part of the 'org.octris.oui' package.
 *
 * (c) Harald Lapp <harald@octris.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace org\octris\oui\app {
    use \org\octris\core\validate as validate;
    use \org\octris\core\provider as provider;

    /**
     * OUI service page.
     *
     * @octdoc      c:app/service
     * @copyright   copyright (c) 2014 by Harald Lapp
     * @author      Harald Lapp <harald@octris.org>
     */
    class service extends \org\octris\core\app\web\page
    /**/
    {
        /**
         * Service status codes.
         *
         * @octdoc  d:service/T_...
         * @type    int
         */
        const T_SERVICE_UNKNOWN   = -1;
        const T_SERVICE_DENIED    = -2;     // disabled service
        const T_VALIDATION_FAILED = -3;     // parameter validation failed
        const T_ACCEPT_MISMATCH   = -4;     // send ACCEPT header doesn't match with required
        /**/
        
        /**
         * Registered services.
         *
         * @octdoc  p:service/$registry
         * @type    array
         */
        protected $registry = array();
        /**/
        
        /**
         * Mime-type for "Accept" header.
         * 
         * @octdoc  p:service/$accept
         * @type    array
         */
        protected $accept = array('text/json');
        /**/

        /**
         * Action used to call service delegator.
         * 
         * @octdoc  p:service/$service_action
         */
        protected $service_action = 'service';
        /**/

        /**
         * Service URL.
         * 
         * @octdoc  p:service/$service_url
         */
        protected $service_url = '/';
        /**/

        /**
         * Service signature to use as prefix for registering 
         * validation rulesets.
         *
         * @octdoc  p:service/$signature
         * @type    string
         */
        protected $signature = 'bd44a94f-247f-4504-a5f5-9785a491e2d5';
        /**/

        /**
         * Return value of service callback.
         *
         * @octdoc  p:service/$result
         * @type    mixed
         */
        protected $result = null;
        /**/

        /**
         * Constructor.
         *
         * @octdoc  m:service/__construct
         */
        public function __construct()
        /**/
        {
            parent::__construct();            
        }

        /**
         * Register a service.
         *
         * @octdoc  m:service/registerService
         * @param   string          $name           Name to register as service.
         * @param   callable        $callback       A callback to execute if the service is called.
         * @param   array           $parameters     Array of parameter names and the order they have to be pushed in function call.
         * @param   array           $ruleset        Optional ruleset for parameter validation.
         * @param   int             $method         Optional allowed method for delegation / parameter submitting.
         * @param   string|array    $accept         Optional mime-type(s) to overwrite default accept mime-type with.
         */
        public function registerService($name, callable $callback, array $parameters, array $ruleset = array(), $method = 'post', $accept = NULL)
        /**/
        {
            array_walk($parameters, function($p) {
                if (preg_match('/[^a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/', $p)) {
                    throw new \Exception(sprintf('Invalid parameter name "%s"', $p));
                }
            });
            
            if (count($ruleset) > 0) {
                $this->addValidator($method, $this->signature . '_' . $name, $ruleset);
            }
            
            $accept = (is_null($accept) ? $this->accept : $accept);
            $accept = (is_array($accept) ? $accept : array($accept));
            
            $this->registry[$name] = array(
                'name'       => $name,
                'callback'   => $callback,
                'parameters' => $parameters,
                'method'     => $method,
                'enabled'    => true,
                'accept'     => $accept
            );
        }
        
        /**
         * Disable a registered service.
         * 
         * @octdoc  m:service/disableService
         * @param   string          $name           Name of service to disable.
         */
        public function disableService($name)
        /**/
        {
            if (isset($this->reqistry[$name])) {
                $this->registry[$name]['enabled'] = false;
            }
        }

        /**
         * Enable a registered service.
         * 
         * @octdoc  m:service/disableService
         * @param   string          $name           Name of service to enable.
         */
        public function enableService($name)
        /**/
        {
            if (isset($this->reqistry[$name])) {
                $this->registry[$name]['enabled'] = true;
            }
        }

        /**
         * Export registered services as callable javascript functions.
         *
         * @octdoc  m:service/exportServices
         * @return  string                      Generated Javascript code.
         */
        public function exportServices()
        /**/
        {
            $tpl = \org\octris\oui\tpl::getTemplate();
            
            $services = array_values($this->registry);
            
            foreach ($services as &$service) {
                $service['data'] = sprintf(
                    '{"ACTION": "%s", "service": "%s"%s}',
                    $this->service_action,
                    $service['name'],
                    (count($service['parameters']) == 0
                        ? ''
                        : ', ' . implode(', ', array_map(function($p) { 
                              return '"' . $p . '": ' . $p;
                          }, $service['parameters']))) 
                );
            }
            
            $tpl->setValue('service_url', $this->service_url);
            $tpl->setValue('services', $services);
            
            return $tpl->fetch('oui.rpc.js');
        }
        
        /**
         * Get name of requested service.
         * 
         * @octdoc  m:service/getService
         * @return  string                      Name of requested service.
         */
        public function getService()
        /**/
        {
            static $service = '';
        
            if ($service == '') {
                $request = provider::access('request');

                if ($request->isExist('service') && $request->isValid('service', validate::T_PRINTABLE)) {
                    $service = $request->getValue('service', validate::T_PRINTABLE);
                }
            }
        
            return $service;
        }

        /**
         * Service delegator.
         * 
         * @octdoc  m:service/delegateService
         * @param   array           $options    Additional service options to request input parameters.
         * @return  int|bool                    Return code or true, if service call succeeded.
         */
        public function delegateService(array $options = null)
        /**/
        {
            // check for service parameter
            $service = $this->getService();
            
            if (!isset($this->registry[$service])) {
                return self::T_SERVICE_UNKNOWN;
            } elseif (!$this->registry[$service]['enabled']) {
                return self::T_SERVICE_DENIED;
            }
            
            // validate parameters
            $method  = \org\octris\core\app\web\request::getRequestMethod();
            $ruleset = $this->signature . '_' . $service;

            list($is_valid, $args, , ) = $this->applyValidator($method, $ruleset);
            
            if (!$is_valid) {
                return self::T_VALIDATION_FAILED;
            }

            // check accept header
            $server = provider::access('server');
            
            if ($request->isExist('HTTP_ACCEPT') && $request->isValid('HTTP_ACCEPT', validate::T_PRINTABLE)) {
                $accept = $request->getValue('HTTP_ACCEPT', validate::T_PRINTABLE);
                
                if (!in_array($accept, $this->registry[$service]['accept'])) {
                    return self::T_ACCEPT_MISMATCH;
                }
            } else {
                return self::T_ACCEPT_MISMATCH;
            }

            // execute service
            $this->result = call_user_func_array($this->registry[$service]['callback'], $args);
        
            return true;
        }
        
        /**
         * Implements prepare method.
         *
         * @octdoc  m:service/prepare
         * @param   \org\octris\core\app\page       $last_page      Instance of last called page.
         * @param   string                          $action         Action that led to current page.
         */
        public function prepare(\org\octris\core\app\page $last_page, $action)
        /**/
        {
        }

        /**
         * Implements render method.
         * 
         * @octdoc  m:service/render
         */
        public function render()
        /**/
        {
        }
    }
}
