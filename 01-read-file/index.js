const { createReadStream } = require('fs');
const { join } = require('path');

const text = 'text.txt';

createReadStream(join(__dirname, text))
  .on('error', (err) => console.log(err))
  .pipe(process.stdout);