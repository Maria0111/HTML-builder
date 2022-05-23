const fs = require('fs/promises');
const { join } = require('path');

const INPUT = join(__dirname, 'styles');
const OUTPUT = join(__dirname, 'project-dist', 'bundle.css');

const getStylesFiles = async () => {
  return await (await fs.readdir(INPUT)).filter((file) => file.endsWith('.css'));
};

const writeToBundle = async (files) => {
  console.log('Build a bundle');
  await fs.unlink(OUTPUT).catch(() => {});
  for (const file of files) {
    const style = await fs.readFile(join(INPUT, file));
    await fs.appendFile(join(OUTPUT), `${style}\n`, { flag: 'a' });
    console.log('>> ', file);
  }
  console.log('Building completed');
};

getStylesFiles()
  .then((files) => writeToBundle(files))
  .catch((err) => console.log('Building failed', err));