const path = require('path');
const { stdin, stdout } = process;
const fs = require('fs');
const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'));

process.on('exit', () => console.log('\nSee you next time!'));
process.on('SIGINT', () => process.exit());

stdout.write('Enter the text to be written:\n');

stdin.on('data', data => {
  let str = data.toString();

  if (str.trim() === 'exit') process.exit();
  writeStream.write(str);
});
