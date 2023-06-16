const express = require("express");
const router = express.Router();
const database = require("./database");
const authSessions = require("./authSessions");

// Middleware untuk memeriksa apakah pengguna telah login
router.use(authSessions.checkLoggedIn);

// Rute untuk memperbarui profil pengguna
router.put("/users/profile", database.updateProfile);

// Rute untuk mengubah password pengguna
router.put("/users/password", database.changePassword);

// Rute untuk memperbarui BMI pengguna
router.put("/users/bmi", database.updateBMI);

module.exports = router;
