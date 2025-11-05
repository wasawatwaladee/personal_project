import { Router } from "express";
import { currentUser, login, register } from "../controllers/auth.controller.js";

const authRoute = Router();

//Routes
authRoute.post('/register', register)
authRoute.post('/login', login)
// authRoute.post('/me', authenMiddleware,me)

authRoute.post('/current-user',currentUser)
authRoute.post('/current-admin',currentUser)

export default authRoute;