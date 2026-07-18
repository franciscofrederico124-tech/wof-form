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

init();
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN.trim().split(","),
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

app.get("/ping", ping);
app.post("/register", register);
app.get("/system/access", access);
app.post("/system/access", login);

app.get("/system/dashboard", dashboard);
app.get("/system/reset_db", reset);


const port = process.env.PORT;

app.listen(port, '0.0.0.0', () => {
  console.log(`
|••••••••••••••••••••••••••••••
| 
| > System on in http://127.0.0.1:${port}
| > Routes
| > /ping ( get )
| > /register ( post )
| > /system/access ( get )
|••••••••••••••••••••••••••••••
`);
});
