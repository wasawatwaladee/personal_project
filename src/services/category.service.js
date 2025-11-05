import prisma from "../config/prisma.config.js"

export const createCate = async(name)=>{
    const category = await prisma.category.create({
       data:{name} 
    })
return category
}

export const getCategory = async()=>{
    const category = await prisma.category.findMany()
    return category
}

export const removeCate = async(id)=>{
    const category = await prisma.category.delete({
        where:{id:Number(id)}
    })
    return category
}