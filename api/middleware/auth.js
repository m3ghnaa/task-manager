const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (req.path === "/login" || req.path === "/signup") return next();

    const token = req.cookies.token;
    if (!token) {
        console.log("No token found. Redirecting to login.");
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.clearCookie("token");
        res.redirect("/login");
    }
};

