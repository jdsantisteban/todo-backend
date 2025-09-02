const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token)
    return res.status(401).json({ msg: `No token, authrization denied` });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Expect "Bearer <token>"
    req.user = decoded.id; // add user ID to request
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: `Token is not valid` });
  }
}

module.exports = auth;
