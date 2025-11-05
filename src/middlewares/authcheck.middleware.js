import createHttpError from "http-errors";
import { verifyUserToken } from "../utils/jwt.util.js";
import prisma from "../config/prisma.config.js";

export const authCheck = async(req,res,next)=>{
      const authHeader =  req.headers.authorization;
    if(!authHeader){
        throw  createHttpError(401,"Invalid credentials")   
    }
    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyUserToken(token)
        console.log('payload from authcheck', payload)
        req.userId = payload.userId
        
        const user = await prisma.user.findUnique({
            where:{id:req.userId}
        })
        console.log('user',user)
        
        if(!user.enabled){
            next(createHttpError[400]('This account cannot access'))
        }
        next()
    } catch (err) {
        console.log(err)
       next(createHttpError[500]('Token invalid')) 
    }
}