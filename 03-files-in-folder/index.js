const fs = require('fs/promises');
const path = require('path');

const readdir = fs.readdir;

const getInfo = async () => {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);

        const fileName = file.name.split('.')[0];
        const fileExt = path.extname(filePath).substring(1);
        const fileSize = (await fs.stat(filePath)).size;

        console.log(`${fileName} - ${fileExt} - ${fileSize} bytes`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

getInfo();