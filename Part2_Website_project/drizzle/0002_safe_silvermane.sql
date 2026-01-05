CREATE TABLE `attendee` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phonenumber` text NOT NULL,
	`eventId` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attendee_email_unique` ON `attendee` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `attendee_phonenumber_unique` ON `attendee` (`phonenumber`);