export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;
    const code = err.code ?? 'INTERNAL_SRVER_ERROR';

    const message = statusCode >= 500
        ? 'Erreur interne du server'
        : err.message;

    res.status(statusCode).json({
        error: {
            code,
            message
        }
    })
}