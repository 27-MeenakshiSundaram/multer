const express = require('express');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Make uploads folder publicly accessible
app.use('/uploads', express.static('uploads'));

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save in uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename file
  }
});

// Initialize multer with the storage config
const upload = multer({ storage: storage });

// Route to upload a single file
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send('An error occurred during file upload.');
  }
});

// Route to upload multiple files (max 3)
app.post('/uploads', upload.array('file', 3), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }
    res.send(`${req.files.length} files uploaded successfully.`);
  } catch (error) {
    console.error('Error during multiple file upload:', error);
    res.status(500).send('An error occurred during multiple file upload.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

