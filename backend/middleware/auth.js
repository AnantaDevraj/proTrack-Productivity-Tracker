import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token exists and follows "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided. Authorization denied.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Attach user ID to the request object
    next(); // Continue to the next middleware or route
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ msg: 'Invalid token. Authorization denied.' });
  }
};

export default auth;
