const fs = require('fs/promises');
const path = require('path');

const assetsFolder = path.join(__dirname, 'assets');
const distFolder = path.join(__dirname, 'project-dist');

const createFolder = async (folderPath, isRecursive) => {
  try {
    await fs.mkdir(folderPath, { recursive: isRecursive });
  } catch (error) {
    if (error.code === 'EEXIST') {
      // console.log(folderPath, 'exist');
      try {
        await fs.rm(folderPath, { recursive: true, force: true });
        await fs.mkdir(folderPath);
        // console.log(folderPath, 'removed');
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
    const files = await fs.readdir(fromFolder, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(fromFolder, file.name);
      const outPath = path.join(toFolder, file.name);

      if (file.isDirectory()) {
        await copyDir(filePath, outPath);
      } else {
        fs.copyFile(filePath, outPath);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

createFolder(distFolder, true);
copyDir(assetsFolder, path.join(distFolder, 'assets'));