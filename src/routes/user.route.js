import { Router } from "express";
import { changeRole, changeStatus, emptyCart, getOrder, getUserCart, listUsers, saveAddress, saveOrder, userCart } from "../controllers/user.controller.js";
import { adminCheck, authCheck } from "../middlewares/authcheck.middleware.js";

const userRoute = Router();

userRoute.get('/users',authCheck,adminCheck,listUsers)
userRoute.post('/change-status',authCheck,adminCheck,changeStatus)
userRoute.post('/change-role',authCheck,adminCheck,changeRole)
userRoute.post('/user/cart',authCheck,userCart)
userRoute.get('/user/cart',authCheck,getUserCart)
userRoute.delete('/user/cart',authCheck,emptyCart)
userRoute.post('/user/address',authCheck,saveAddress)
userRoute.post('/user/order',authCheck,saveOrder)
userRoute.get('/user/order',authCheck,getOrder)


export default userRoute