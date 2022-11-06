const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const assetsFolder = path.join(__dirname, 'assets');
const stylesFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const distFolder = path.join(__dirname, 'project-dist');

const createFolder = async (folderPath, isRecursive) => {
  try {
    await fsPromises.mkdir(folderPath, { recursive: isRecursive });
  } catch (error) {
    if (error.code === 'EEXIST') {
      try {
        await fsPromises.rm(folderPath, { recursive: true, force: true });
        await fsPromises.mkdir(folderPath);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log(error.message);
    }
  }
};

const copyDir = async (fromFolder, toFolder) => {
  await createFolder(toFolder, false);

  try {
    const files = await fsPromises.readdir(fromFolder, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(fromFolder, file.name);
      const outPath = path.join(toFolder, file.name);

      if (file.isDirectory()) {
        await copyDir(filePath, outPath);
      } else {
        fsPromises.copyFile(filePath, outPath);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getFilesOfSameType = async (stylesFolder, type) => {
  const out = [];

  try {
    const files = await fsPromises.readdir(stylesFolder, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        if (file.name.split('.')[1] === type) out.push(file.name);
      }
    }
  } catch (error) {
    console.log(error.message);
  }

  return out;
};

const mergeStyles = async (stylesFolder, outputFile) => {
  const writeStream = fs.createWriteStream(outputFile);

  const filesList = await getFilesOfSameType(stylesFolder, 'css');

  filesList.forEach(file => {
    const readStream = fs.createReadStream(path.join(stylesFolder, file), 'utf-8');

    readStream.on('data', chunk => writeStream.write(chunk));
    readStream.on('end', () => writeStream.write('\n'));
  });
};

// const readTemplate = () => {
//   let template = '';

//   const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

//   readStream.on('data', chunk => template += chunk);
//   readStream.on('end', () => {
//     return template;

//   });

// };

const buildHtml = async () => {
  let template = '';

  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const components = await getFilesOfSameType(componentsFolder, 'html');

  readStream.on('data', chunk => template += chunk);
  readStream.on('end', async () => {

    components.forEach(component => {
      const tagName = component.split('.')[0];
      let tagContent = '';
      const readStream = fs.createReadStream(path.join(componentsFolder, component), 'utf-8');
      const writeStream = fs.createWriteStream(path.join(distFolder, 'index.html'));
      readStream.on('data', chunk => tagContent += chunk);
      readStream.on('end', () => {
        template = template.replace(`{{${tagName}}}`, tagContent);
        writeStream.write(template);
      });
    });
  });

};

createFolder(distFolder, true);
copyDir(assetsFolder, path.join(distFolder, 'assets'));
mergeStyles(stylesFolder, path.join(distFolder, 'style.css'));
buildHtml();