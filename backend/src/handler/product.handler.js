const Product = require("../../db/models/product.model.js");
const Comment = require("../../db/models/comments.model.js");

/* ── GET latest / filtered products (landing page) ───────────────────── */
const GetLanProduct = async (req, res) => {
    try {
        const { category, limit = 8 } = req.query;
        const filter = {};
        if (category) filter.category = category;
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

/* ── GET single product by _id ────────────────────────────────────────── */
const GetProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found", data: null });
        }
        return res.status(200).json({ message: "Product found", data: product });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

/* ── GET comments for a product ───────────────────────────────────────── */
const GetProductComments = async (req, res) => {
    try {
        const { id } = req.params;
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip  = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            Comment.find({ product_id: id, status: true })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            Comment.countDocuments({ product_id: id, status: true }),
        ]);

        return res.status(200).json({
            message: "Comments fetched",
            data: { comments, total, page, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

/* ── POST a new comment ───────────────────────────────────────────────── */
const PostComment = async (req, res) => {
    try {
        const { product_id, product_name, comment } = req.body;

        // CheckUserAuth sets req.email — look up the real User doc from it
        const User = require("../../db/models/user.model.js");
        const userData = await User.findOne({ email: req.email });
        if (!userData) {
            return res.status(401).json({ message: "User not found. Please log in again." });
        }

        if (!product_id || !comment?.trim()) {
            return res.status(400).json({ message: "product_id and comment are required" });
        }

        const newComment = await Comment.create({
            user_id:      userData._id,
            user_name:    userData.name,
            product_id,
            product_name: product_name || "",
            comment:      comment.trim(),
        });

        return res.status(201).json({ message: "Comment posted", data: newComment });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

module.exports = { GetLanProduct, GetProductById, GetProductComments, PostComment };

