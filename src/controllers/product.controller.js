import { tr } from "zod/locales"
import prisma from "../config/prisma.config.js"
import { createProd, deleteProd, getProd, getProdById, sortProd, updateProd } from "../services/product.service.js"
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
})




export const createProduct = async(req,res)=>{
    try {
        const {title,description,price,quantity,categoryId,images} = req.body
        const product = await createProd(req.body)
        res.json({product})
        
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}



// export const listProduct = async(req,res)=>{
//     try {
//         const {count} = req.params  
//         const product = await getProd(count)  
//         res.json(product)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({message:"Server error"})
//     }
// }

export const listProduct = async(req,res)=>{
    try {
       
        const product = await getProd()  
        res.json(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

export const listProductById = async(req,res)=>{
    const {id} = req.params
    try {
        const product = await getProdById(id)
        res.json({product})
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

export const updateProduct = async(req,res)=>{
    try {
        const {title,description,price,quantity,categoryId,images} = req.body
        const {id} = req.params
        console.log('id from update', id)
        //clear images ก่อนเมื่อกด update(Admin)
        await prisma.image.deleteMany({
            where:{
                productId:Number(id)
            }
        })

        const product = await updateProd(id,req.body)
        res.json({product})
        
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

export const removeProduct = async(req,res)=>{
    try {
        const {id} = req.params
        console.log('id from remove', id)
        //ลบรูปภาพใน cloudinary
        //step 1 หาสินค้าในฐานข้อมูล include images
        const product = await prisma.product.findFirst({
            where:{id:Number(id)},
            include:{
                images:true
            }
        })
        if(!product){
            return res.status(400).json({message:"Product not found"})
        }
        //step2 Promise ลบรูปภาพบน cloudinary
        const deleteImage = product.images.map((image)=>
        new Promise((resolve,reject)=>{
            //ลบจาก cloud
            cloudinary.uploader.destroy(image.public_id,(error,result)=>{
                if(error){
                    reject(error)
                }else{

                    resolve(result)
                }
            })
        })
        )
        await Promise.all(deleteImage)

        //step3 ลบสินค้าออกจาก db
        const newProduct = await deleteProd(id)
        res.json({message:`Delete success`,newProduct})
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}
export const listByProduct = async(req,res)=>{
    try {
         const{sort,order,limit}=req.body
         console.log('sort,order,limit', sort,order,limit)
         const products = await sortProd(sort,order,limit)
         res.json({products})
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

const hdlQuery=async(req,res,query)=>{
    try {
        const product = await prisma.product.findMany({
            where:{
                title:{
                    contains:query
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.json({product})
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Search error"})
    }
}

const hdlPrice = async(req,res,priceRange)=>{
    try {
        const product = await prisma.product.findMany({
            where:{
                price:{
                    gte:priceRange[0],
                    lte:priceRange[1]
                }
            },
            include:{
                category:true,
                images:true
            }

        })
        res.json({product})
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

const hdlCategory = async(req,res,categoryId)=>{
    try {
        const product = await prisma.product.findMany({
            where:{
                categoryId:{
                    in:categoryId.map((id)=>Number(id))
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.json({product})
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
   
}
export const searchFilters = async(req,res)=>{
    try {
        const {query,category,price} = req.body
        if(query){
            await hdlQuery(req,res,query)
        }
        if(category){
            await hdlCategory(req,res,category)
        }
        if(price){
            await hdlPrice(req,res,price)
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"}) 
    }
}






export const createImages = async(req,res)=>{

    console.log('req.body', req.body)
    try {
        // await prisma.image.create({
        //     data
        // })
        const result = await cloudinary.uploader.upload(req.body.images,{
            public_id: `${Date.now()}`,
            resource_type:'auto',
            folder:'Personal_project'
        })
        res.json({result})
        // res.send(result)
        // res.send('test createImage')
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server Error"})
    }
}
export const removeImage = async(req,res)=>{
    try {
        // console.log(req.body.public_id)
        const {public_id} = req.body
       await cloudinary.uploader.destroy(public_id,(result)=>{
            res.send(result)
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server Error"})
    }
}