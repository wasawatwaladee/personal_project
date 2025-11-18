import { success } from "zod"

export const errorMiddleware = (err,req,res,next)=>{
     console.log(err.message)
   
   if(err.name === "ZodError"){
    return res.status(400).json({
        success:false,
         errors:err.issues
    })
   }
   
   
     res.status(err.status || 500)
    .json({
        status:err.status || 500,
        message: err.message || 'Internal Server Error'
    })
}