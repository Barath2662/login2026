require("dotenv").config();
const app = require("../app");
const { connectPostgres } = require("../config/db/postgres");
require("../models/postgres");

let isConnected = false;

// Middleware to ensure DB connection is ready before handling requests on serverless environment
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectPostgres();
      isConnected = true;
    } catch (error) {
      console.error("DB Connection failed on cold start:", error);
    }
  }
  next();
});

module.exports = app;
