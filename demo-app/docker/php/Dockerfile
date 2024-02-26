# Use Apache PHP as base image
FROM php:8.2-apache

# Install MySQLi (for MySQL support)
RUN docker-php-ext-install mysqli

# Install PDO MySQL (for the PHP CRUD API)
RUN docker-php-ext-install pdo
RUN docker-php-ext-install pdo_mysql