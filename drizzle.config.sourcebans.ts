import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: "./app/db/sourcebans",
    dialect: 'mysql',
    dbCredentials: {
        url: `mysql://${process.env.SOURCEBANS_DB_USER}:${process.env.SOURCEBANS_DB_PASSWORD}@${process.env.SOURCEBANS_DB_HOST}:${process.env.SOURCEBANS_DB_PORT}/${process.env.SOURCEBANS_DB_NAME}`,
    },
    verbose: true,
    strict: true,
});
