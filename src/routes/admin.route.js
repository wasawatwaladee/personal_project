import { Router } from "express";
import { authCheck } from "../middlewares/authcheck.middleware.js";
import { changeOrderStatus, getOrderAdmin } from "../controllers/admin.controller.js";

const adminRoute = Router();

adminRoute.put('/admin/order-status',authCheck,changeOrderStatus)
adminRoute.get('/admin/orders',authCheck,getOrderAdmin)


export default adminRoute;