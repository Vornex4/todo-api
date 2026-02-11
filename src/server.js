// src/server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API corriendo en http://0.0.0.0:${PORT}`);
});
}

startServer();
