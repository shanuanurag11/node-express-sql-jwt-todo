import jwt from 'jsonwebtoken';

function authMiddleWare(req, res, next){
const token = req.headers.authorization

if(!token){
    return  res.status(401).json({error: "Authorization header required"})
}

const jwtToken = token;
try{
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
}catch(err){
    return res.status(401).json({error: "Invalid token"})
}
}

export default authMiddleWare;
