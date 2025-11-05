import prisma from "../config/prisma.config.js"
import { createProd, deleteProd, getProd, getProdById, sortProd, updateProd } from "../services/product.service.js"

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

export const listProduct = async(req,res)=>{
    try {
        const {count} = req.params  
        const product = await getProd(count)  
        res.json({product})
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
    } catch (error) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

export const updateProduct = async(req,res)=>{
    try {
        const {title,description,price,quantity,categoryId,images} = req.body
        const {id} = req.params

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
        const product = await deleteProd(id)
        res.json({message:`Delete success`,product})
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
    } catch (error) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}
export const searchFilters = async(req,res)=>{
    try {
        const {query,category,price} = req.body
        if(query){
            console.log('query', query)
        }
        if(category){
            console.log('category', category)
        }
        if(price){
            console.log('price', price)
        }
        res.send('search filters ok')
    } catch (error) {
        console.log(err)
        res.status(500).json({message:"Server error"}) 
    }
}