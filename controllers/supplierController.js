import { v4 as uuidv4 } from "uuid";
import * as Supplier from "../model/supplierModel.js";

// CREATE
export const createSupplier = async (req, res) => {
  try {
    const id = uuidv4();
    const {
      company_id, name, phone, location,
      nid, tin_no, email, brand, product,
      status, photo_url
    } = req.body;

    await Supplier.createSupplier({
      id, company_id, name, phone, location,
      nid, tin_no, email, brand, product,
      status, photo_url
    });

    res.status(201).json({ message: "Supplier created", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.getAllSuppliers();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.getSupplierById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateSupplier = async (req, res) => {
  try {
    const data = req.body;
    await Supplier.updateSupplier(req.params.id, data);
    res.json({ message: "Supplier updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteSupplier = async (req, res) => {
  try {
    await Supplier.deleteSupplier(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
