# Use MariaDB as base image
FROM mariadb:10.4

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=development

# Copy schema and testdata files
COPY ./schema.sql /docker-entrypoint-initdb.d/
COPY ./testdata.sql /docker-entrypoint-initdb.d/