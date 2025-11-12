import createHttpError from "http-errors"
import prisma from "../config/prisma.config.js"
import { includes } from "zod"

export const changeOrderStatus = async(req,res,next)=>{
    try {
        const {orderId,orderStatus} = req.body
        const orderUpdate = await prisma.order.update({
            where:{id:orderId},
            data:{orderStatus:orderStatus}
        })
        res.json({orderUpdate})
    } catch (err) {
        console.log(err)
        return next(createHttpError[500]('Server error'))
    }
}
export const getOrderAdmin=async(req,res,next)=>{
    try {
        const orders = await prisma.order.findMany({
            include:{
                products:{
                    include:{
                        product:true
                    }
                },
                orderedBy:{
                    omit:{
                        password:true
                    }
                }
            }
        })
        
        res.json({orders})
    } catch (err) {
        console.log(err)
        return next(createHttpError[500]('Server error'))
    }
}