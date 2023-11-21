import jwt from "jsonwebtoken";
import Vet from "../models/Vet.js"

const authMiddleware = async (req, res, next) => {
let token;

if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
) {
try {
  token = req.headers.authorization.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.vet= await Vet.findById(decoded.id).select("-password -token -confirmed");

return next()
} catch (error) {
    const e = new Error("Invalid Token");
  return  res.status(403).json({msg: e.message});
    
}
} 
if(!token) {
    const e = new Error("Invalid Token");
    res.status(404).json({msg: e.message})
}

next();
}

export default authMiddleware