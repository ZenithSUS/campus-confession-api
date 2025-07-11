import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import { fileURLToPath } from "url";
import { logger } from "./middleware/logger.js";
import { limiter } from "./middleware/limiter.js";
import { verifyAPIKey } from "./middleware/verify-key.js";
import { notFound } from "./middleware/not-found.js";
import { error } from "./middleware/error.js";
import mistralRouter from "./routes/mistral.js";
import userRouter from "./routes/users.js";
import confessionRouter from "./routes/confession.js";
import commentRouter from "./routes/comments.js";
import likeRouter from "./routes/likes.js";
import childrenCommentRouter from "./routes/children-comment.js";

// Load Environment Variables
dotenv.config();

// Allowed CORS
const allowedOrigins = process.env.FRONTEND_ORIGINS.split(",") || [];

// Initialize Server and Middlewares
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3030;

// Enable CORS for allowed origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        // Allow requests from allowedOrigins
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);

// Make favicon available
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middlewares
app.use(helmet());
app.use(limiter);
app.use(logger);

// routes with protected routes
app.use("/api/mistral", verifyAPIKey, mistralRouter.routes());
app.use("/api/users", verifyAPIKey, userRouter.routes());
app.use("/api/confessions", verifyAPIKey, confessionRouter.routes());
app.use("/api/comments", verifyAPIKey, commentRouter.routes());
app.use("/api/likes", verifyAPIKey, likeRouter.routes());
app.use("/api/child-comments", verifyAPIKey, childrenCommentRouter.routes());

// Error Handling Middleware
app.use(notFound);
app.use(error);

// Initialize Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
