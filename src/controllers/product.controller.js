import { createProd, deleteProd, getProd } from "../services/product.service.js"

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

export const removeProduct = async(req,res)=>{
    try {
        const {id} = req.params
        const product = await deleteProd(id)
        res.json({product})
    } catch (err) {
         console.log(err)
        res.status(500).json({message:"Server error"})
    }
}
export const listByProduct = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
export const searchFilters = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}