const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
   let reqUser = null;
   
   if (!token) {
      return null;
   }
   const accessToken = token.split('Bearer')[1].trim();
   console.log(accessToken)
   jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {

      if (err) {
         return null;
      }
      reqUser = user;
   })
   return reqUser;
}

const verifyUser = (req, res, next) => {
   try {
      console.log(req.headers)
      const user = verifyToken(req.headers.authorization);

      console.log(user)

      if (user && (user.role === 'user' || user.role === 'admin')) {
         next()
      }
      else {
         return res.status(401).json({ success: false, message: "Please Login!" })
      }
   }
   catch (error) {
      res.status(500).json({ success: false, message: error.message,error })
   }
}

const verifyAdmin = (req, res, next) => {
   try {
      const user = verifyToken(req.headers.authorization);
      console.log(user)
      if (user && user.role === 'admin') {
         next();
      }
      else {
         return res.status(401).json({ success: false, message: "You are not admin" })
      }
   }
   catch (error) {
      res.status(500).json({ success: false, message: error })
   }

}
module.exports = { verifyUser, verifyToken, verifyAdmin };