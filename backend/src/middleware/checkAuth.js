const Token = require("../../db/models/token.model.js");

const CheckUserAuth = async (req, res, next) => {
    try {
        const { jwtoken } = req.cookies;
        if (!jwtoken) return res.status(401).json({ tag: "token", message: "User is not authenticated" });
        const tokenData = Token.findOne({ token: jwtoken });
        if (!tokenData) return res.status(401).json({ tag: "token", message: "User is not authenticated" });
        if (tokenData.expires_at <= Date.now()) return res.status(401).json({ tag: "token", message: "Token is expired" });
        next();
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}

module.exports = { CheckUserAuth }