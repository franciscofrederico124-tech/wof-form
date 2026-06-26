import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
    connectionString: process.env.CONNECT_STRING_POSTGREE,
    ssl: {
        rejectUnauthorized: false
    },
    max: process.env.VERCEL ? 1 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

db.on("error", (err) => {
    console.error("| > Erro BD:", err.message);
});

export default db;
