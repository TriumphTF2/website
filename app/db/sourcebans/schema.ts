import { mysqlTable, mysqlSchema, AnyMySqlColumn, unique, int, varchar, index, text, tinyint, longtext, smallint, mysqlEnum } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const sbAdmins = mysqlTable("sb_admins", {
	aid: int("aid").autoincrement().notNull(),
	user: varchar("user", { length: 64 }).notNull(),
	authid: varchar("authid", { length: 64 }).default("''").notNull(),
	password: varchar("password", { length: 128 }).notNull(),
	gid: int("gid").notNull(),
	email: varchar("email", { length: 128 }).notNull(),
	validate: varchar("validate", { length: 128 }).default('NULL'),
	extraflags: int("extraflags").notNull(),
	immunity: int("immunity").default(0).notNull(),
	srvGroup: varchar("srv_group", { length: 128 }).default('NULL'),
	srvFlags: varchar("srv_flags", { length: 64 }).default('NULL'),
	srvPassword: varchar("srv_password", { length: 128 }).default('NULL'),
	lastvisit: int("lastvisit").$type<'NULL' | number>().default('NULL'), // This is so fucking stupid
},
(table) => {
	return {
		user: unique("user").on(table.user),
	}
});

export const sbAdminsServersGroups = mysqlTable("sb_admins_servers_groups", {
	adminId: int("admin_id").notNull(),
	groupId: int("group_id").notNull(),
	srvGroupId: int("srv_group_id").notNull(),
	serverId: int("server_id").notNull(),
});

export const sbBanlog = mysqlTable("sb_banlog", {
	sid: int("sid").notNull(),
	time: int("time").notNull(),
	name: varchar("name", { length: 128 }).notNull(),
	bid: int("bid").notNull(),
});

export const sbBans = mysqlTable("sb_bans", {
	bid: int("bid").autoincrement().notNull(),
	ip: varchar("ip", { length: 32 }).default('NULL'),
	authid: varchar("authid", { length: 64 }).default(`''`).notNull(),
	name: varchar("name", { length: 128 }).default(`'unnamed'`).notNull(),
	created: int("created").default(0).notNull(),
	ends: int("ends").default(0).notNull(),
	length: int("length").default(0).notNull(),
	reason: text("reason").notNull(),
	aid: int("aid").default(0).notNull(),
	adminIp: varchar("adminIp", { length: 32 }).default(`''`).notNull(),
	sid: int("sid").default(0).notNull(),
	country: varchar("country", { length: 4 }).default('NULL'),
	removedBy: int("RemovedBy").$type<'NULL' | number>().default('NULL'),
	removeType: varchar("RemoveType", { length: 3 }).default('NULL'),
	removedOn: int("RemovedOn").$type<'NULL' | number>().default('NULL'),
	type: tinyint("type").default(0).notNull(),
	ureason: text("ureason").default('NULL'),
},
(table) => {
	return {
		sid: index("sid").on(table.sid),
		typeAuthid: index("type_authid").on(table.type, table.authid),
		typeIp: index("type_ip").on(table.type, table.ip),
		reason: index("reason").on(table.reason),
		authid2: index("authid_2").on(table.authid),
	}
});

export const sbComments = mysqlTable("sb_comments", {
	cid: int("cid").autoincrement().notNull(),
	bid: int("bid").notNull(),
	type: varchar("type", { length: 1 }).notNull(),
	aid: int("aid").notNull(),
	commenttxt: longtext("commenttxt").notNull(),
	added: int("added").notNull(),
	editaid: int("editaid").$type<'NULL' | number>().default('NULL'),
	edittime: int("edittime").$type<'NULL' | number>().default('NULL'),
},
(table) => {
	return {
		cid: index("cid").on(table.cid),
		commenttxt: index("commenttxt").on(table.commenttxt),
	}
});

export const sbComms = mysqlTable("sb_comms", {
	bid: int("bid").autoincrement().notNull(),
	authid: varchar("authid", { length: 64 }).notNull(),
	name: varchar("name", { length: 128 }).default(`'unnamed'`).notNull(),
	created: int("created").default(0).notNull(),
	ends: int("ends").default(0).notNull(),
	length: int("length").default(0).notNull(),
	reason: text("reason").notNull(),
	aid: int("aid").default(0).notNull(),
	adminIp: varchar("adminIp", { length: 32 }).default(`''`).notNull(),
	sid: int("sid").default(0).notNull(),
	removedBy: int("RemovedBy").$type<'NULL' | number>().default('NULL'),
	removeType: varchar("RemoveType", { length: 3 }).default('NULL'),
	removedOn: int("RemovedOn").$type<'NULL' | number>().default('NULL'),
	type: tinyint("type").default(0).notNull(),
	ureason: text("ureason").default('NULL'),
},
(table) => {
	return {
		sid: index("sid").on(table.sid),
		type: index("type").on(table.type),
		removeType: index("RemoveType").on(table.removeType),
		authid: index("authid").on(table.authid),
		created: index("created").on(table.created),
		aid: index("aid").on(table.aid),
	}
});

export const sbDemos = mysqlTable("sb_demos", {
	demid: int("demid").notNull(),
	demtype: varchar("demtype", { length: 1 }).notNull(),
	filename: varchar("filename", { length: 128 }).notNull(),
	origname: varchar("origname", { length: 128 }).notNull(),
});

