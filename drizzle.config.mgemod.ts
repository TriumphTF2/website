import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: "./app/db/mgemod",
    dialect: "mysql",
    dbCredentials: {
        url: `mysql://${process.env.MGEMOD_DB_USER}:${process.env.MGEMOD_DB_PASSWORD}@${process.env.MGEMOD_DB_HOST}:${process.env.MGEMOD_DB_PORT}/${process.env.MGEMOD_DB_NAME}`,
    },
    verbose: true,
    strict: true,
});
