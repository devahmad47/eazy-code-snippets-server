const express = require('express');
const router = express.Router();
const Product = require("../../models/productsModel");
const { deleteFile } = require("../../utils/cloudinary");
router.post('/add-product', async (req, res) => {
    try {
        const { codeUrl, productName, productDescription, price, Rating, categoryType, projectType, projectUrl, productImage1, productImage2, productImage3, productImage4, productImage5,mainPage } = req.body;

        const newProduct = new Product({
            productName,
            productDescription,
            price,
            Rating,
            categoryType,
            projectType,
            projectUrl,
            productImage1,
            productImage2,
            productImage3,
            productImage4,
            productImage5,
            codeUrl,
            mainPage
        });
        await newProduct.save();

        res.status(200).json({ message: 'Successfully added product', newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    }
});






router.put('/:productId/edit-product', async (req, res) => {
    try {
        const { productId } = req.params;
        const { codeUrl, productName, productDescription, price, Rating, categoryType, projectType, projectUrl,productImage1,productImage2,productImage3,productImage4,productImage5,mainPage } = req.body;

        const existingproduct = await Product.findById(productId);
        if (!existingproduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        existingproduct.productName = productName;
        existingproduct.codeUrl = codeUrl;
        existingproduct.productDescription = productDescription;
        existingproduct.price = price;
        existingproduct.Rating = Rating;
        existingproduct.categoryType = categoryType;
        existingproduct.projectType = projectType;
        existingproduct.projectUrl = projectUrl;
        existingproduct.mainPage=mainPage;

        if(productImage1){
            await deleteFile(existingproduct.productImage1);
            existingproduct.productImage1 = productImage1;
        }
        if(productImage2){
            await deleteFile(existingproduct.productImage2);
            existingproduct.productImage2 = productImage2;
        }
        if(productImage3){
            await deleteFile(existingproduct.productImage3);
            existingproduct.productImage3 = productImage3;
        }
        if(productImage4){
            await deleteFile(existingproduct.productImage4);
            existingproduct.productImage4 = productImage4;
        }
        if(productImage5){
            await deleteFile(existingproduct.productImage5);
            existingproduct.productImage5 = productImage5;
        }


        await existingproduct.save();
        res.status(200).json({ message: 'product updated successfully', updatedproduct: existingproduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
});
router.put('/:productId/show-to-home', async (req, res) => {
    try {
        const { productId } = req.params;
        const {mainPage}=req.body
        console.log(mainPage)
        const existingproduct = await Product.findById(productId);
        if (!existingproduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        existingproduct.mainPage = mainPage;
        await existingproduct.save();
        res.status(200).json({ message: 'product updated successfully', updatedproduct: existingproduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
});

router.get("/get-all-products", async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "products not found" });
        }

        res.status(200).json({ message: 'products fetched successfully', products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch all products', error: error.message });
    }
});

router.delete('/:productId/delete-product', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }
        if (product.productImage1) {
            await deleteFile(product.productImage1);
        }
        if (product.productImage2) {
            await deleteFile(product.productImage2);
        }
        if (product.productImage3) {
            await deleteFile(product.productImage3);
        }
        if (product.productImage4) {
            await deleteFile(product.productImage4);
        }
        if (product.productImage5) {
            await deleteFile(product.productImage5);
        }

        await Product.deleteOne({ _id: productId });
        return res.status(200).json({ message: 'product deleted successfully', product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
});



module.exports = router;