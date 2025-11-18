import createHttpError from "http-errors"
import { changeUserRole, changeUserStatus, getUser } from "../services/user.service.js"
import prisma from "../config/prisma.config.js"

export const listUsers = async(req,res)=>{
    try {
        const users = await getUser()
        res.json({users})
       
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

export const changeStatus = async(req,res,next)=>{
    try {
        const {id,enabled}  = req.body
       const user = await changeUserStatus(id,enabled)
       res.json(
        {message:"Update status success",
        user
    }
    )
    } catch (err) {
        console.log(err)
        throw next(createHttpError[500]("Server error"))
    }
}

export const changeRole = async(req,res,next)=>{
    try {
       const {id,role}  = req.body
       const user = await changeUserRole(id,role)
       res.json(
        {message:"Update role success",
        user
    }
    )
    } catch (err) {
        console.log(err)
        throw next(createHttpError[500]("Server error"))
    }
}

export const userCart = async(req,res,next)=>{
    try {
        const {cart} = req.body
        const id = req.userId
        console.log('req.userId', req.userId)
        console.log('id', id)
        const user = await prisma.user.findFirst({
            where:{id:Number(id)}
        })
        console.log('user', user)


        //Check quantity
        for(const item of cart){

        const product = await prisma.product.findUnique({
          where:{id:item.id},
          select:{quantity:true,title:true}  
        })
    

        if(!product || item.count > product.quantity){
            return res.status(400).json({
                message:`Sorry Product ${product?.title || 'product'} is out of stock`
            })
        }

    }
        //Delete old Cart item
        await prisma.productOnCart.deleteMany({
            where:{
                cart:{orderedById:user.id}
            }
        })

        //Delete old Cart 
         await prisma.cart.deleteMany({
            where:{orderedById:user.id}
        })

        //เตรียมสินค้า loop
        let products = cart.map(item=>({
            productId:item.id,
            count:item.count,
            price:item.price
        }))
        console.log('products', products)

        //หาผลรวม
        let cartTotal = products.reduce((sum,item)=>
            sum+item.price*item.count,0)
        console.log('cartTotal', cartTotal)

        //New cart
        const newCart = await prisma.cart.create({
            data:{
                products:{
                    create:products
                },
                cartTotal:cartTotal,
                orderedById:user.id
            }
        })
        console.log('newCart', newCart)

        res.json("Test userCart pass")
    } catch (err) {
        console.log(err)
        throw next(createHttpError[500]("Server error"))
    }
}

export const getUserCart = async(req,res)=>{
    try {
        const id = req.userId
        
        const cart = await prisma.cart.findFirst({
            where:{
                orderedById:Number(id)
            },
            include:{
                products:{
                    include:{
                        product:true
                    }
                }
            }
        })
        console.log('cart from getUserCart', cart)
        res.json({
            products:cart.products,
            cartTotal:cart.cartTotal
        })
    } catch (err) {
        console.log(err)
        throw next(createHttpError[500]("Server error"))
    }
}

export const emptyCart = async(req,res,next)=>{
    try {
        const id = req.userId
        const cart = await prisma.cart.findFirst({
            where:{orderedById:Number(id)}
        })
        if(!cart){
            return res.status(400).json({message:'No cart'})
        }

         //Delete old Cart item
        await prisma.productOnCart.deleteMany({
            where:{cartId:cart.id}
            
        })

        //Delete old Cart 
        const result= await prisma.cart.deleteMany({
            where:{orderedById:Number(id)}
        })


        console.log('result', result)
        console.log('cart from emptyCart', cart)
        res.json({
            message:"Cart Empty Success",
            deletedCount:result.count
        })
    } catch (err) {
        console.log(err)
        throw next(createHttpError[500]("Server error"))
    }
}
export const saveAddress = async(req,res,next)=>{
    try {
        const {address} = req.body
        const id = req.userId
        const addressUser = await prisma.user.update({
            where:{
                id:Number(id)
            },
            data:{
                address:address
            }
        })
        res.json({message:"Update address success",
            address
        })
    } catch (err) {
        console.log(err)
        throw next(createHttpError[500]("Server error"))
    }
}
export const saveOrder = async(req,res,next)=>{
    try {
        const{id,amount,status,currency}= req.body.paymentIntent
        console.log(id)
        const userId = req.userId
        const userCart = await prisma.cart.findFirst({
            where:{
                orderedById:Number(userId)
            },
            include:{
                products:true
            }
        }) 
        // console.log('userCart from saveOrder', userCart)
        //Check Cart Empty
        if(!userCart || userCart.products.length===0){
        throw next(createHttpError[400]("Cart is Empty"))
        }

        //Check quantity
    //     for(const item of userCart.products){

    //     const product = await prisma.product.findUnique({
    //       where:{id:item.productId},
    //       select:{quantity:true,title:true}  
    //     })
        
    //     // console.log('item from saveOrder', item)
    //     // console.log('product from saveOrder', product)

    //     if(!product || item.count > product.quantity){
    //         return res.status(400).json({
    //             message:`Sorry Product ${product?.title || 'product'} is out of stock`
    //         })
    //     }

    // }

    const amountTHB = Number(amount)/100

    //Create a new Order
    const order = await prisma.order.create({
        data:{
            products:{
                create:userCart.products.map(item=>({
                    productId:item.productId,
                    count:item.count,
                    price:item.price
                }))
            },
            orderedBy:{
                connect:{id:userId}
            },
            cartTotal:userCart.cartTotal,
            stripePaymentId:id,
            amount:amountTHB,
            status:status,
            currency:currency
        }
    })
    console.log('order', order)
    //Update Product
    console.log('userCart', userCart)
    const update = userCart.products.map((item)=>({
        where:{id:item.productId},
        data:{
            quantity:{decrement:item.count},
            sold:{increment:item.count}
        }
    }))
        console.log('update', update)

        await Promise.all(
            update.map((updated)=>prisma.product.update(updated))
        )

        await prisma.cart.deleteMany({
            where:{orderedById:Number(userId)}
        })

        res.json({message:"saveOrder is done",
            order
        })
    } catch (err) {
        console.log(err)
        throw next(createHttpError[500]("Server error"))
    }
}

export const getOrder = async(req,res)=>{
    try {
        const id = req.userId
        const orders = await prisma.order.findMany({
            where:{orderedById:Number(id)},
            include:{
                products:{
                    include:{
                        product:true
                    }
                }
            }
        })
        // console.log('orders', orders)
        if(orders.length === 0 ){
            return res.status(400).json({
                message:"No orders"
            })
        }
        res.json({orders})
    } catch (err) {
        console.log(err)
        throw next(createHttpError[500]("Server error"))
    }
}