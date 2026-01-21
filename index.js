const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes/index.js");
const prisma = require("./config/db.js");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const corsOptions = require("./config/cors.js");

// Logger
app.use(morgan("dev"));
// Basic route
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use("/api/v1", cors(corsOptions), routes);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
