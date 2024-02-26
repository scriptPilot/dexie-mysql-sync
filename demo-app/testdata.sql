INSERT IGNORE INTO `users` (`id`, `username`, `password`)
VALUES (1, "root", "cm9vdA==");

INSERT IGNORE INTO `tasks` (`id`, `title`, `done`)
VALUES
  ('54d6831a-215d-40d3-b1e5-98edd4cfd4a9', "First Task", 1),
  ('9e4147a7-73ce-4418-847f-7b11b2f2097f', "Second Task", 0),
  ('a4a34e16-ffde-493d-ad4d-67e079d8c5a4', "Third Task", 1);