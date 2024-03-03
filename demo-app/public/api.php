<?php

// Import dependencies
use Tqdev\PhpCrudApi\Api;
use Tqdev\PhpCrudApi\Config\Config;
use Tqdev\PhpCrudApi\RequestFactory;
use Tqdev\PhpCrudApi\ResponseUtils;
require('vendor/autoload.php');

// Import and define credentials
@include('credentials.php');
@define('MYSQL_HOST', 'mysql');
@define('MYSQL_DATABASE', 'development');
@define('MYSQL_USERNAME', 'root');
@define('MYSQL_PASSWORD', 'root');

// Configuration
$config = new Config([

    // Debug mode
    'debug' => MYSQL_DATABASE === 'development',

    // Credentials
    'address' => MYSQL_HOST,
    'database' => MYSQL_DATABASE,
    'username' => MYSQL_USERNAME,
    'password' => MYSQL_PASSWORD,

    // Middlewares
    'middlewares' => 'dbAuth,authorization,multiTenancy',

    // Database authentication
    'dbAuth.mode' => 'optional',
    'dbAuth.registerUser' => '1',
    'dbAuth.passwordLength' => '3',

    // Database Authorization
    'authorization.tableHandler' => function ($operation, $tableName) {    

        // No access to the users table
        if ($tableName === 'users') return false;

        // Access to all other tables
        return true;

    },

    // Multi Tenancy
    'multiTenancy.handler' => function ($operation, $tableName) {

      // For all tables, limit access to the current user
      return ['userId' => $_SESSION['user']['id'] ?? 0];

    },    

]);

// Initialization
$request = RequestFactory::fromGlobals();
$api = new Api($config);
$response = $api->handle($request);
ResponseUtils::output($response);