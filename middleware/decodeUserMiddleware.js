const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
        return next(); 
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        res.clearCookie("token");
    }

    next();
};
