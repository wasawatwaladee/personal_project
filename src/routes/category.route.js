import {Router} from 'express';
import { createCategory, listCategory, removeCategory } from '../controllers/category.controller.js';
import { adminCheck, authCheck } from '../middlewares/authcheck.middleware.js';

const categoryRoute = Router();

categoryRoute.post('/category',authCheck,adminCheck,createCategory)
categoryRoute.get('/category',listCategory)
categoryRoute.delete('/category/:id',authCheck,adminCheck,removeCategory)


export default categoryRoute;