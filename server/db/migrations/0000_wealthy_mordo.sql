CREATE TABLE `anime` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mal_id` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`title_en` varchar(500),
	`title_jp` varchar(500),
	`synopsis` text,
	`main_picture` json,
	`media_type` varchar(50),
	`status` varchar(50),
	`genres` json,
	`studios` json,
	`start_date` varchar(20),
	`end_date` varchar(20),
	`mean` decimal(4,2),
	`popularity` int,
	`rank` int,
	`related_anime` json,
	`synced_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `anime_id` PRIMARY KEY(`id`),
	CONSTRAINT `anime_mal_id_unique` UNIQUE(`mal_id`)
);
--> statement-breakpoint
CREATE TABLE `article_anime` (
	`id` int AUTO_INCREMENT NOT NULL,
	`article_id` int NOT NULL,
	`anime_id` int NOT NULL,
	CONSTRAINT `article_anime_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `article_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `article_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `article_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `article_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`article_id` int NOT NULL,
	`tag` varchar(100) NOT NULL,
	CONSTRAINT `article_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`category_id` int,
	`title` varchar(500) NOT NULL,
	`slug` varchar(600) NOT NULL,
	`excerpt` text,
	`body` longtext,
	`cover_image` varchar(500),
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`bookmarkable_type` varchar(50) NOT NULL,
	`bookmarkable_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_bookmark` UNIQUE(`user_id`,`bookmarkable_type`,`bookmarkable_id`)
);
--> statement-breakpoint
CREATE TABLE `comment_reactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`comment_id` int NOT NULL,
	`user_id` int NOT NULL,
	`reaction_type` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comment_reactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_reaction` UNIQUE(`comment_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`commentable_type` varchar(50) NOT NULL,
	`commentable_id` int NOT NULL,
	`parent_id` int,
	`body` text NOT NULL,
	`status` enum('visible','hidden','deleted') NOT NULL DEFAULT 'visible',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `forum_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `forum_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`thread_id` int NOT NULL,
	`user_id` int NOT NULL,
	`body` text NOT NULL,
	`is_first_post` boolean NOT NULL DEFAULT false,
	`upvote_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forum_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_thread_anime` (
	`id` int AUTO_INCREMENT NOT NULL,
	`thread_id` int NOT NULL,
	`anime_id` int NOT NULL,
	CONSTRAINT `forum_thread_anime_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_threads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`forum_category_id` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(600) NOT NULL,
	`is_pinned` boolean NOT NULL DEFAULT false,
	`is_locked` boolean NOT NULL DEFAULT false,
	`view_count` int NOT NULL DEFAULT 0,
	`reply_count` int NOT NULL DEFAULT 0,
	`last_activity_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_threads_id` PRIMARY KEY(`id`),
	CONSTRAINT `forum_threads_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `manga` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mal_id` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`title_en` varchar(500),
	`title_jp` varchar(500),
	`synopsis` text,
	`main_picture` json,
	`media_type` varchar(50),
	`status` varchar(50),
	`genres` json,
	`authors` json,
	`start_date` varchar(20),
	`end_date` varchar(20),
	`mean` decimal(4,2),
	`popularity` int,
	`rank` int,
	`synced_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `manga_id` PRIMARY KEY(`id`),
	CONSTRAINT `manga_mal_id_unique` UNIQUE(`mal_id`)
);
--> statement-breakpoint
CREATE TABLE `moderation_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moderator_id` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`target_type` varchar(50) NOT NULL,
	`target_id` int NOT NULL,
	`reason` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moderation_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`data` json,
	`read_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`display_name` varchar(100),
	`avatar_url` varchar(500),
	`bio` text,
	`social_links` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporter_id` int NOT NULL,
	`reportable_type` varchar(50) NOT NULL,
	`reportable_id` int NOT NULL,
	`reason` text NOT NULL,
	`status` enum('pending','reviewed','dismissed') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_anime` (
	`id` int AUTO_INCREMENT NOT NULL,
	`review_id` int NOT NULL,
	`anime_id` int NOT NULL,
	CONSTRAINT `review_anime_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(600) NOT NULL,
	`excerpt` text,
	`body` longtext,
	`rating` tinyint NOT NULL,
	`spoiler_flag` boolean NOT NULL DEFAULT false,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`helpful_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `reviews_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('guest','member','moderator','admin') NOT NULL DEFAULT 'member',
	`avatar` varchar(500),
	`bio` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `article_anime` ADD CONSTRAINT `article_anime_article_id_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `article_anime` ADD CONSTRAINT `article_anime_anime_id_anime_id_fk` FOREIGN KEY (`anime_id`) REFERENCES `anime`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_article_id_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_category_id_article_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `article_categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment_reactions` ADD CONSTRAINT `comment_reactions_comment_id_comments_id_fk` FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment_reactions` ADD CONSTRAINT `comment_reactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts` ADD CONSTRAINT `forum_posts_thread_id_forum_threads_id_fk` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts` ADD CONSTRAINT `forum_posts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_thread_anime` ADD CONSTRAINT `forum_thread_anime_thread_id_forum_threads_id_fk` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_thread_anime` ADD CONSTRAINT `forum_thread_anime_anime_id_anime_id_fk` FOREIGN KEY (`anime_id`) REFERENCES `anime`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_threads` ADD CONSTRAINT `forum_threads_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_threads` ADD CONSTRAINT `forum_threads_forum_category_id_forum_categories_id_fk` FOREIGN KEY (`forum_category_id`) REFERENCES `forum_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moderation_logs` ADD CONSTRAINT `moderation_logs_moderator_id_users_id_fk` FOREIGN KEY (`moderator_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporter_id_users_id_fk` FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review_anime` ADD CONSTRAINT `review_anime_review_id_reviews_id_fk` FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review_anime` ADD CONSTRAINT `review_anime_anime_id_anime_id_fk` FOREIGN KEY (`anime_id`) REFERENCES `anime`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;