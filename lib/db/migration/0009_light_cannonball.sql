CREATE TABLE `seo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_local_id` integer NOT NULL,
	`title` text,
	`description` text,
	`keywords` text,
	`og_title` text,
	`og_description` text,
	`og_image` text,
	`twitter_title` text,
	`twitter_description` text,
	`twitter_image` text,
	`canonical_url` text,
	`robots` text DEFAULT 'index, follow',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`content_local_id`) REFERENCES `ContentLocal`(`id`) ON UPDATE no action ON DELETE cascade
);
