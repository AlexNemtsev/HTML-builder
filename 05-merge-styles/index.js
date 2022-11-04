const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const getCSSFiles = async () => {
  const out = [];

  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        if (file.name.split('.')[1] === 'css') out.push(file.name);
      }
    }
  } catch (error) {
    console.log(error.message);
  }

  return out;
};

const writeStyles = async () => {
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

  const filesList = await getCSSFiles();

  filesList.forEach(file => {
    const readStream = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8');

    readStream.on('data', chunk => writeStream.write(chunk));
  });
};

writeStyles();