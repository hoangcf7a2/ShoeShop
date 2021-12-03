const express = require('express');
const {body} = require('express-validator');
const router = express.Router();

const adminController = require('../controller/admin');
const isAuth = require('../middleware/is-auth');

/**
 * @swagger
 * paths:
 *   /admin/user:
 *     post:
 *      description: Create a new user
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *      responses:
 *         '201':
 *          description: OK
 *         '500':
 *          description: Error
 */
router.post('/user',isAuth,adminController.createUser);
router.get('/users',isAuth,adminController.getUsers);
router.get('/user/:userId',isAuth,adminController.getUser);
router.delete('/user/:userId',isAuth,adminController.deleteUser);
router.put('/user/:userId',isAuth,adminController.updateUser);

//Size
router.post('/size',isAuth,adminController.createSize);
router.get('/sizes',isAuth,adminController.getSizes);
router.get('/size/:sizeId',isAuth,adminController.getSize);
router.delete('/size/:sizeId',isAuth,adminController.deleteSize);
router.put('/size/:sizeId',isAuth,adminController.updateSize);

//Color
router.post('/color',isAuth,adminController.createColor);
router.get('/colors',isAuth,adminController.getColors);
router.get('/color/:colorId',isAuth,adminController.getColor);
router.put('/color/:colorId',isAuth,adminController.updateColor);
router.delete('/color/:colorId',isAuth,adminController.deleteColor);

//Brand
router.post('/brand',isAuth,adminController.createBrand);
router.get('/brands',isAuth,adminController.getBrands);
router.get('/brand/:brandId',isAuth,adminController.getBrand);
router.put('/brand/:brandId',isAuth,adminController.updateBrand);
router.delete('/brand/:brandId',isAuth,adminController.deleteBrand);

// Category
router.post('/category',isAuth,adminController.createCategory);
router.get('/categories',isAuth,adminController.getCategories);
router.get('/category/:categoryId',isAuth,adminController.getCategory);
router.put('/category/:categoryId',isAuth,adminController.updateCategory);
router.delete('/category/:categoryId',isAuth,adminController.deleteCategory);

//Product
router.post('/product',isAuth,adminController.createProduct);
router.put('/product/:productId',isAuth,adminController.updateProduct);
router.get('/products',adminController.getProducts);
router.get('/product/:productId',adminController.getProduct);
router.delete('/product/:productId',isAuth,adminController.deleteProduct);

// Order
router.put('/order/:orderId',isAuth,adminController.updateOrder);
router.get('/orders',isAuth,adminController.getOrders);
router.get('/order/:orderId',isAuth,adminController.getOrder);
module.exports = router;
