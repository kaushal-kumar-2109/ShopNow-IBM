const Product = require("../../db/models/product.model.js");

const GetLanProduct = async (req, res) => {
    try {
        const { category, limit = 8 } = req.query;

        const filter = {};
        if (category) {
            filter.category = category;
        }
        const product = await Product.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
        if (!product || product.length === 0) {
            return res.status(404).json({ data: { message: "No products found" }, status: false });
        }
        return res.status(200).json({ message: "Products found", data: product });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

module.exports = { GetLanProduct };
