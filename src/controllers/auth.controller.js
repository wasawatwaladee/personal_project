import createHttpError from "http-errors";
import { loginSchema, registerSchema } from "../validations/schema.js"
import { createUser, getUserBy, verifyBy,  } from "../services/auth.service.js";
import { generateUserToken } from "../utils/jwt.util.js";
import prisma from "../config/prisma.config.js";


export const register = async(req, res,next) => {
    const {identity,firstName,lastName,password,confirmPassword} = req.body 

    //validation
    const user = registerSchema.parse(req.body);
    const identityKey = user.email? 'email':'mobile';
    console.log('user', user)
   
    //verify same user register
    const haveUser = await getUserBy(identityKey,identity);
    console.log('haveUser', haveUser)
    if(haveUser){
        return next(createHttpError[409]('This user already exists'));
    }

    const newUser = await createUser(user);
    res.status(200).json({
        success:true,
        message:'Register successfully',
        data:newUser
    }) 
    
    

}   

export const login = async(req,res,next)=>{
    const { identity, password } = req.body
    const user = loginSchema.parse(req.body)
    const identityKey = user.email ? 'email' : 'mobile'
    
    console.log('user from loginSchema', user)
    
    const verifyUser = await verifyBy(user,identityKey);
    console.log('verifyUser from controller', verifyUser)
    if(!verifyUser || !verifyUser.enabled){
        return next(createHttpError[404]('User not found'));
    }
    
    //Create Token
    const token = generateUserToken(verifyUser.id);
    // console.log('token', token)
    
    res.json({
        verifyUser,
        token
    });
}

export const currentUser = async(req,res,next)=>{
    try {
        const id = req.userId
        // console.log('id', id)
        const user = await prisma.user.findFirst({
            where:{id},
            select:{
            id:true,
            firstName:true,
            lastName:true,
            role:true
        }
        }
        
    )
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "User verified",
      user,
    });

    } 
    catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



