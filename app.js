const http = require('http');
const PORT = 3000;
const INTERVAL = process.env.interval || 1000;
const TIME = process.env.time || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    let interval;

    const startTime = Date.now();
    let endTime = Date.now();

    res.write("", () => {
      interval = setInterval(() => {
          if ((endTime - startTime) > TIME) {
            res.end(new Date().toUTCString(), () => {
              clearInterval(interval);
            });
          } else {
            endTime = Date.now();
            console.log(new Date().toUTCString())
          }
        }, INTERVAL)
    })
  }
})

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
})