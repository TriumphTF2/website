-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `sb_admins` (
	`aid` int(6) AUTO_INCREMENT NOT NULL,
	`user` varchar(64) NOT NULL,
	`authid` varchar(64) NOT NULL DEFAULT '''',
	`password` varchar(128) NOT NULL,
	`gid` int(6) NOT NULL,
	`email` varchar(128) NOT NULL,
	`validate` varchar(128) DEFAULT 'NULL',
	`extraflags` int(10) NOT NULL,
	`immunity` int(10) NOT NULL DEFAULT 0,
	`srv_group` varchar(128) DEFAULT 'NULL',
	`srv_flags` varchar(64) DEFAULT 'NULL',
	`srv_password` varchar(128) DEFAULT 'NULL',
	`lastvisit` int(11) DEFAULT 'NULL',
	CONSTRAINT `user` UNIQUE(`user`)
);
--> statement-breakpoint
CREATE TABLE `sb_admins_servers_groups` (
	`admin_id` int(10) NOT NULL,
	`group_id` int(10) NOT NULL,
	`srv_group_id` int(10) NOT NULL,
	`server_id` int(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sb_banlog` (
	`sid` int(6) NOT NULL,
	`time` int(11) NOT NULL,
	`name` varchar(128) NOT NULL,
	`bid` int(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sb_bans` (
	`bid` int(6) AUTO_INCREMENT NOT NULL,
	`ip` varchar(32) DEFAULT 'NULL',
	`authid` varchar(64) NOT NULL DEFAULT '''',
	`name` varchar(128) NOT NULL DEFAULT ''unnamed'',
	`created` int(11) NOT NULL DEFAULT 0,
	`ends` int(11) NOT NULL DEFAULT 0,
	`length` int(10) NOT NULL DEFAULT 0,
	`reason` text NOT NULL,
	`aid` int(6) NOT NULL DEFAULT 0,
	`adminIp` varchar(32) NOT NULL DEFAULT '''',
	`sid` int(6) NOT NULL DEFAULT 0,
	`country` varchar(4) DEFAULT 'NULL',
	`RemovedBy` int(8) DEFAULT 'NULL',
	`RemoveType` varchar(3) DEFAULT 'NULL',
	`RemovedOn` int(10) DEFAULT 'NULL',
	`type` tinyint NOT NULL DEFAULT 0,
	`ureason` text DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `sb_comments` (
	`cid` int(6) AUTO_INCREMENT NOT NULL,
	`bid` int(6) NOT NULL,
	`type` varchar(1) NOT NULL,
	`aid` int(6) NOT NULL,
	`commenttxt` longtext NOT NULL,
	`added` int(11) NOT NULL,
	`editaid` int(6) DEFAULT 'NULL',
	`edittime` int(11) DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `sb_comms` (
	`bid` int(6) AUTO_INCREMENT NOT NULL,
	`authid` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL DEFAULT ''unnamed'',
	`created` int(11) NOT NULL DEFAULT 0,
	`ends` int(11) NOT NULL DEFAULT 0,
	`length` int(10) NOT NULL DEFAULT 0,
	`reason` text NOT NULL,
	`aid` int(6) NOT NULL DEFAULT 0,
	`adminIp` varchar(32) NOT NULL DEFAULT '''',
	`sid` int(6) NOT NULL DEFAULT 0,
	`RemovedBy` int(8) DEFAULT 'NULL',
	`RemoveType` varchar(3) DEFAULT 'NULL',
	`RemovedOn` int(11) DEFAULT 'NULL',
	`type` tinyint NOT NULL DEFAULT 0,
	`ureason` text DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `sb_demos` (
	`demid` int(6) NOT NULL,
	`demtype` varchar(1) NOT NULL,
	`filename` varchar(128) NOT NULL,
	`origname` varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sb_groups` (
	`gid` int(6) AUTO_INCREMENT NOT NULL,
	`type` smallint(6) NOT NULL DEFAULT 0,
	`name` varchar(128) NOT NULL DEFAULT ''unnamed'',
	`flags` int(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sb_log` (
	`lid` int(11) AUTO_INCREMENT NOT NULL,
	`type` enum('m','w','e') NOT NULL,
	`title` varchar(512) NOT NULL,
	`message` text NOT NULL,
	`function` text NOT NULL,
	`query` text NOT NULL,
	`aid` int(11) NOT NULL,
	`host` text NOT NULL,
	`created` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sb_login_tokens` (
	`jti` varchar(16) NOT NULL,
	`secret` varchar(64) NOT NULL,
	`lastAccessed` int(11) NOT NULL,
	CONSTRAINT `secret` UNIQUE(`secret`)
);
--> statement-breakpoint
CREATE TABLE `sb_mods` (
	`mid` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`icon` varchar(128) NOT NULL,
	`modfolder` varchar(64) NOT NULL,
	`steam_universe` tinyint NOT NULL DEFAULT 0,
	`enabled` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `modfolder` UNIQUE(`modfolder`),
	CONSTRAINT `name` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `sb_overrides` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`type` enum('command','group') NOT NULL,
	`name` varchar(32) NOT NULL,
	`flags` varchar(30) NOT NULL,
	CONSTRAINT `type` UNIQUE(`type`,`name`)
);
--> statement-breakpoint
CREATE TABLE `sb_protests` (
	`pid` int(6) AUTO_INCREMENT NOT NULL,
	`bid` int(6) NOT NULL,
	`datesubmitted` int(11) NOT NULL,
	`reason` text NOT NULL,
	`email` varchar(128) NOT NULL,
	`archiv` tinyint DEFAULT 0,
	`archivedby` int(11) DEFAULT 'NULL',
	`pip` varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sb_servers` (
	`sid` int(6) AUTO_INCREMENT NOT NULL,
	`ip` varchar(64) NOT NULL,
	`port` int(5) NOT NULL,
	`rcon` varchar(64) NOT NULL,
	`modid` int(10) NOT NULL,
	`enabled` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `ip` UNIQUE(`ip`,`port`)
);
--> statement-breakpoint
CREATE TABLE `sb_servers_groups` (
	`server_id` int(10) NOT NULL,
	`group_id` int(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sb_settings` (
	`setting` varchar(128) NOT NULL,
	`value` text NOT NULL,
	CONSTRAINT `setting` UNIQUE(`setting`)
);
--> statement-breakpoint
CREATE TABLE `sb_srvgroups` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`flags` varchar(30) NOT NULL,
	`immunity` int(10) unsigned NOT NULL,
	`name` varchar(120) NOT NULL,
	`groups_immune` varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sb_srvgroups_overrides` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`group_id` smallint(5) unsigned NOT NULL,
	`type` enum('command','group') NOT NULL,
	`name` varchar(32) NOT NULL,
	`access` enum('allow','deny') NOT NULL,
	CONSTRAINT `group_id` UNIQUE(`group_id`,`type`,`name`)
);
--> statement-breakpoint
CREATE TABLE `sb_submissions` (
	`subid` int(6) AUTO_INCREMENT NOT NULL,
	`submitted` int(11) NOT NULL,
	`ModID` int(6) NOT NULL,
	`SteamId` varchar(64) NOT NULL DEFAULT ''unnamed'',
	`name` varchar(128) NOT NULL,
	`email` varchar(128) NOT NULL,
	`reason` text NOT NULL,
	`ip` varchar(64) NOT NULL,
	`subname` varchar(128) DEFAULT 'NULL',
	`sip` varchar(64) DEFAULT 'NULL',
	`archiv` tinyint DEFAULT 0,
	`archivedby` int(11) DEFAULT 'NULL',
	`server` tinyint DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE INDEX `sid` ON `sb_bans` (`sid`);--> statement-breakpoint
CREATE INDEX `type_authid` ON `sb_bans` (`type`,`authid`);--> statement-breakpoint
CREATE INDEX `type_ip` ON `sb_bans` (`type`,`ip`);--> statement-breakpoint
CREATE INDEX `reason` ON `sb_bans` (`reason`);--> statement-breakpoint
CREATE INDEX `authid_2` ON `sb_bans` (`authid`);--> statement-breakpoint
CREATE INDEX `cid` ON `sb_comments` (`cid`);--> statement-breakpoint
CREATE INDEX `commenttxt` ON `sb_comments` (`commenttxt`);--> statement-breakpoint
CREATE INDEX `sid` ON `sb_comms` (`sid`);--> statement-breakpoint
CREATE INDEX `type` ON `sb_comms` (`type`);--> statement-breakpoint
CREATE INDEX `RemoveType` ON `sb_comms` (`RemoveType`);--> statement-breakpoint
CREATE INDEX `authid` ON `sb_comms` (`authid`);--> statement-breakpoint
CREATE INDEX `created` ON `sb_comms` (`created`);--> statement-breakpoint
CREATE INDEX `aid` ON `sb_comms` (`aid`);--> statement-breakpoint
CREATE INDEX `steam_universe` ON `sb_mods` (`steam_universe`);--> statement-breakpoint
CREATE INDEX `bid` ON `sb_protests` (`bid`);
*/