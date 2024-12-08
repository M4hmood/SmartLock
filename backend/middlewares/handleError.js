

exports.handleError = (err, req, res, next) => {
    res.status(500).json({ Error: err.message });
}