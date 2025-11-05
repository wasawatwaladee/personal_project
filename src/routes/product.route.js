import { Router } from "express";
import { createProduct, listByProduct, listProduct, removeProduct, searchFilters } from "../controllers/product.controller.js";

const productRoute = Router();

productRoute.post('/product',createProduct)
productRoute.get('/products/:count',listProduct)
productRoute.delete('/product/:id',removeProduct)
productRoute.post('/productby',listByProduct)
productRoute.post('/search/filters',searchFilters)

export default productRoute;