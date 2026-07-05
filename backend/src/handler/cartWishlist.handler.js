const User = require("../../db/models/user.model.js");
const Product = require("../../db/models/product.model.js");
const Cart = require("../../db/models/cart.model.js");
const Wishlist = require("../../db/models/wishlist.model.js");

/* ── helper to get current logged-in user ── */
const getLoggedInUser = async (email) => {
    return await User.findOne({ email });
};

/* ══════════════════════════════════════════
   CART HANDLERS
   ══════════════════════════════════════════ */

// Get user's cart populated with product details
const GetCart = async (req, res) => {
    try {
        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        let cart = await Cart.findOne({ user_id: user._id }).populate("items.product_id");
        if (!cart) {
            cart = await Cart.create({ user_id: user._id, items: [] });
        }
        return res.status(200).json({ message: "Cart fetched", data: cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

// Add product to cart (or update quantity if already exists)
const AddToCart = async (req, res) => {
    try {
        const { product_id, size = "OS", color = "", quantity = 1 } = req.body;
        if (!product_id) return res.status(400).json({ message: "product_id is required" });

        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        // Verify product exists
        const product = await Product.findById(product_id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ user_id: user._id });
        if (!cart) {
            cart = new Cart({ user_id: user._id, items: [] });
        }

        // Check if item with same product_id, size, and color exists
        const existingIndex = cart.items.findIndex(
            (item) =>
                item.product_id.toString() === product_id.toString() &&
                item.size === size &&
                item.color === color
        );

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += Number(quantity);
        } else {
            cart.items.push({ product_id, size, color, quantity: Number(quantity) });
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ user_id: user._id }).populate("items.product_id");
        return res.status(200).json({ message: "Product added to cart", data: updatedCart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

// Update item quantity in cart
const UpdateCartQuantity = async (req, res) => {
    try {
        const { product_id, size, color, quantity } = req.body;
        if (!product_id || quantity === undefined) {
            return res.status(400).json({ message: "product_id and quantity are required" });
        }

        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        let cart = await Cart.findOne({ user_id: user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const existingIndex = cart.items.findIndex(
            (item) =>
                item.product_id.toString() === product_id.toString() &&
                item.size === size &&
                item.color === color
        );

        if (existingIndex > -1) {
            if (Number(quantity) <= 0) {
                cart.items.splice(existingIndex, 1);
            } else {
                cart.items[existingIndex].quantity = Number(quantity);
            }
            await cart.save();
        }

        const updatedCart = await Cart.findOne({ user_id: user._id }).populate("items.product_id");
        return res.status(200).json({ message: "Cart updated", data: updatedCart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

// Remove item from cart
const RemoveFromCart = async (req, res) => {
    try {
        const { product_id, size, color } = req.body;
        if (!product_id) return res.status(400).json({ message: "product_id is required" });

        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        let cart = await Cart.findOne({ user_id: user._id });
        if (cart) {
            cart.items = cart.items.filter(
                (item) =>
                    !(
                        item.product_id.toString() === product_id.toString() &&
                        item.size === size &&
                        item.color === color
                    )
            );
            await cart.save();
        }

        const updatedCart = await Cart.findOne({ user_id: user._id }).populate("items.product_id");
        return res.status(200).json({ message: "Product removed from cart", data: updatedCart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

// Clear all cart items
const ClearCart = async (req, res) => {
    try {
        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        let cart = await Cart.findOne({ user_id: user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({ message: "Cart cleared", data: cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

/* ══════════════════════════════════════════
   WISHLIST HANDLERS
   ══════════════════════════════════════════ */

// Get user's wishlist populated with product details
const GetWishlist = async (req, res) => {
    try {
        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        let wishlist = await Wishlist.findOne({ user_id: user._id }).populate("products");
        if (!wishlist) {
            wishlist = await Wishlist.create({ user_id: user._id, products: [] });
        }
        return res.status(200).json({ message: "Wishlist fetched", data: wishlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

// Toggle product in wishlist (no duplicates allowed)
const ToggleWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;
        if (!product_id) return res.status(400).json({ message: "product_id is required" });

        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        // Verify product exists
        const product = await Product.findById(product_id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let wishlist = await Wishlist.findOne({ user_id: user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ user_id: user._id, products: [] });
        }

        const index = wishlist.products.findIndex(
            (p) => p.toString() === product_id.toString()
        );

        let action = "added";
        if (index > -1) {
            wishlist.products.splice(index, 1);
            action = "removed";
        } else {
            wishlist.products.push(product_id);
        }

        await wishlist.save();
        const updatedWishlist = await Wishlist.findOne({ user_id: user._id }).populate("products");
        return res.status(200).json({ message: `Product ${action} wishlist`, action, data: updatedWishlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

module.exports = {
    GetCart,
    AddToCart,
    UpdateCartQuantity,
    RemoveFromCart,
    ClearCart,
    GetWishlist,
    ToggleWishlist,
};
