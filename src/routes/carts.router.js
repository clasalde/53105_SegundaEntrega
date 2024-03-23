import { Router } from "express";
import CartManager from "../controllers/cart-manager.js";
import CartModel from "../models/cart.model.js";

const cartManager = new CartManager();
const router = Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createNewCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error while creating a new cart", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

// modificado 2 entrega
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            console.log("No cart with that ID");
            return res.status(404).json({ error: "Cart not found" });
        }
        return res.json(cart.products);

    } catch (error) {
        console.error("Error while getting cart", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});
// fin modificacion 2 entrega


router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addNewProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error while adding new product to cart", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

// otras modificaciones 2 entrega
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);

        res.json({
            status: 'success',
            message: 'Product Deleted!',
            updatedCart,
        });
    } catch (error) {
        console.error('Error while deleting product from cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal server error',
        });
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error while updating cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal server error',
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'New product quantity updated successfully',
            updatedCart,
        });
    } catch (error) {
        console.error('Error while updating product quantity', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal server error',
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'All items from cart has been deleted successfully',
            updatedCart,
        });
    } catch (error) {
        console.error('Error while deleting products from cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal server error',
        });
    }
});

export default router;