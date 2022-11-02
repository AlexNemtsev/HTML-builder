const fs = require('fs/promises');
const path = require('path');

const copyDir = async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'files-copy'));
  } catch (error) {
    if (error.code === 'EEXIST') {
      try {
        await fs.rm(path.join(__dirname, 'files-copy'), { recursive: true });
        await fs.mkdir(path.join(__dirname, 'files-copy'));
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log(error.message);
    }
  }

  try {
    const files = await fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(__dirname, 'files', file.name);
      const outPath = path.join(__dirname, 'files-copy', file.name);

      fs.copyFile(filePath, outPath);
    }
  } catch (error) {
    console.log(error.message);
  }
};

copyDir();
