import { Router } from "express";
import { listUsers } from "../controllers/user.controller.js";
import { authCheck } from "../middlewares/authcheck.middleware.js";

const userRoute = Router();

userRoute.get('/users',authCheck,listUsers)
userRoute.post('/change-status',()=>{})
userRoute.post('/change-role',()=>{})
userRoute.post('/user/cart',()=>{})
userRoute.get('/user/cart',()=>{})
userRoute.delete('/user/cart',()=>{})
userRoute.post('/user/address',()=>{})
userRoute.post('/user/order',()=>{})
userRoute.get('/user/order',()=>{})


export default userRoute