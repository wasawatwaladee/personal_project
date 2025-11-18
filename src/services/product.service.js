import { tr } from "zod/locales"
import prisma from "../config/prisma.config.js"

export const createProd = async(data)=>{
    const product = await prisma.product.create({
        data:{
            title:data.title,
            description:data.description,
            price:Number(data.price),
            quantity:Number(data.quantity),
            categoryId:Number(data.categoryId),
            images:{
                create:data.images.map(item=>({
                asset_id : item.asset_id,
                public_id : item.public_id,
                url       : item.url,
                secure_url :item.secure_url  
                }))
            }
        }
    })
    return product
}

// export const getProd = async(count)=>{
//     const product = await prisma.product.findMany({
//         take:Number(count),
//         orderBy:{createdAt:"desc"},
//         include:{
//             category:true,
//             images:true
//         }
//     })
//     return product
// }
export const getProd = async()=>{
    const product = await prisma.product.findMany({
        
        orderBy:{createdAt:"desc"},
        include:{
            category:true,
            images:true
        }
    })
    return product
}
export const getProdById = async(id)=>{
    const product = await prisma.product.findFirst({
        where:{id:Number(id)},
        include:{
            category:true,
            images:true
        }
    })
    return product
}

export const deleteProd= async(id)=>{
    const product = await prisma.product.delete({
        where:{id:Number(id)}
    })
    return product
}

export const updateProd= async(id,data)=>{
    const product = await prisma.product.update({
        where:{id:Number(id)},
        data:{
            title:data.title,
            description:data.description,
            price:Number(data.price),
            quantity:Number(data.quantity),
            categoryId:Number(data.categoryId),
            images:{
                create:data.images.map(item=>({
                asset_id : item.asset_id,
                public_id : item.public_id,
                url       : item.url,
                secure_url :item.secure_url  
                }))
            }
        }
    })
    return product
}

export const sortProd = async(sort,order,limit)=>{
    const products = await prisma.product.findMany({
        take:limit,
        orderBy:{[sort]:order},
        include:{
            category:true
        }
    }) 
    return products
}