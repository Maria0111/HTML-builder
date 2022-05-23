const fs = require('fs/promises');
const { join } = require('path');

const FOLDER = join(__dirname, 'secret-folder');

fs.readdir(FOLDER, { withFileTypes: true })
  .then((dir) => {
    dir.forEach((obj) => {
      if (!obj.isDirectory()) {
        fs.stat(join(FOLDER, obj.name))
          .then((file) => {
            const [name, ext] = [...obj.name.split('.')];
            console.log(`${name} - ${ext} - ${file.size} bytes`);
          })
          .catch((err) => console.log(err));
      }
    });
  })
  .catch((err) => console.log(err));