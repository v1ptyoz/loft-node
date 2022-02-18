const http = require('http');
const PORT = 3000;
const INTERVAL = process.env.interval || 1000;
const TIME = process.env.time || 3000;

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