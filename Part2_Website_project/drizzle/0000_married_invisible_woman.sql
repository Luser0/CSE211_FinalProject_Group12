CREATE TABLE `event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`slug` text NOT NULL,
	`date` integer NOT NULL,
	`categoryId` integer NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `event_category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_slug_unique` ON `event` (`slug`);--> statement-breakpoint
CREATE TABLE `event_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`eventId` integer NOT NULL,
	`url` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action
);