export const sbGroups = mysqlTable("sb_groups", {
	gid: int("gid").autoincrement().notNull(),
	type: smallint("type").notNull(),
	name: varchar("name", { length: 128 }).default(`'unnamed'`).notNull(),
	flags: int("flags").notNull(),
});

export const sbLog = mysqlTable("sb_log", {
	lid: int("lid").autoincrement().notNull(),
	type: mysqlEnum("type", ['m','w','e']).notNull(),
	title: varchar("title", { length: 512 }).notNull(),
	message: text("message").notNull(),
	function: text("function").notNull(),
	query: text("query").notNull(),
	aid: int("aid").notNull(),
	host: text("host").notNull(),
	created: int("created").notNull(),
});

export const sbLoginTokens = mysqlTable("sb_login_tokens", {
	jti: varchar("jti", { length: 16 }).notNull(),
	secret: varchar("secret", { length: 64 }).notNull(),
	lastAccessed: int("lastAccessed").notNull(),
},
(table) => {
	return {
		secret: unique("secret").on(table.secret),
	}
});

export const sbMods = mysqlTable("sb_mods", {
	mid: int("mid").autoincrement().notNull(),
	name: varchar("name", { length: 128 }).notNull(),
	icon: varchar("icon", { length: 128 }).notNull(),
	modfolder: varchar("modfolder", { length: 64 }).notNull(),
	steamUniverse: tinyint("steam_universe").default(0).notNull(),
	enabled: tinyint("enabled").default(1).notNull(),
},
(table) => {
	return {
		steamUniverse: index("steam_universe").on(table.steamUniverse),
		modfolder: unique("modfolder").on(table.modfolder),
		name: unique("name").on(table.name),
	}
});

export const sbOverrides = mysqlTable("sb_overrides", {
	id: int("id").autoincrement().notNull(),
	type: mysqlEnum("type", ['command','group']).notNull(),
	name: varchar("name", { length: 32 }).notNull(),
	flags: varchar("flags", { length: 30 }).notNull(),
},
(table) => {
	return {
		type: unique("type").on(table.type, table.name),
	}
});

export const sbProtests = mysqlTable("sb_protests", {
	pid: int("pid").autoincrement().notNull(),
	bid: int("bid").notNull(),
	datesubmitted: int("datesubmitted").notNull(),
	reason: text("reason").notNull(),
	email: varchar("email", { length: 128 }).notNull(),
	archiv: tinyint("archiv").default(0),
	archivedby: int("archivedby").$type<'NULL' | number>().default('NULL'),
	pip: varchar("pip", { length: 64 }).notNull(),
},
(table) => {
	return {
		bid: index("bid").on(table.bid),
	}
});

export const sbServers = mysqlTable("sb_servers", {
	sid: int("sid").autoincrement().notNull(),
	ip: varchar("ip", { length: 64 }).notNull(),
	port: int("port").notNull(),
	rcon: varchar("rcon", { length: 64 }).notNull(),
	modid: int("modid").notNull(),
	enabled: tinyint("enabled").default(1).notNull(),
},
(table) => {
	return {
		ip: unique("ip").on(table.ip, table.port),
	}
});

export const sbServersGroups = mysqlTable("sb_servers_groups", {
	serverId: int("server_id").notNull(),
	groupId: int("group_id").notNull(),
});

export const sbSettings = mysqlTable("sb_settings", {
	setting: varchar("setting", { length: 128 }).notNull(),
	value: text("value").notNull(),
},
(table) => {
	return {
		setting: unique("setting").on(table.setting),
	}
});

export const sbSrvgroups = mysqlTable("sb_srvgroups", {
	id: int("id").autoincrement().notNull(),
	flags: varchar("flags", { length: 30 }).notNull(),
	immunity: int("immunity").notNull(),
	name: varchar("name", { length: 120 }).notNull(),
	groupsImmune: varchar("groups_immune", { length: 255 }).notNull(),
});

export const sbSrvgroupsOverrides = mysqlTable("sb_srvgroups_overrides", {
	id: int("id").autoincrement().notNull(),
	groupId: smallint("group_id").notNull(),
	type: mysqlEnum("type", ['command','group']).notNull(),
	name: varchar("name", { length: 32 }).notNull(),
	access: mysqlEnum("access", ['allow','deny']).notNull(),
},
(table) => {
	return {
		groupId: unique("group_id").on(table.groupId, table.type, table.name),
	}
});

export const sbSubmissions = mysqlTable("sb_submissions", {
	subid: int("subid").autoincrement().notNull(),
	submitted: int("submitted").notNull(),
	modId: int("ModID").notNull(),
	steamId: varchar("SteamId", { length: 64 }).default(`'unnamed'`).notNull(),
	name: varchar("name", { length: 128 }).notNull(),
	email: varchar("email", { length: 128 }).notNull(),
	reason: text("reason").notNull(),
	ip: varchar("ip", { length: 64 }).notNull(),
	subname: varchar("subname", { length: 128 }).default('NULL'),
	sip: varchar("sip", { length: 64 }).default('NULL'),
	archiv: tinyint("archiv").default(0),
	archivedby: int("archivedby").$type<'NULL' | number>().default('NULL'),
	server: tinyint("server").$type<'NULL' | number>().default('NULL'),
});
