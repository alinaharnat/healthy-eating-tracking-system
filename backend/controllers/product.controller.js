import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, calories, proteins, fats, carbs } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const normalizedName = name.trim().toLowerCase();

    const existing = await Product.findOne({ normalizedName });
    if (existing) {
      return res.status(409).json({ message: "Product already exists" });
    }

    const product = await Product.create({
      name: name.trim(),
      normalizedName,
      calories,
      proteins,
      fats,
      carbs,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("createProduct error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const payload = { ...req.body };

    if (payload.name) {
      payload.name = payload.name.trim();
      payload.normalizedName = payload.name.toLowerCase();
    }

    const updated = await Product.findByIdAndUpdate(productId, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("updateProduct error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("getProduct error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const items = await Product.find(query).limit(50);

    return res.json(items);
  } catch (error) {
    console.error("searchProducts error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("deleteProduct error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
