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
        // console.log('payload from authcheck', payload)
        req.userId = payload.userId
        // console.log('payload', payload)
        
        const user = await prisma.user.findUnique({
            where:{id:req.userId}
        })
        // console.log('payload', payload)
        // console.log('user',user)
        // console.log('req.user', req.user)
        
        if(!user.enabled){
            next(createHttpError[400]('This account cannot access'))
        }
        next()
    } catch (err) {
        console.log(err)
       next(createHttpError[500]('Token invalid')) 
    }
}

export const adminCheck = async(req,res,next)=>{
    try {
        const id = req.userId 
        // console.log('id', id)
        const adminUser = await prisma.user.findFirst({
            where:{id}
        })
        if(!adminUser || adminUser.role !== 'admin'){
            return next(createHttpError[403]("Access denied:Admin only"))
        }
        // console.log('admincheck', adminUser)
        next()
    } catch (err) {
        console.log(err)
        throw createHttpError(500,"Admin access denied")
    }
}