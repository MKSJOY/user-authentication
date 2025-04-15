import {
    addScrapProduct,
    getAllScrapProducts,
    deleteScrapProduct,
    updateScrapProduct,
    getScrapProductById
} from "../model/add_scrap_product.js";

// Create
export async function createScrapProduct(req, res) {
    try {
        const {
            scrap_date,
            project,
            building_site,
            product,
            unit,
            unit_price,
            quantity
        } = req.body;

        const total = parseFloat(unit_price) * parseInt(quantity);

        await addScrapProduct({
            scrap_date,
            project,
            building_site,
            product,
            unit,
            unit_price,
            quantity,
            total
        });

        res.status(201).json({ message: "Scrap product added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Read
export async function getScrapProducts(req, res) {
    try {
        const data = await getAllScrapProducts();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Delete
export async function removeScrapProduct(req, res) {
    try {
        const { id } = req.params;
        await deleteScrapProduct(id);
        res.status(200).json({ message: "Scrap product deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


// Get a single scrap product by ID
export async function getSingleScrapProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await getScrapProductById(id);

        if (!product) {
            return res.status(404).json({ message: "Scrap product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Update
export async function editScrapProduct(req, res) {
    try {
        const { id } = req.params;
        const {
            scrap_date,
            project,
            building_site,
            product,
            unit,
            unit_price,
            quantity
        } = req.body;

        const total = parseFloat(unit_price) * parseInt(quantity);

        await updateScrapProduct(id, {
            scrap_date,
            project,
            building_site,
            product,
            unit,
            unit_price,
            quantity,
            total
        });

        res.status(200).json({ message: "Scrap product updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
