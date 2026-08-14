import "dotenv/config";

const required = (key) => {
  const value = process.env[key];
  if (!value || !value.trim()) {
    console.error(
      `\n[config] Missing required environment variable: ${key}\n` +
        `         Copy .env.example to .env and fill it in (or set it in your host's dashboard).\n`
    );
    process.exit(1);
  }
  return value.trim();
};

const optional = (key, fallback) => {
  const value = process.env[key];
  return value && value.trim() ? value.trim() : fallback;
};

const list = (key, fallback = []) => {
  const value = optional(key, "");
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const nodeEnv = optional("NODE_ENV", "development");

const config = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  isDevelopment: nodeEnv === "development",
  port: Number(optional("PORT", "5000")),

  mongoUri: required("MONGODB_URI"),

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: optional("JWT_EXPIRES_IN", "7d"),
  },

  corsOrigins: list("CORS_ORIGINS", ["http://localhost:5173"]),

  cloudinary: {
    cloudName: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  },

  openRouter: {
    apiKey: required("OPENROUTER_API_KEY"),
    baseUrl: optional("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
    model: optional("OPENROUTER_MODEL", "deepseek/deepseek-chat"),
  },

  uploads: {
    maxFileSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },
};

if (config.isProduction && config.jwt.secret.length < 32) {
  console.error(
    "\n[config] JWT_SECRET must be at least 32 characters in production.\n"
  );
  process.exit(1);
}

if (!Number.isInteger(config.port) || config.port <= 0) {
  console.error(`\n[config] PORT must be a positive integer (got "${process.env.PORT}").\n`);
  process.exit(1);
}

export default config;
