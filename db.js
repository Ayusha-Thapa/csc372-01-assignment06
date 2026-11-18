/*
 * Name: Ayusha Thapa
 * Date: 11.17.2026
 * CSC 372-01
 *
 * Creates a connection pool for the Neon Postgres database.
 */

import pg from "pg";

let pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

export default pool;