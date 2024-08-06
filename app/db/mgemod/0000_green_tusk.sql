-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `connections` (
	`id` int(100) unsigned AUTO_INCREMENT NOT NULL,
	`steamid` varchar(255) NOT NULL,
	`nickname` varchar(255) NOT NULL,
	`ipaddress` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`profile` varchar(255) NOT NULL,
	`server` varchar(255) NOT NULL,
	`connectedat` varchar(255) NOT NULL,
	`disconnectedat` varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mgemod_duels` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`winner` varchar(32) NOT NULL,
	`loser` varchar(32) NOT NULL,
	`winnerscore` int(4) NOT NULL,
	`loserscore` int(4) NOT NULL,
	`winlimit` int(4) NOT NULL,
	`gametime` int(11) NOT NULL,
	`mapname` varchar(64) NOT NULL,
	`arenaname` varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mgemod_duels_2v2` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`winner` varchar(32) NOT NULL,
	`winner2` varchar(32) NOT NULL,
	`loser` varchar(32) NOT NULL,
	`loser2` varchar(32) NOT NULL,
	`winnerscore` int(4) NOT NULL,
	`loserscore` int(4) NOT NULL,
	`winlimit` int(4) NOT NULL,
	`gametime` int(11) NOT NULL,
	`mapname` varchar(64) NOT NULL,
	`arenaname` varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mgemod_stats` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`rating` int(4) NOT NULL,
	`steamid` varchar(32) NOT NULL,
	`name` varchar(64) NOT NULL,
	`wins` int(4) NOT NULL,
	`losses` int(4) NOT NULL,
	`lastplayed` int(11) NOT NULL,
	`hitblip` int(2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `VPNBlock` (
	`playername` char(128) NOT NULL,
	`steamid` char(32) NOT NULL,
	`lastupdated` int(64) NOT NULL,
	`ip` char(32) NOT NULL,
	`proxy` tinyint NOT NULL
);
--> statement-breakpoint
CREATE TABLE `VPNBlock_wl` (
	`steamid` char(32) NOT NULL
);

*/