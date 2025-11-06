import createHttpError from "http-errors"

export const changeOrderStatus = async(req,res,next)=>{
    try {
        res.send('change')
    } catch (err) {
        console.log(err)
        return next(createHttpError[500]('Server error'))
    }
}

export const getOrderAdmin=async(req,res,next)=>{
    try {
        res.send('get order')
    } catch (err) {
        console.log(err)
        return next(createHttpError[500]('Server error'))
    }
}