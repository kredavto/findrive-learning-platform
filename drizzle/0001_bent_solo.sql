ALTER TABLE `users` ADD `first_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `users` ADD `contact_email` text;--> statement-breakpoint
ALTER TABLE `users` ADD `registration_completed` integer DEFAULT false NOT NULL;