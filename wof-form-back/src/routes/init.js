import db from "../config/db.js";

async function init() {
  try {
    await db.query(`
            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(80) NOT NULL,
                last_name VARCHAR(80) NOT NULL,
                gender VARCHAR(20) NOT NULL,
                birth_date DATE NOT NULL,
                email VARCHAR(150),
                tel VARCHAR(30) NOT NULL,
                degree_school VARCHAR(60) NOT NULL,
                level VARCHAR(30) NOT NULL,
                session_token TEXT,
                edit_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    console.log("| > Tabela configurada! ");
  } catch (err) {
    console.log("| > Erro ao configurar tabela", err.message);
  } 
}

export default init;
