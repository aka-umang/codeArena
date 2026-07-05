const jwt = require('jsonwebtoken');
const User=require('../models/user')
const redisClient=require("../config/redis")
const userMiddleware=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token)
            throw new Error('Token not found');
        const payload = jwt.verify(token,process.env.JWT_KEY)
        const{id} = payload;
        if(!id)
            throw new Error('Invalid token');
        const result = await User.findById(id);
        if(!result)
            throw new Error('User not found');



        //Redis ke blocklist me token check karna hai
        //agar token blocklist me hai to error throw karna hai
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked)
            throw new Error('Token is blocked');

        req.user=result;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).send("error: "+err);
    }
}
module.exports=userMiddleware;