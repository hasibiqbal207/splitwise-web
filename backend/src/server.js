import express from 'express';
import dotenv from 'dotenv';
import logger from './logger';
import morgan from 'morgan';

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],
        url: message.split(' ')[1],
        status: message.split(' ')[2],
        responseTime: message.split(' ')[3],

      };
      logger.info(JSON.stringify(logObject));
    }
  }
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
