const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verify = async (req, res, next) => {
  const token = req.headers.authorization;
  !token && res.status(403).json("Please provide a valid token");

  //token expiry check
  const now = Math.floor(Date.now() / 1000);
  const decodedToken = jwt.decode(token);
  const exp = decodedToken.exp;
  if (now > exp) {
    return res.status(500).json("Your token has expired. Please login again.");
  }

  //verify token
  jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedToken.id);
  req.user = user;
  next();
};

const verifyAndAuthenticate = (req, res, next) => {
    verify(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(401).json("You are not allowed to enter this section.")
        }
    })
}

const verifyAndAdmin = (req, res, next) => {
    verify(req, res, () => {
        if(req.user.isAdmin) {
            next();
        } else {
            res.status(401).json("You are not allowed to enter this section.")
        }
    })
}

module.exports = { verify, verifyAndAuthenticate, verifyAndAdmin };
