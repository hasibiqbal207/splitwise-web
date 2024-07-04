import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import logger from "../config/logger.config.js";
import connectDB from "../config/database.config.js";
import routes from "./routes/index.js";

dotenv.config();

// Connect to the database
connectDB();

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;
const morganFormat = ":method :url :status :response-time ms";

//parse json request url
app.use(express.json());

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

//api v1 routes
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
