const http = require('http');
const PORT = 3000;
const INTERVAL = 1000;
const MAX = 5;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    let interval;
    let counter = 0;
    res.write("", () => {
      interval = setInterval(() => {
        if (counter < MAX) {
          console.log(new Date().toUTCString())
          counter++;
        } else {
          res.end(new Date().toUTCString(), () => {
            clearInterval(interval);
          });
        }
      }, INTERVAL)
    })
  }
})

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
})