const fs = require('fs');
const path = require('path');

async function main(sourceDir, destinationDir) {
  if (!sourceDir && !destinationDir) {
    console.log("Missing require parameters\nUsage: app.js sourceDirName destinationDirname ...");
    return;
  }

  async function createDir(dir) {
    return new Promise((resolve) => {
      fs.stat(dir, { throwIfNoEntry: false }, (err) => {
        if (err) {
          resolve(fs.mkdir(dir, () => {}));
        } else {
          resolve();
        }
      });
    })
  }

  async function readDir(dir) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    })
  }

  async function processFiles(source) {
    return new Promise(async (resolve) => {
      const files = await readDir(source);
      console.log(files);
      files.forEach(async (file) => {
        if (file.isDirectory()) {
          await processFiles(path.join(source, file.name));
        } else {
          await fileCopy(source, file.name);
        }
      });
      resolve("All files are sorted. Check it ^_^");
    })
  }

  async function fileCopy(source, filename) {
    const firstLetterOfFile = filename[0].toUpperCase();
    const finalDestination = path.join(__dirname, destinationDir, firstLetterOfFile);

    await createDir(finalDestination);

    return new Promise((resolve, reject) => {
      fs.copyFile(path.join(source, filename), path.join(finalDestination, filename), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
  }

  await createDir(destinationDir);
  console.log(await processFiles(path.join(__dirname, sourceDir)));
}

main(process.argv[2], process.argv[3]);