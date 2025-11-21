// backend/middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
    // For development purposes, we'll simulate authentication
    // In production, you would verify JWT tokens here
    
    // Mock user object - replace with actual authentication logic
    req.user = {
        id: 1,
        name: 'Supervisor User',
        email: 'supervisor@afyatrack.com',
        role: 'supervisor',
        location: 'Nairobi'
    };
    
    next();
    
    // In production, this would look like:
    /*
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
    */
};

module.exports = authMiddleware;