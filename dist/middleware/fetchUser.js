"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchUser = (req, res, next) => {
    try {
        req.user = { id: "123" }; // Mock user authentication logic
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};
exports.default = fetchUser;
//# sourceMappingURL=fetchUser.js.map