const express = require('express');
const { createProduct, getAllProducts, updateProduct, removeProduct, getSingleProduct } = require('../controllers/product.controller');
const { isAuthenticatedUser, isAuthorizedRole } = require('../middlewares/auth');
const router = express.Router();

//create product routes
router.route('/product/create').post(isAuthenticatedUser,createProduct)

//get all products -- admin
router.route('/product/view').get( getAllProducts)

// get one product by id --  admin
router.route('/product/view/:id').get(getSingleProduct)

//update product -- admin
router.route('/product/update/:id').post(isAuthenticatedUser,isAuthorizedRole("admin"),  updateProduct)

// delete a roduct -- admin
router.route('/product/delete/:id').delete(isAuthenticatedUser,isAuthorizedRole("admin"),  removeProduct)



module.exports  = router