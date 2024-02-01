const Products = require("../models/product.model");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
    const createProduct = await Products.create(req.body);
    return res.status(200).json({
        success: true,
        data: createProduct
    })
});

//Get all products 
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    // const resultPerPage = 4;
    const productsPromise = new ApiFeatures(Products.find(), req.query)
    // console.log("product promise:", productsPromise)
        .search()
        .filter()
        .pagination()

    const products = await productsPromise;
    // console.log(products)

    // console.log('Products:', products);

    res.status(200).json({
        success: true,
        
        products,
        count: products ? products.length : 0
    });
});



// Get singe product details
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Products.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    res.status(200).json({
        success: true,
        product,
        // productCount
    })

})

//update product --- admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Products.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    });
    res.status(200).json({
        success: true,
        product
    })
})

// Delete a product
exports.removeProduct = catchAsyncErrors(async (req, res) => {

    const productId = req.params.id;
    const removedProduct = await Products.findOneAndDelete(productId);
    res.status(201).json({
        message: 'product deleted',
    })

})