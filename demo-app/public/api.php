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

// Configuration
$config = new Config([

    // Debug Mode
    'debug' => MYSQL_DATABASE === 'development',

    // Database Credentials
    'address' => MYSQL_HOST,
    'database' => MYSQL_DATABASE,
    'username' => MYSQL_USERNAME,
    'password' => MYSQL_PASSWORD,

    // Middlewares
    'middlewares' => 'dbAuth,authorization,multiTenancy',

    // Database Authentication
    'dbAuth.mode' => 'optional',
    'dbAuth.registerUser' => '1',

    // Database Authorization
    'authorization.tableHandler' => function ($operation, $tableName) {    
        if ($tableName === 'users') return false;
        return true;
    },

    // Multi Tenancy
    'multiTenancy.handler' => function ($operation, $tableName) {
      return ['userId' => $_SESSION['user']['id'] ?? 0];
    },    

]);

// Initialization
$request = RequestFactory::fromGlobals();
$api = new Api($config);
$response = $api->handle($request);
ResponseUtils::output($response);