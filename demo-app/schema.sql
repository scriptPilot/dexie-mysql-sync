CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER(4) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `tasks` (

  -- Required columns
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `$updated` BIGINT(14) NOT NULL DEFAULT 0,
  `$deleted` TINYINT(1) NOT NULL DEFAULT 0,
  `$synchronized` BIGINT(14) NOT NULL DEFAULT 0,

  -- Optional columns
  `title` VARCHAR(255) NOT NULL,
  `done` TINYINT(1) NOT NULL DEFAULT 0

);