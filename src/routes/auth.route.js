import { Router } from "express";
import { currentUser, login, register } from "../controllers/auth.controller.js";
import { adminCheck, authCheck } from "../middlewares/authcheck.middleware.js";

const authRoute = Router();

//Routes
authRoute.post('/register', register)
authRoute.post('/login', login)
// authRoute.post('/me', authenMiddleware,me)

authRoute.post('/current-user',authCheck,currentUser)
authRoute.post('/current-admin',authCheck,adminCheck,currentUser)

export default authRoute;