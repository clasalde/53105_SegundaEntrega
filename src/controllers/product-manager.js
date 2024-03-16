import ProductModel from "../models/product.model.js";

class ProductManager {

  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("All fields are mandatory");
        return;
      }

      const productExist = await ProductModel.findOne({ code: code });

      if (productExist) {
        console.log("Code MUST be unique!");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || []
      });

      await newProduct.save();

    } catch (error) {
      console.log("Error while adding new product", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.log("Error while getting products from DB", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        console.log("Product NOT FOUND on DB");
        return null;
      }
      console.log("Product FOUND");
      return product;
    } catch (error) {
      console.log("Error while reading file by ID", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const updateProduct = await ProductModel.findByIdAndUpdate(id, updatedProduct);

      if (!updateProduct) {
        console.log("Product NOT FOUND");
        return null;
      }
      console.log("Product UPDATED");
      return updateProduct;

    } catch (error) {
      console.log("Error while updating product by ID", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(id);

      if (!deleteProduct) {
        console.log("Product NOT FOUND");
        return null;
      }
      console.log("Product DELETED");
    } catch (error) {
      console.log("Error while deleting product by ID", error);
      throw error;
    }
  }
}

export default ProductManager;