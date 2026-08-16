const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Akses ditolak! Token tidak ditemukan.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid!' });
        req.user = user;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Akses ditolak! Fitur ini khusus Admin.' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };