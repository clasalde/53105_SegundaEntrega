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

  // modificaciones 2 entrega  
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;
      let queryOptions = {};
      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === 'asc' || sort === 'desc') {
          sortOptions.price = sort === 'asc' ? 1 : -1;
        }
      }

      const products = await ProductModel
        .find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
        nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
      };
    } catch(error) {
    console.log("Error while getting products from DB", error);
    throw error;
  }
}
// 2 entrega cambios fin


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