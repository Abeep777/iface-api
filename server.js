const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

db.select("*").from("users");

app.use(bodyParser.json()); //sending data from frontend
app.use(cors());

app.get("/", (req, res) => {
  res.send("success");
});
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get("/profile/:id", (req, res) => {
  profile.handleGetProfile(req, res, db);
});
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleClarifaiApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app running in port ${process.env.PORT}`);
});
