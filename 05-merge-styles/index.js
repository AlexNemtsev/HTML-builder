const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const getCSSFiles = async (stylesFolder) => {
  const out = [];

  try {
    const files = await fsPromises.readdir(stylesFolder, { withFileTypes: true });

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

const writeStyles = async (stylesFolder, outputFile) => {
  const writeStream = fs.createWriteStream(outputFile);

  const filesList = await getCSSFiles(stylesFolder);

  filesList.forEach(file => {
    const readStream = fs.createReadStream(path.join(stylesFolder, file), 'utf-8');

    readStream.on('data', chunk => writeStream.write(chunk));
    readStream.on('end', () => writeStream.write('\n'));
  });
};

writeStyles(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));