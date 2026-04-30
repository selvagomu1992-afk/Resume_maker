import jwt from 'jsonwebtoken'

const adminProtect = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default adminProtect;
