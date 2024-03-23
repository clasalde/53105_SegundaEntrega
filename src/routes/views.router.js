import { Router } from "express";
import ProductManager from "../controllers/product-manager.js";
import CartManager from "../controllers/cart-manager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

const router = Router();

//View Routes
// Modificaciones por 2 entrega
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const newProductsArray = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return rest;
        });

        res.render("products", {
            title: "Productos",
            products: newProductsArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages
        });

    } catch (error) {
        console.log("Error while retrieving product list", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            console.log("No Cart found with that ID");
            return res.status(404).json({ error: "Cart not found" });
        }

        const productsInCart = cart.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));
        res.render("carts", { products: productsInCart });

    } catch (error) {
        console.error("Error while getting cart", error);
        res.status(500).json({ error: "Internar server error" });
    }
});


export default router;