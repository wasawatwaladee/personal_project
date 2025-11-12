import { Router } from "express";
import { createProduct, listByProduct, listProduct, listProductById, removeProduct, searchFilters, updateProduct } from "../controllers/product.controller.js";


const productRoute = Router();

productRoute.post('/product',createProduct)
productRoute.get('/products/:count',listProduct) //
productRoute.get('/product/:id',listProductById) //
productRoute.put('/product/:id',updateProduct)
productRoute.delete('/product/:id',removeProduct)
productRoute.post('/productby',listByProduct)
productRoute.post('/search/filters',searchFilters)

export default productRoute;