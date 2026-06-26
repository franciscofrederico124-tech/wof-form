import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { engine } from "express-handlebars";

import init from "./src/routes/init.js";
import register from "./src/routes/register.js";
import access from "./src/routes/access.js";
import dashboard from "./src/routes/dashboard.js";
import login from "./src/routes/login.js";
import reset from "./src/config/reset.js";
import ping from "./src/routes/ping.js";

dotenv.config();

const app = express();

const allowedOrigins = process.env.ORIGIN ? process.env.ORIGIN.trim().split(",") : "*";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret_key_form_wof",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: process.env.NODE_ENV === "production"
    },
  })
);

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: false,
    layoutsDir: false,
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      }
    }
  })
);
app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(async (req, res, next) => {
  try {
    await init();
    next();
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/ping", ping);
app.post("/register", register);
app.get("/system/access", access);
app.post("/system/access", login);
app.get("/system/dashboard", dashboard);
app.get("/system/reset_db", reset);

app.get('*', (req, res) => {
  if (req.path === '/ping') {
    return res.status(200).send("pong");
  }
  res.redirect('/ping');
});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
