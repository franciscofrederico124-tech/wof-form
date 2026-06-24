import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
    connectionString:
        process.env.CONNECT_STRING_POSTGREE,

    ssl: {
        rejectUnauthorized: false
    }
});

db.on("connect", () => {
    console.log(
        "| > Banco conectado!"
    );
});

db.on("error", (err) => {
    console.log(
        "| > Erro BD:",
        err.message
    );
});

export default db;