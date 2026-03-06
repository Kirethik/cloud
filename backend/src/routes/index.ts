import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller';
import { createOrder, getOrderById, getUserOrders, getAdminStats, getTelemetry } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadImage } from '../controllers/upload.controller';

const router = Router();

// Auth Routes
const authRouter = Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Products Routes
const productRouter = Router();
productRouter.route('/')
    .get(getProducts)
    .post(protect, createProduct); // typically admin. For demo, just protect.

productRouter.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

// Orders Routes
const orderRouter = Router();
orderRouter.route('/')
    .post(protect, createOrder)
    .get(protect, getUserOrders);

orderRouter.route('/:id')
    .get(protect, getOrderById);

// Uploads Routes
const uploadRouter = Router();

// Admin / Telemetry Routes
const adminRouter = Router();
adminRouter.get('/stats', protect, getAdminStats);
adminRouter.get('/telemetry', protect, getTelemetry);

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
uploadRouter.post('/upload-image', protect, upload.single('image'), uploadImage);


router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/admin', adminRouter);
router.use('/', uploadRouter);

export default router;
