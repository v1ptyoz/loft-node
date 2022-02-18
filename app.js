const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

async function main(sourceDir, destinationDir) {  
  if (!sourceDir && !destinationDir) {
    console.log("Missing require parameters\nUsage: app.js sourceDirName destinationDirname ...");
    return;
  }

  function createDir(dir) {
    return new Promise((resolve) => {
      const item = fs.statSync(dir, {throwIfNoEntry: false});
      if (!item) {
        resolve(fs.mkdirSync(dir));
      } else {
        resolve(false);
      }
    })
  }

  function readDir(dir) {
    return new Promise((resolve) => {
      const files = fs.readdirSync(dir, {withFileTypes: true});
      resolve(files);
    })
  }

  async function processFiles(source) {
    const files = await readDir(source);
    files.forEach(async (file) => {
      if (file.isDirectory()) {
        await processFiles(path.join(source, file.name));
      } else {
        await fileCopy(source, file.name);
      }
    });
  }

  async function fileCopy(source, filename) {
    const firstLetterOfFile = filename[0].toUpperCase();
    const finalDestination = path.join(__dirname, destinationDir, firstLetterOfFile);

    await createDir(finalDestination);

    return new Promise((resolve) => {
      resolve(fs.copyFileSync(path.join(source, filename), path.join(finalDestination, filename)));
    })
  }

  await createDir(destinationDir);
  await processFiles(path.join(__dirname, sourceDir));

}

main(process.argv[2], process.argv[3]);