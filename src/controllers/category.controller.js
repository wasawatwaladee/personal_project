import { createCate, getCategory, removeCate } from "../services/category.service.js"


export const createCategory =async(req,res)=>{
    const {name} = req.body
    
    // console.log('name from controller', name)
    try {
       const category = await createCate(name)
       res.json({category})
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}
export const listCategory =async(req,res)=>{
    
    try {
       const category = await getCategory()
       res.json(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}
export const removeCategory =async(req,res)=>{
    const {id} = req.params
    console.log('id', id)
    try {
        const category = await removeCate(id)
        res.json({category})
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}