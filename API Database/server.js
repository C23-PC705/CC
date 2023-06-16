require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./users");
const database = require("./database");

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
// Middleware untuk parsing body request
app.use(bodyParser.json());

// Rute untuk membuat pengguna baru
app.post("/users/register", database.createUser);

// Rute untuk login
app.post("/users/login", database.login);

// Rute untuk pengguna yang telah login
app.use("/users", users);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
