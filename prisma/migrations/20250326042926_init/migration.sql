-- CreateTable
CREATE TABLE `album` (
    `album_art` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `album_id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`album_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `album_songs` (
    `song_id` INTEGER NOT NULL,
    `added_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `album_id` INTEGER NOT NULL,

    INDEX `song_id`(`song_id`),
    PRIMARY KEY (`album_id`, `song_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follows` (
    `follow_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id_a` INTEGER NOT NULL,
    `user_id_b` INTEGER NOT NULL,
    `follow_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id_a`(`user_id_a`),
    INDEX `user_id_b`(`user_id_b`),
    PRIMARY KEY (`follow_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `library` (
    `library_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `item_type` ENUM('song', 'album', 'playlist') NOT NULL,
    `created_id` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`library_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `like_id` INTEGER NOT NULL AUTO_INCREMENT,
    `listener_id` INTEGER NOT NULL,
    `song_id` INTEGER NOT NULL,
    `liked_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `listener_id`(`listener_id`),
    INDEX `song_id`(`song_id`),
    PRIMARY KEY (`like_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlist_songs` (
    `playlist_id` INTEGER NOT NULL,
    `song_id` INTEGER NOT NULL,
    `added_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `song_id`(`song_id`),
    PRIMARY KEY (`playlist_id`, `song_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlists` (
    `playlist_id` INTEGER NOT NULL AUTO_INCREMENT,
    `playlist_art` VARCHAR(255) NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_id` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` INTEGER NOT NULL,

    INDEX `created_id`(`created_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`playlist_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `songs` (
    `song_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `genre` VARCHAR(50) NULL,
    `duration` INTEGER NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_format` VARCHAR(50) NOT NULL,
    `uploaded_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `plays_count` INTEGER NULL DEFAULT 0,
    `user_id` INTEGER NOT NULL,
    `URL` VARCHAR(255) NULL,
    `album_id` INTEGER NULL,

    INDEX `user_id`(`user_id`),
    INDEX `album_id`(`album_id`),
    PRIMARY KEY (`song_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `streaming_history` (
    `stream_id` INTEGER NOT NULL AUTO_INCREMENT,
    `listener_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `song_id` INTEGER NOT NULL,
    `played_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `listener_id`(`listener_id`),
    INDEX `song_id`(`song_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`stream_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `pfp` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('listener', 'artist', 'admin') NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ratings` (
    `rating_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `rated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `rating` INTEGER NOT NULL,
    `song_id` INTEGER NOT NULL,

    INDEX `user_id`(`user_id`),
    INDEX `song_id`(`song_id`),
    PRIMARY KEY (`rating_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `album` ADD CONSTRAINT `album_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `album_songs` ADD CONSTRAINT `album_songs_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `album`(`album_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `album_songs` ADD CONSTRAINT `album_songs_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs`(`song_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`user_id_a`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`user_id_b`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `library` ADD CONSTRAINT `library_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`listener_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs`(`song_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `playlist_songs` ADD CONSTRAINT `playlist_songs_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`playlist_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `playlist_songs` ADD CONSTRAINT `playlist_songs_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs`(`song_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `playlists` ADD CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `playlists` ADD CONSTRAINT `playlists_ibfk_2` FOREIGN KEY (`created_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `songs` ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `songs` ADD CONSTRAINT `songs_ibfk_2` FOREIGN KEY (`album_id`) REFERENCES `album`(`album_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `streaming_history` ADD CONSTRAINT `streaming_history_ibfk_1` FOREIGN KEY (`listener_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `streaming_history` ADD CONSTRAINT `streaming_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `streaming_history` ADD CONSTRAINT `streaming_history_ibfk_3` FOREIGN KEY (`song_id`) REFERENCES `songs`(`song_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_song_id_fkey` FOREIGN KEY (`song_id`) REFERENCES `songs`(`song_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
