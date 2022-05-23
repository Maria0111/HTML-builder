const fs = require('fs/promises');
const { join } = require('path');

const DIR = join(__dirname, 'files');
const DIR_COPY = join(__dirname, 'files-copy');

const folderExist = async (folder) => {
  let result = false;
  await fs
    .access(folder)
    .then(() => {
      result = true;
    })
    .catch(() => {
      result = false;
    });

  return result;
};

const copy = async (folder) => {
  if (await folderExist(DIR_COPY)) {
    await fs.rm(DIR_COPY, { recursive: true });
  }
  await fs.mkdir(DIR_COPY);
  for (let i = 0; i < folder.length; i++) {
    await fs.copyFile(join(DIR, folder[i]), join(DIR_COPY, folder[i])).then(console.log(folder[i]));
  }
  return folder.length;
};

fs.readdir(DIR)
  .then((folder) => copy(folder))
  .then((count) => console.log(`${count} file(s) copied!`));
