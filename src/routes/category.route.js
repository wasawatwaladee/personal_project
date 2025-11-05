import {Router} from 'express';
import { createCategory, listCategory, removeCategory } from '../controllers/category.controller.js';

const categoryRoute = Router();

categoryRoute.post('/category',createCategory)
categoryRoute.get('/category',listCategory)
categoryRoute.delete('/category/:id',removeCategory)


export default categoryRoute;