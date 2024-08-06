import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, char, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const connections = mysqlTable("connections", {
	id: int("id").autoincrement().notNull(),
	steamid: varchar("steamid", { length: 255 }).notNull(),
	nickname: varchar("nickname", { length: 255 }).notNull(),
	ipaddress: varchar("ipaddress", { length: 255 }).notNull(),
	country: varchar("country", { length: 255 }).notNull(),
	profile: varchar("profile", { length: 255 }).notNull(),
	server: varchar("server", { length: 255 }).notNull(),
	connectedat: varchar("connectedat", { length: 255 }).notNull(),
	disconnectedat: varchar("disconnectedat", { length: 255 }).notNull(),
});

export const mgemodDuels = mysqlTable("mgemod_duels", {
	id: int("id").autoincrement().notNull(),
	winner: varchar("winner", { length: 32 }).notNull(),
	loser: varchar("loser", { length: 32 }).notNull(),
	winnerscore: int("winnerscore").notNull(),
	loserscore: int("loserscore").notNull(),
	winlimit: int("winlimit").notNull(),
	gametime: int("gametime").notNull(),
	mapname: varchar("mapname", { length: 64 }).notNull(),
	arenaname: varchar("arenaname", { length: 64 }).notNull(),
});

export const mgemodDuels2V2 = mysqlTable("mgemod_duels_2v2", {
	id: int("id").autoincrement().notNull(),
	winner: varchar("winner", { length: 32 }).notNull(),
	winner2: varchar("winner2", { length: 32 }).notNull(),
	loser: varchar("loser", { length: 32 }).notNull(),
	loser2: varchar("loser2", { length: 32 }).notNull(),
	winnerscore: int("winnerscore").notNull(),
	loserscore: int("loserscore").notNull(),
	winlimit: int("winlimit").notNull(),
	gametime: int("gametime").notNull(),
	mapname: varchar("mapname", { length: 64 }).notNull(),
	arenaname: varchar("arenaname", { length: 32 }).notNull(),
});

export const mgemodStats = mysqlTable("mgemod_stats", {
	id: int("id").autoincrement().notNull(),
	rating: int("rating").notNull(),
	steamid: varchar("steamid", { length: 32 }).notNull(),
	name: varchar("name", { length: 64 }).notNull(),
	wins: int("wins").notNull(),
	losses: int("losses").notNull(),
	lastplayed: int("lastplayed").notNull(),
	hitblip: int("hitblip").notNull(),
});

export const vpnBlock = mysqlTable("VPNBlock", {
	playername: char("playername", { length: 128 }).notNull(),
	steamid: char("steamid", { length: 32 }).notNull(),
	lastupdated: int("lastupdated").notNull(),
	ip: char("ip", { length: 32 }).notNull(),
	proxy: tinyint("proxy").notNull(),
});

export const vpnBlockWl = mysqlTable("VPNBlock_wl", {
	steamid: char("steamid", { length: 32 }).notNull(),
});