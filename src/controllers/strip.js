import prisma from "../config/prisma.config.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const payment = async(req,res)=>{
    try {

        const cart = await prisma.cart.findFirst({
            where:{orderedById:Number(req.userId)}
        })
        console.log('cart',cart)

        const amountTHB = cart.cartTotal * 100 
       

    const paymentIntent = await stripe.paymentIntents.create({
    amount: amountTHB,
    currency: "thb",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    }})
   

    
    
   res.send({
    clientSecret: paymentIntent.client_secret,
  });

    
       
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}


