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

            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error while adding new product", error);
            throw error;
        }
    }

    //segunda entrega

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error while deleting product from cart: ", error);
            throw error;
        }
    }

    async updateCart(cartId, updatedProduct) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.products = updatedProduct;
            cart.markModified("products");
            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error while updating cart: ", error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                cart.markModified("products");
                await cart.save();
                return cart;
            } else {
                throw new Error("Product not found in cart");
            }

        } catch (error) {
            console.error("Error while updating product quantity on cart: ", error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;

        } catch (error) {
            console.error('Error while cleaning cart', error);
            throw error;
        }
    }
}

export default CartManager;