import {
    addScrapSale,
    getAllScrapSales,
    getScrapSaleById,
    updateScrapSale,
    deleteScrapSale
} from "../model/scrap_sale.js";

// Create
export async function createScrapSale(req, res) {
    try {
        const { saleData, items } = req.body;
        await addScrapSale(saleData, items);
        res.status(201).json({ message: "Scrap sale created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Read all
export async function getScrapSales(req, res) {
    try {
        const data = await getAllScrapSales();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Read one
export async function getSingleScrapSale(req, res) {
    try {
        const { id } = req.params;
        const sale = await getScrapSaleById(id);
        res.status(200).json(sale);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Update
export async function editScrapSale(req, res) {
    try {
        const { id } = req.params;
        const { saleData, items } = req.body;
        await updateScrapSale(id, saleData, items);
        res.status(200).json({ message: "Scrap sale updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Delete
export async function removeScrapSale(req, res) {
    try {
        const { id } = req.params;
        await deleteScrapSale(id);
        res.status(200).json({ message: "Scrap sale deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
