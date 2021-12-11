const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const router = require("./router/router");
const mongoDB = require("./database/database");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const port = 8080;
// here i pass json and urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: "key of secret",
    resave: false,
    saveUninitialized: false,
  })
);
// for flash message...
app.use(flash());
// here i set view engine
app.set("view engine", "ejs");
// here i pass rotes connection
app.use("/", router);
// here i set server run on which port
app.listen(port, () => {
  mongoDB();
  console.log("Server lister at ... " + port);
});
