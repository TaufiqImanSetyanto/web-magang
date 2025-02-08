const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  hakCuti: {
    tahunan: {
      type: Number,
      default: 12,
    },
    panjang: {
      type: Number,
      default: 30,
    },
  },
  bagian: {
    type: String,
    enum: [
      "Keuangan & Umum",
      "Keamanan",
      "Tanaman",
      "TMA",
      "Quality Assurance",
      "Instalasi - Kantor Instalasi",
      "Instalasi - ST. Besali",
      "Instalasi - ST. Bangunan",
      "Instalasi - ST. Gilingan",
      "Instalasi - ST. Ketel",
      "Instalasi - ST. Listrik",
      "Instalasi - ST. Instrumentasi",
      "Instalasi - ST. Kendaraan",
      "Pengolahan - Kantor Pengolahan",
      "Pengolahan - ST. Masakan",
      "Pengolahan - ST. Pemurnian",
      "Pengolahan - ST. Penguapan",
      "Pengolahan - ST. Puteran",
      "Pengolahan - ST. Limbah",
      "Pengolahan - ST. Pengemasan",
      "Lain-lain"
    ],
    default: "Keuangan & Umum",
    required: [true, "Your department is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
