import { Router } from "express";
import { authCheck } from "../middlewares/authcheck.middleware.js";
import { payment } from "../controllers/strip.js";

const stripeRoute = Router();

stripeRoute.post('/user/create-payment-intent',authCheck,payment)


export default stripeRoute;