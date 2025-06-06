export function notFound(req, res, next) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status(404);
    return next(error);
}