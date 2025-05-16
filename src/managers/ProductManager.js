import Product from '../models/Product.js';

class ProductManager {
  // Obtener todos los productos con filtros y paginación
  getProducts = async (limit = 10, page = 1, filters = {}, sort = {}) => {
    const options = {
      limit,
      page,
      sort,
    };

    const result = await Product.paginate(filters, options);

    return {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null,
    };
  }

  // Obtener un producto por su ID
  getProductById = async (id) => {
    return await Product.findById(id);
  }

  // Agregar un nuevo producto
  addProduct = async (productData) => {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  }

  // Actualizar un producto por ID
  updateProductById = async (id, updatedData) => {
    return await Product.findByIdAndUpdate(id, updatedData, { new: true });
  }

  // Eliminar un producto por ID
  deleteProductById = async (id) => {
    await Product.findByIdAndDelete(id);
    return true;
  }
}

export default ProductManager;
