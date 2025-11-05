    import jwt from "jsonwebtoken"

    //sign
    export function generateShopToken(shopId){
        const token = jwt.sign({shopId},
            process.env.SHOP_SECRET_KEY,
            {
            algorithm:"HS256",
            expiresIn:"1h"
            }
        )
        return token
    }

    export function generateUserToken(userId){
        const token = jwt.sign({userId},
            process.env.USER_SECRET_KEY,
            {
            algorithm:"HS256",
            expiresIn:"15D"
            }
        )
        return token
    }

    export function verifyUserToken(token){
        const payload = jwt.verify(token,process.env.USER_SECRET_KEY)
        return payload
    }
    //verify
    export function verifyShopToken(token){
        const payload = jwt.verify(token,process.env.SHOP_SECRET_KEY)
        return payload;
    }