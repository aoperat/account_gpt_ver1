const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4999;

const DATA_FOLDER = './files/accounts';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('public'));

const PUBLIC_FOLDER = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_FOLDER));

app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_FOLDER, 'index.html'));
});


app.post('/saveDataToFile', (req, res) => {
    console.log("saveDataToFile")
    const { fileName, fileContent } = req.body;


    if (!fs.existsSync(DATA_FOLDER)) {
        fs.mkdirSync(DATA_FOLDER, { recursive: true });
    }

    fs.writeFile(path.join(DATA_FOLDER, fileName), fileContent, (err) => {
        if (err) {
            res.status(500).send({ error: 'Failed to save the file.' });
        } else {
            res.status(200).send({ message: 'File saved successfully.' });
        }
    });
});

app.get('/listFiles', (req, res) => {
    fs.readdir(DATA_FOLDER, (err, files) => {
        if (err) {
            res.status(500).send({ error: 'Failed to list files.' });
        } else {
            res.status(200).send(files);
        }
    });
});

app.get('/readFileContent', (req, res) => {
  const fileName = req.query.fileName;

  fs.readFile(path.join(DATA_FOLDER, fileName), 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404).send({ error: 'File not found.' });
      } else {
        res.status(500).send({ error: 'Failed to read file content.' });
      }
    } else {
      res.status(200).send(data);
    }
  });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
