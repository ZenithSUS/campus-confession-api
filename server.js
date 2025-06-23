import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/not-found.js";
import { error } from "./middleware/error.js";
import confessionRouter from "./routes/confession.js";
import commentRouter from "./routes/comments.js";
import likeRouter from "./routes/likes.js";
import childrenCommentRouter from "./routes/children-comment.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
  })
);

// Make favicon available
app.get("/favicon.ico", (req, res) => {
  res.status(204);
});

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middlewares
app.use(logger);

// routes
app.use("/api/confessions", confessionRouter.routes());
app.use("/api/comments", commentRouter.routes());
app.use("/api/likes", likeRouter.routes());
app.use("/api/child-comments", childrenCommentRouter.routes());

// Error Handling Middleware
app.use(notFound);
app.use(error);

app.listen(3030, () => {
  console.log("Server is running on port 3030");
});
