import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import authRoute from './routes/auth.route.js';
import rateLimit from 'express-rate-limit';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import categoryRoute from './routes/category.route.js';
import productRoute from './routes/product.route.js';
import userRoute from './routes/user.route.js';
import adminRoute from './routes/admin.route.js';
import stripeRoute from './routes/stripe.js';




const app = express();
app.use(morgan('dev'));
app.use(rateLimit({
    windowMs:3*60*1000,  
    max:1000
}));
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(express.json());

// Homepage
app.get('/',(req,res)=>{
    res.send("Hello from homepage");
})
//Routes
app.use('/api',authRoute);
app.use('/api',categoryRoute);
app.use('/api',productRoute)
app.use('/api',userRoute)
app.use('/api',adminRoute)
app.use('/api',stripeRoute)

//Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;