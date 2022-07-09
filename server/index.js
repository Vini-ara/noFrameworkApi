require('dotenv').config();
const http = require("http");

const handleRoutes = require("./routes");

const server = http.createServer(handleRoutes);

server.listen(3000).on('listening', () => console.log("server running baby!!!"))
