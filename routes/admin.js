const express = require('express');
const {body} = require('express-validator');
const router = express.Router();

const adminController = require('../controller/admin');


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
router.post('/user',adminController.createUser);
router.get('/users',adminController.getUsers);
router.get('/user/:userId',adminController.getUser);
router.delete('/user/:userId',adminController.deleteUser);
router.put('/user/:userId',adminController.updateUser);

//Size
router.post('/size',adminController.createSize);
router.get('/sizes',adminController.getSizes);
router.get('/size/:sizeId',adminController.getSize);
router.delete('/size/:sizeId',adminController.deleteSize);
router.put('/size/:sizeId',adminController.updateSize);

//Color
router.post('/color',adminController.createColor);
router.get('/colors',adminController.getColors);
router.get('/color/:colorId',adminController.getColor);
router.put('/color/:colorId',adminController.updateColor);
router.delete('/color/:colorId',adminController.deleteColor);

//Brand
router.post('/brand',adminController.createBrand);
router.get('/brands',adminController.getBrands);
router.get('/brand/:brandId',adminController.getBrand);
router.put('/brand/:brandId',adminController.updateBrand);
router.delete('/brand/:brandId',adminController.deleteBrand);

// Category
router.post('/category',adminController.createCategory);
router.get('/categories',adminController.getCategories);
router.get('/category/:categoryId',adminController.getCategory);
router.put('/category/:categoryId',adminController.updateCategory);
router.delete('/category/:categoryId',adminController.deleteCategory);

//Product
router.post('/product',adminController.createProduct);
router.put('/product/:productId',adminController.updateProduct);
router.get('/products',adminController.getProducts);
router.get('/product/:productId',adminController.getProduct);
router.delete('/product/:productId',adminController.deleteProduct);

module.exports = router;
