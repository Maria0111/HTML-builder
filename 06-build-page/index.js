const fs = require('fs/promises');
const { join } = require('path');
const { Transform } = require('stream');

const STYLES = join(__dirname, 'styles');
const COMPONENTS = join(__dirname, 'components');
const ASSETS = join(__dirname, 'assets');
const TEMPLATE = join(__dirname, 'template.html');

const OUTPUT_FOLDER = join(__dirname, 'project-dist');

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

const createFolder = async (folder) => {
  if (await folderExist(folder)) {
    await fs.rm(folder, { recursive: true });
  }
  await fs.mkdir(folder);
  return true;
};

const copyFolder = async (fromFolder, toFolder) => {
  await createFolder(join(toFolder));

  const files = await fs.readdir(fromFolder, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const src = join(fromFolder, file.name);
      const dest = join(toFolder, file.name);
      await fs.copyFile(src, dest);
    } else {
      await copyFolder(join(fromFolder, file.name), join(toFolder, file.name));
    }
  }

  return true;
};

const getFilesList = async (folder, ext) => {
  const files = await fs.readdir(folder);
  return files.filter((file) => file.endsWith(`.${ext}`));
};

const createStyles = async () => {
  const stylesFiles = await getFilesList(STYLES, 'css');

  for (const file of stylesFiles) {
    const style = await fs.readFile(join(STYLES, file));
    await fs.appendFile(join(OUTPUT_FOLDER, 'style.css'), `${style}\n`);
  }

  return true;
};

const createLayout = async () => {
  const componentsFiles = await getFilesList(COMPONENTS, 'html');
  const templateFile = await fs.open(TEMPLATE);
  const outputFile = await fs.open(join(OUTPUT_FOLDER, 'index.html'), 'w');
  const templateStream = templateFile.createReadStream();
  const outputStream = outputFile.createWriteStream();

  const transformStream = new Transform({
    async transform(data) {
      let template = data.toString();

      for (const component of componentsFiles) {
        const componentName = component.slice(0, -5);
        const componentContent = await fs.readFile(join(COMPONENTS, component));
        template = template.replace(`{{${componentName}}}`, componentContent);
      }

      this.push(template);
    },
  });

  await templateStream.pipe(transformStream).pipe(outputStream);

  return true;
};

createFolder(OUTPUT_FOLDER)
  .then(() => copyFolder(ASSETS, join(OUTPUT_FOLDER, 'assets')))
  .then(() => createStyles())
  .then(() => createLayout())
  .then(() => console.log('Building finished'))
  .catch((err) => console.log(err));