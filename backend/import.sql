CREATE TABLE `commentaires` (
  `id` int NOT NULL,
  `publication_id` int NOT NULL,
  `author_id` int NOT NULL,
  `content` text NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `like_publications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `publication_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `publications` (
  `id` int NOT NULL,
  `author_id` int NOT NULL,
  `content` text NOT NULL,
  `attachement` text,
  `post_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `users` (
  `id` int NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatarURL` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `password` text NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `avatarURL`, `password`, `isAdmin`) VALUES
(1, 'Administrateur', 'Groupomania', 'admin@groupomania.fr', NULL, '$2b$10$JJM0z/QoYoah5IUVzIjXwuQzxQkAgeSB1VA8dnk19z7.HI10lUx62', 0);

ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `like_publications`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `publications`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);
