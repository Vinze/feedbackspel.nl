CREATE TABLE IF NOT EXISTS `users` (
	`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`firstname` varchar(255) NOT NULL,
	`lastname` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

