CREATE TABLE `articles` (
	`id` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`category` varchar(100),
	`author` varchar(100) DEFAULT 'Sofia Yan',
	`coverImageUrl` text,
	`coverImageKey` varchar(255),
	`latitude` decimal(10,6),
	`longitude` decimal(10,6),
	`gpxFileUrl` text,
	`gpxFileKey` varchar(255),
	`publishedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fileUploads` (
	`id` varchar(64) NOT NULL,
	`filename` varchar(255) NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`mimeType` varchar(100),
	`fileType` enum('image','gpx','other') NOT NULL,
	`uploadedBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `fileUploads_id` PRIMARY KEY(`id`)
);
