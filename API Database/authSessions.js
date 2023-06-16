const jwt = require("jsonwebtoken");

// Middleware untuk memeriksa apakah pengguna telah login
function checkLoggedIn(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    // Token ditemukan, verifikasi token JWT
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.error(error);
        res.status(401).json({ error: "Token tidak valid" });
      } else {
        req.userId = decoded.userId; // Simpan ID pengguna dari token di req.userId
        next();
      }
    });
  } else {
    // Token tidak ditemukan
    res.status(401).json({ error: "Token tidak tersedia" });
  }
}

module.exports = {
  checkLoggedIn,
};
