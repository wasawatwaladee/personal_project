import createHttpError from "http-errors";
import { loginSchema, registerSchema } from "../validations/schema.js"
import { createUser, getUserBy, verifyBy,  } from "../services/auth.service.js";
import { generateUserToken } from "../utils/jwt.util.js";


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
    
    console.log('user', user)
    //check user
    // const loginUser = await getUserBy(identityKey,identity);
    // if(!loginUser){
    //     return next(createHttpError[404]('User not found'));
    // }
    
    //Password checked
    const verifyUser = await verifyBy(user,identityKey);
    if(!verifyUser || !verifyUser.enabled){
        return next(createHttpError[404]('User not found'));
    }
    
    //Create Token
    const token = generateUserToken(verifyUser.id);

    console.log('user from login', user);
    console.log('verifyUser', verifyUser)
    res.json({
        verifyUser,
        token
    });
}

export const currentUser = async(req,res,next)=>{
    try {
        res.send("Current User ok")
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message:"Server error"
        })
    }
}



