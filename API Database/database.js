require("dotenv").config();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

// Buat koneksi ke database MySQL di Cloud SQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Fungsi untuk membuat pengguna baru
function createUser(req, res) {
  const { email, password, age, height, weight, intensity, gender } = req.body;

  // Hitung BMI berdasarkan height dan weight yang diberikan
  const bmi = weight / (height * height);

  // Simpan pengguna baru ke database
  connection.query(
    "INSERT INTO workout (email, password, age, height, weight, intensity, gender, bmi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [email, password, age, height, weight, intensity, gender, bmi],
    (error, results) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Terjadi kesalahan saat membuat pengguna" });
      } else {
        const newUser = {
          id: results.insertId,
          email,
          age,
          height,
          weight,
          intensity,
          gender,
          bmi, // Sertakan BMI dalam objek newUser
        };

        // Buat token JWT
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
          expiresIn: "1d", // Atur waktu kadaluarsa token sesuai kebutuhan Anda
        });

        res.status(201).json({
          message: "Pengguna berhasil terdaftar",
          token,
          user: newUser,
        });
      }
    }
  );
}

// Fungsi untuk proses login
function login(req, res) {
  const { email, password } = req.body;

  // Implementasi untuk proses login
  // Periksa apakah email dan password sesuai dengan yang ada di database
  // Jika sesuai, buat token JWT
  connection.query(
    "SELECT * FROM workout WHERE email = ? AND password = ?",
    [email, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi kesalahan saat proses login" });
      } else if (results.length === 0) {
        res.status(401).json({ error: "Email atau password tidak valid" });
      } else {
        const user = {
          id: results[0].id,
          email,
          age: results[0].age,
          height: results[0].height,
          weight: results[0].weight,
          intensity: results[0].intensity,
          gender: results[0].gender,
          bmi: results[0].bmi, // Sertakan nilai BMI dari hasil query
        };

        // Buat token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d", // Atur waktu kadaluarsa token sesuai kebutuhan Anda
        });

        res.status(200).json({ message: "Login berhasil", token, user });
      }
    }
  );
}

// Fungsi untuk memperbarui profil pengguna
function updateProfile(req, res) {
  const { email, age } = req.body;

  // Implementasi untuk memperbarui profil pengguna di database
  connection.query(
    "UPDATE workout SET email = ?, age = ? WHERE id = ?",
    [email, age, req.userId],
    (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          error: "Terjadi kesalahan saat memperbarui profil pengguna",
        });
      } else {
        const updatedUser = {
          id: req.userId,
          email,
          age,
          height: req.session.user.height,
          weight: req.session.user.weight,
          intensity: req.session.user.intensity,
          gender: req.session.user.gender,
        };
        res.status(200).json({
          message: "Profil pengguna berhasil diperbarui",
          user: updatedUser,
        });
      }
    }
  );
}

// Fungsi untuk mengubah password pengguna
function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  // Implementasi untuk mengubah password pengguna di database
  connection.query(
    "SELECT * FROM workout WHERE id = ? AND password = ?",
    [req.userId, oldPassword],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          error: "Terjadi kesalahan saat memeriksa password pengguna",
        });
      } else if (results.length === 0) {
        res.status(401).json({ error: "Password lama tidak valid" });
      } else {
        connection.query(
          "UPDATE workout SET password = ? WHERE id = ?",
          [newPassword, req.userId],
          (error) => {
            if (error) {
              console.error(error);
              res.status(500).json({
                error: "Terjadi kesalahan saat mengubah password pengguna",
              });
            } else {
              res.status(200).json({ message: "Password berhasil diubah" });
            }
          }
        );
      }
    }
  );
}

// Fungsi untuk memperbarui BMI pengguna
function updateBMI(req, res) {
  const { height, weight, intensity } = req.body;

  // Implementasi untuk memperbarui BMI pengguna di database
  // Hitung BMI berdasarkan height, weight, dan intensity yang diberikan
  const bmi = weight / (height * height);

  connection.query(
    "UPDATE workout SET height = ?, weight = ?, intensity = ?, bmi = ? WHERE id = ?",
    [height, weight, intensity, bmi, req.userId],
    (error) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Terjadi kesalahan saat memperbarui BMI pengguna" });
      } else {
        res.status(200).json({ message: "BMI berhasil diperbarui", bmi });
      }
    }
  );
}

module.exports = {
  createUser,
  login,
  updateProfile,
  changePassword,
  updateBMI,
};
