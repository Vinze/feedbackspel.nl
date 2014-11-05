CREATE TABLE IF NOT EXISTS `sessions` (
	`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`content` text NOT NULL,
	`expires` int(11) NOT NULL
	`created_at` datetime DEFAULT NULL,
	`updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
