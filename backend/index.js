const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MONGODB_URL, PORT } = process.env;
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const cutiRoute = require("./routes/cutiRoute");
const adminRoute = require("./routes/adminRoute");

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRoute);
app.use("/cuti", cutiRoute);
app.use("/admin", adminRoute)