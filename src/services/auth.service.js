import prisma from "../config/prisma.config.js"
import bcrypt from "bcryptjs"

export const getUserBy= async(identityKey,identity)=>{
    return await prisma.user.findUnique({
        where:{[identityKey]:identity}
    })
}

export const createUser = async(user)=>{
    const {password} = user;
    const hash = await bcrypt.hash(password,5);
    const newUser = {...user,password:hash};
    return await prisma.user.create({
        data:newUser
    })
}

export const verifyBy = async(data,identityKey)=>{
    const versifyUser = await prisma.user.findFirst({
        where:{[identityKey]:data.identity}
    })
    console.log("data from verifyBy",data)
    // console.log("data.password from verifyBy",data.password)
    // console.log("user.password from verifyBy",user.password)
    if(!versifyUser) return null;
    const isMatch = await bcrypt.compare(data.password,versifyUser.password)
    return isMatch?versifyUser:null

}