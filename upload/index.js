const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keeping original file name
  },
});

// Initialize multer for file upload
const upload = multer({ storage: storage });

// Route to handle model upload
app.post(
  "/upload",
  upload.fields([
    { name: "model.json", maxCount: 1 },
    { name: "model.weights.bin", maxCount: 1 },
  ]),
  (req, res) => {
    res.send("Model uploaded successfully");
  }
);

console.log(__dirname);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
