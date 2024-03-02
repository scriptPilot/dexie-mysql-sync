CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER(4) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tasks` (

  -- Required columns per table
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `$created` BIGINT(14) NOT NULL DEFAULT 0,
  `$updated` BIGINT(14) NOT NULL DEFAULT 0,
  `$deleted` INTEGER(1) NOT NULL DEFAULT 0,
  `$synchronized` BIGINT(14) NOT NULL DEFAULT 0,

  -- Optional customized columns per table
  `userId` INTEGER(4) NOT NULL DEFAULT 0,
  `title` VARCHAR(255) NOT NULL,
  `done` INTEGER(1) NOT NULL DEFAULT 0

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `files` (

  -- Required columns per table
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `$created` BIGINT(14) NOT NULL DEFAULT 0,
  `$updated` BIGINT(14) NOT NULL DEFAULT 0,
  `$deleted` INTEGER(1) NOT NULL DEFAULT 0,
  `$synchronized` BIGINT(14) NOT NULL DEFAULT 0,

  -- Optional customized columns per table
  `userId` INTEGER(4) NOT NULL DEFAULT 0,
  `name` VARCHAR(255) NOT NULL DEFAULT "",
  `type` VARCHAR(255) NOT NULL,
  `size` INTEGER(12) NOT NULL,
  `dataUrl` MEDIUMTEXT NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;