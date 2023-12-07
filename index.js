const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = 3000;
const bisUrl = "/api/v1";
const noteRout = require("./routes/notesRoutes");
const debtorRout = require("./routes/debtorRoutes");
const debtRout = require("./routes/debtRoutes");
// middleware

app.use(
  session({
    secret: "hamza",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge:3600000 * 24 },
  })
);
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to mysql database !!");
  app.listen(port, () =>
    console.log(`app running in  http://localhost:${port}/`)
  );
});

//routes

// auth
app.post(`/signin`, (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (!username || !fullName || !email || !password) {
    res.status(400).json({ msg: "bad request" });
  } else {
    const sql = `INSERT INTO users (full_name,user_name,email,password,role)
    VALUES ("${fullName}","${username}","${email}","${password}","${1}")`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.redirect("signin");
      } else {
        const session = req.session;
        session.isLogin = true;
        session.username = username;
        session.userId = result.insertId;
        session.fullName = fullName;
        session.role = 1;
        res.redirect("/");
      }
    });
  }
});

app.post(`/login`, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("login");
  } else {
    const sql = `SELECT * FROM users where user_name = "${username}"`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json({ msg: err });
      }
      if (result.length > 0) {
        const data = JSON.parse(JSON.stringify(result))[0];
        if (data.password == password) {
          const session = req.session;
          session.isLogin = true;
          session.username = result[0].user_name;
          session.userId = result[0].id;
          session.fullName = result[0].full_name;
          session.role = result[0].role;
          res.redirect("/");
        } else {
          res.render("login", { msg: "*غير مصرح لك بالدخول" });
        }
      } else {
        res.render("login", { msg: "*غير مصرح لك بالدخول" });
      }
    });
  }
});

// Home page
app.get("/", (req, res) => {
  const session = req.session;
  if (session.isLogin == true) {
    sql = `SELECT * from debtors WHERE user_id = ${session.userId}`;
    connection.query(sql, (err, result) => {
      res.render("index", {username:session.username, debtors: result });
    });
  } else {
    res.redirect("login");
  }
});
app.get("/login", (req, res) => {
  res.render("login", { msg: "" });
});
app.get("/signin", (req, res) => {
  res.render("signin");
});
app.get("/logout", (req, res) => {
  const session = req.session;
  session.destroy();
  res.redirect("login");
});
//notes
// app.use(`/notes`, noteRout);
app.use(`${bisUrl}/debtor`, debtorRout);
app.use(`${bisUrl}/debt`, debtRout);

