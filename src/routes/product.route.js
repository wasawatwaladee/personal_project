import { Router } from "express";
import { createImages, createProduct, listByProduct, listProduct, listProductById, removeImage, removeProduct, searchFilters, updateProduct } from "../controllers/product.controller.js";
import { adminCheck, authCheck } from "../middlewares/authcheck.middleware.js";


const productRoute = Router();

productRoute.post('/product',createProduct)
// productRoute.get('/products/:count',listProduct) 
productRoute.get('/products/',listProduct) 
productRoute.get('/product/:id',listProductById) 
productRoute.put('/product/:id',updateProduct)
productRoute.delete('/product/:id',removeProduct)
productRoute.post('/productby',listByProduct)
productRoute.post('/search/filters',searchFilters)

productRoute.post('/images/',authCheck,adminCheck,createImages)
productRoute.post('/removeimages',authCheck,adminCheck,removeImage)

export default productRoute;