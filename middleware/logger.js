export function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
    );
    console.log(`Server took ${duration} ms`);

    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`Body: ${JSON.stringify(req.body)}`);
    }
    console.log(
      `Middleware Status: ${res.statusCode < 400 ? "Success" : "Error"} \n`
    );
  });
  next();
}
