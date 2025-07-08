import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY || "";

// Directory to store logs
const logDir = path.join(process.cwd(), "logs");

// Create logs directory
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, "api-key-usage.log");

export const verifyAPIKey = (req, res, next) => {
  const CLIENT_API_KEY = req.headers["x-api-key"];

  // If API key is not present in headers
  if (!CLIENT_API_KEY)
    return res.status(403).json({ message: "Unauthorized Access" });

  // If API key is present in headers but doesn't match with API_KEY in .env
  if (CLIENT_API_KEY !== API_KEY)
    return res.status(401).json({ message: "Unauthorized Access" });

  const formattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  }

  // Log Content
  const logEntry = `Date Accessed: [${formattedDate()}] | API Key Used: ${CLIENT_API_KEY.slice(
    0,
    5
  )}**** | IP Address: ${req.ip} | Route: ${req.originalUrl} | Method: ${
    req.method
  } | Status Code: ${res.statusCode} \n`;

  // File logging of API key usage
  fs.appendFileSync(logFile, logEntry, (err) => {
    if (err) console.log("Failed to log API key usage:", err);
  });

  // Call the next function if API key is valid
  next();
};
