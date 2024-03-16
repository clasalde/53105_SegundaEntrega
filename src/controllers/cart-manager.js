import CartModel from "../models/cart.model.js";

class CartManager {
    async createNewCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error while creating a new cart", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                console.log("No cart found with that ID");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error while getting cart by ID", error);
            throw error;
        }
    }

    async addNewProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(item => item.product.toString() === productId);

            if(productExist) {
                productExist.quantity += quantity; 
            }else {
                cart.products.push({product: productId, quantity});
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error while adding new product", error);
            throw error; 
        }
    }
}

export default CartManager;