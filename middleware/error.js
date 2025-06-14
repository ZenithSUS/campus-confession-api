export function error(err, req, res, next) {
  if (err.status === 404) return res.status(404).json({ message: "Not Found" });
  if (err.status === 500)
    return res.status(500).json({ message: "Internal Server Error" });
  if (err.status === 400)
    return res.status(400).json({ message: "Bad Request" });
  if (err.status === 401)
    return res.status(401).json({ message: "Unauthorized" });
  if (err.status === 403) return res.status(403).json({ message: "Forbidden" });
  if (err.status === 409) return res.status(409).json({ message: "Conflict" });


  return res
    .status(500)
    .json({ message: "Internal Server Error", error_msg: err.message });
}
