<?php

// Dependencies
use Tqdev\PhpCrudApi\Api;
use Tqdev\PhpCrudApi\Config\Config;
use Tqdev\PhpCrudApi\RequestFactory;
use Tqdev\PhpCrudApi\ResponseUtils;
require('vendor/autoload.php');

// Credentials
@include('credentials.php');
@define('MYSQL_HOST', 'mysql');
@define('MYSQL_DATABASE', 'development');
@define('MYSQL_USERNAME', 'root');
@define('MYSQL_PASSWORD', 'root');

// User ID
session_start();
define('USERID', isset($_SESSION['user']['id']) ? $_SESSION['user']['id'] : 0);

// Configuration
$config = new Config([

    // Debug Mode
    'debug' => MYSQL_DATABASE === 'development',

    // Database Credentials
    'address' => MYSQL_HOST,
    'database' => MYSQL_DATABASE,
    'username' => MYSQL_USERNAME,
    'password' => MYSQL_PASSWORD,

    // Database Authentication
    'middlewares' => 'dbAuth,authorization',
    'dbAuth.mode' => 'optional',
    'dbAuth.registerUser' => '1',
    'authorization.tableHandler' => function ($operation, $tableName) {    
        if ($tableName === 'users') return false;
        return true;
    },
    'authorization.recordHandler' => function ($operation, $tableName) { 
      if ($operation !== 'create' && ($tableName === 'tasks' || $tableName === 'files')) {
        return 'filter=userId,eq,' . USERID;
      }
      return '';
    }
    
]);

// Initialization
$request = RequestFactory::fromGlobals();
$api = new Api($config);
$response = $api->handle($request);
ResponseUtils::output($response);