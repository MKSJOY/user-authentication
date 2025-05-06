import { 
    createBuildingProduct, 
    getAllBuildingProducts, 
    getBuildingProductById, 
    updateBuildingProduct, 
    deleteBuildingProduct 
  } from "../model/buildingProductModel.js";
  
  // Create a new building product
  export const createProduct = async (req, res) => {
    try {
      const result = await createBuildingProduct(req.body);
      if (result.success) {
        res.status(201).json({ message: "Product created successfully", productId: result.productId });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get all building products with nested floors and units
  export const getAllProducts = async (req, res) => {  // Consistent function name
    try {
      const products = await getAllBuildingProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get building product by ID with nested floors and units
  export const getProductById = async (req, res) => {
    try {
      const product = await getBuildingProductById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a building product
  export const updateProduct = async (req, res) => {  // Consistent function name
    try {
      const result = await updateBuildingProduct(req.params.id, req.body);
  
      if (result.success) {
        res.json({ message: "Product updated successfully" });  // No need to send `data` if not necessary
      } else {
        res.status(400).json({ message: "Failed to update product", error: result.error });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a building product
  export const deleteProduct = async (req, res) => {
    try {
      const result = await deleteBuildingProduct(req.params.id);
      if (result.success) {
        res.json({ message: "Product deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete product" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  