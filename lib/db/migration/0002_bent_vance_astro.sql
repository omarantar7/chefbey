ALTER TABLE `contents` ADD `language` text NOT NULL;--> statement-breakpoint
ALTER TABLE `contents` ADD `title` text NOT NULL;--> statement-breakpoint
ALTER TABLE `contents` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `contents` DROP COLUMN `type`;