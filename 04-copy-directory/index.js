const fs = require('fs/promises');
const path = require('path');

const copyDir = async (fromFolder, toFolder) => {
  try {
    await fs.mkdir(toFolder);
  } catch (error) {
    if (error.code === 'EEXIST') {
      try {
        await fs.rm(toFolder, { recursive: true });
        await fs.mkdir(toFolder);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log(error.message);
    }
  }

  try {
    const files = await fs.readdir(fromFolder, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(fromFolder, file.name);
      const outPath = path.join(toFolder, file.name);

      fs.copyFile(filePath, outPath);
    }
  } catch (error) {
    console.log(error.message);
  }
};

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
