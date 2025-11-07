import pino from "pino";

const __dirname = "./app.log";

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",

      options: { destination: `${__dirname}` },
    },

    {
      target: "pino/file", // logs to the standard output by default
    },
  ],
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport,
);

export default logger;
