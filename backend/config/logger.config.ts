import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }: { level: string; message: string; timestamp?: string }) => {
    // Format the timestamp to be shorter (only date and time)
    const shortTimestamp = timestamp ? new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ') : '';
    return `${level}: ${message} | ${shortTimestamp}`;
  })
);

// Create a Winston logger
const logger: Logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp(),
    json()
  ),
  transports: [
    new transports.Console({
      format: consoleLogFormat
    }),
    // new transports.File({ filename: 'app.log' })
  ],
});

export default logger;