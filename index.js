const express = require('express');
const multer = require('multer');
const app = express();
const PORT = 3000;
app.use('/uploads', express.static('uploads'));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

