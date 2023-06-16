import express from "express";
import userRoutes from "./routes/user";
import candidateRoutes from "./routes/candidate";
import courtSearchRoutes from "./routes/courtSearch";
import reportRoutes from "./routes/report";
import { errorHandler } from "./middlewares/errorHandler";
import logger from "./util/logger";
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.port ?? 3003;
const DB_URL = process.env.dbUrl;

const app = express();
app.use(bodyParser.json());

app.use(userRoutes);
app.use(candidateRoutes);
app.use(reportRoutes);
app.use(courtSearchRoutes);

app.use(errorHandler);

(async () => {
  try {
    await mongoose.connect(DB_URL);
    logger.info("Connected to the database");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to the database:", error);
    process.exit(1);
  }
})();
