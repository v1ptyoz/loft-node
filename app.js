const fs = require('fs');

function main(sourceDir, destinationDir) {
  if (!sourceDir && !destinationDir) {
    console.log("Missing require parameters\nUsage: app.js sourceDirName destinationDirname ...");
    return;
  }
  let counter = 0;

  function createDirAndCallCallback(dir, callback) {
    fs.stat(dir, (err) => {
      if (err) {
        fs.mkdir(dir, () => {
          if (callback) callback();
        });
      } else {
        if (callback) callback();
      }
    })
  }

  function readDirectory(source) {
    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      files.forEach(file => {
        if (file.isDirectory()) {
          readDirectory(`${source}/${file.name}`);
        } else {
          fileCopy(source, file.name);
          counter++;
        }
      });
    })
  }

  function fileCopy(source, filename) {
    const firstLetterOfFile = filename[0].toUpperCase();
    const finalDestination = `${destinationDir}/${firstLetterOfFile}`;
    createDirAndCallCallback(finalDestination, () => {
      fs.copyFile(`${source}/${filename}`, `${finalDestination}/${filename}`, (err) => {
        if (err) throw err;
      })
    });
  }

  createDirAndCallCallback(destinationDir);
  readDirectory(sourceDir);

  fs.rm(sourceDir, { recursive: true, force: true }, (err) => {
    if (err) throw err;
  })

}

main(process.argv[2], process.argv[3]);