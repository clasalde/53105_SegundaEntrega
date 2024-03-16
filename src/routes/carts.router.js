import { Router } from "express";
import CartManager from "../controllers/cart-manager.js";
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

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error while getting cart", error);
        res.status(500).json({ error: "Internal Server Error!"});
    }
});


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

export default router;