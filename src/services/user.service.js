import prisma from "../config/prisma.config.js"

export const getUser=async()=>{
    const users = prisma.user.findMany({
        omit:{
           password:true, 
        }
    })
    return users
}
export const changeUserStatus=async(id,enabled)=>{
    const user = prisma.user.update({
        where:{id:Number(id)},
        data:{
            enabled:enabled
        }  
    })

    return user
}
export const changeUserRole=async(id,role)=>{
    const user = prisma.user.update({
        where:{id:Number(id)},
        data:{
           role:role
        }  
    })

    return user
}
