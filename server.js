const express = require('express');
const multer = require('multer');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);

  potrace.trace(filePath, { threshold: 128 }, (err, svg) => {
    if (err) {
      res.status(500).send('Error processing image');
      return;
    }

    res.type('image/svg+xml').send(svg);

    // Cleanup the uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
