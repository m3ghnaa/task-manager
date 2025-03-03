const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Set req.user so res.locals.user works
        } catch (err) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
};
