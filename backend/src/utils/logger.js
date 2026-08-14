import config from "../config/env.js";

const write = (level, message, meta) => {
  if (config.isProduction) {
    process.stdout.write(
      JSON.stringify({
        level,
        time: new Date().toISOString(),
        message,
        ...(meta ? { meta } : {}),
      }) + "\n"
    );
    return;
  }

  const badge = { info: "INFO ", warn: "WARN ", error: "ERROR", debug: "DEBUG" }[level];
  console.log(`[${badge}] ${message}`, meta ?? "");
};

export const logger = {
  info: (message, meta) => write("info", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  error: (message, meta) => write("error", message, meta),
  debug: (message, meta) => {
    if (!config.isProduction) write("debug", message, meta);
  },
};

export default logger;
