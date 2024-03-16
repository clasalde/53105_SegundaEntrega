import { Router } from "express";
import ProductManager from "../controllers/product-manager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {

    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("Error while reading product list", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);
        if (!product) { 
            return res.json({ error: "Product NOT FOUND" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error while retrieving product", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        console.error("Error while adding new product", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(id, updatedProduct);
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Error while updating product", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error while deleting product", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

export default router;