CREATE TABLE `demo_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`demo_id` text NOT NULL,
	`completion_percent` integer DEFAULT 100 NOT NULL,
	`completed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `demo_progress_user_demo_uq` ON `demo_progress` (`user_id`,`demo_id`);--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified_at` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verification_token_hash` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verification_expires_at` text;--> statement-breakpoint
UPDATE `users` SET `email_verified` = true, `email_verified_at` = CURRENT_TIMESTAMP WHERE `registration_completed` = true;
