import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCart, getWishlist } from "../api/getApiHandler/getData";
import { apiAddToCart, apiUpdateCartQuantity, apiRemoveFromCart, apiClearCart, apiToggleWishlist } from "../api/postApiHandler/pstData";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [cartLoadingIds, setCartLoadingIds] = useState([]);
  const [wishlistLoadingIds, setWishlistLoadingIds] = useState([]);

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem("comments");
    if (saved) return JSON.parse(saved);

    const initialComments = [];
    const reviewers = [
      "Aarav Sharma", "Priya Verma", "Vikash Kumar", "Diya Jain",
      "Sean Robbins", "Lucy Myers", "Christine Wise", "John Doe"
    ];
    const reviewTexts = [
      "The fit is absolutely perfect! Highly recommended.",
      "Amazing fabric quality and very premium look.",
      "The packaging was neat and delivery was super fast.",
      "Very comfortable and looks exactly like the images.",
      "Great value for money. Buying another color soon!",
      "The material is incredibly soft. Worth every penny.",
      "Very stylish and breathable. Perfect for daily wear.",
      "Exceeded my expectations! Best buy of the season."
    ];

    for (let productId = 1; productId <= 20; productId++) {
      for (let i = 0; i < 6; i++) {
        const reviewer = reviewers[(productId + i) % reviewers.length];
        const text = reviewTexts[(productId * 3 + i * 2) % reviewTexts.length];
        const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString();

        initialComments.push({
          id: `${productId}-${i}`,
          productId,
          userName: reviewer,
          comment: text,
          date
        });
      }
    }
    return initialComments;
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // DB functions to load cart and wishlist
  const fetchCartFromDb = async () => {
    try {
      const res = await getCart();
      if (res.flag && res.data) {
        const dbItems = (res.data.items || []).map((item) => ({
          product: item.product_id,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        }));
        setCart(dbItems);
      }
    } catch (err) {
      console.error("Error fetching cart from DB", err);
    }
  };

  const fetchWishlistFromDb = async () => {
    try {
      const res = await getWishlist();
      if (res.flag && res.data) {
        setWishlist(res.data.products || []);
      }
    } catch (err) {
      console.error("Error fetching wishlist from DB", err);
    }
  };

  // Sync state automatically upon login/logout state change
  useEffect(() => {
    const checkLoginChange = () => {
      const raw = localStorage.getItem("ShopNowUserData");
      const user = raw ? JSON.parse(raw) : null;
      const email = user ? user.email : "";

      if (email !== currentUserEmail) {
        setCurrentUserEmail(email);
        if (email) {
          fetchCartFromDb();
          fetchWishlistFromDb();
        } else {
          setCart([]);
          setWishlist([]);
        }
      }
    };

    const interval = setInterval(checkLoginChange, 1000);
    checkLoginChange();
    return () => clearInterval(interval);
  }, [currentUserEmail]);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const addComment = (productId, userName, text) => {
    const newComment = {
      id: Date.now().toString(),
      productId: parseInt(productId),
      userName,
      comment: text,
      date: new Date().toLocaleDateString()
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const addToCart = async (product, sizeOrQty = "M", color = "", quantity = 1) => {
    const logged = !!localStorage.getItem("ShopNowUserData");
    if (!logged) {
      toast.error("Only logged in users can add products to the cart!");
      return;
    }

    let size = sizeOrQty;
    let qty = quantity;
    if (typeof sizeOrQty === "number") {
      qty = sizeOrQty;
      size = product.sizes?.[0] || "OS";
    }

    const selectedColor = color || (product.colors && product.colors[0]) || "";
    const selectedSize = size || (product.sizes && product.sizes[0]) || "OS";
    const productId = product._id || product.id;

    setCartLoadingIds((prev) => [...prev, productId]);
    try {
      const res = await apiAddToCart({
        product_id: productId,
        size: selectedSize,
        color: selectedColor,
        quantity: qty
      });

      if (res.flag && res.data && res.data.data) {
        const dbItems = (res.data.data.items || []).map((item) => ({
          product: item.product_id,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        }));
        setCart(dbItems);
        setCartDrawerOpen(true);
        toast.success(`"${product.title || product.name}" added to cart!`);
      } else {
        toast.error(res.message || "Failed to add product to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding to cart");
    } finally {
      setCartLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const removeFromCart = async (productId, size, color) => {
    try {
      const res = await apiRemoveFromCart({ product_id: productId, size, color });
      if (res.flag && res.data && res.data.data) {
        const dbItems = (res.data.data.items || []).map((item) => ({
          product: item.product_id,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        }));
        setCart(dbItems);
        toast.success("Removed from cart");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateCartQuantity = async (productId, size, color, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size, color);
      return;
    }
    try {
      const res = await apiUpdateCartQuantity({ product_id: productId, size, color, quantity });
      if (res.flag && res.data && res.data.data) {
        const dbItems = (res.data.data.items || []).map((item) => ({
          product: item.product_id,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        }));
        setCart(dbItems);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async (product) => {
    const logged = !!localStorage.getItem("ShopNowUserData");
    if (!logged) {
      toast.error("Only logged in users can add products to the wishlist!");
      return;
    }

    const productId = product._id || product.id || product;
    setWishlistLoadingIds((prev) => [...prev, productId]);

    try {
      const res = await apiToggleWishlist({ product_id: productId });
      if (res.flag && res.data && res.data.data) {
        setWishlist(res.data.data.products || []);
        if (res.data.action === "added") {
          toast.success("Added to wishlist!");
        } else {
          toast.success("Removed from wishlist");
        }
      } else {
        toast.error(res.message || "Failed to update wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating wishlist");
    } finally {
      setWishlistLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const clearCart = async () => {
    try {
      const res = await apiClearCart();
      if (res.flag) {
        setCart([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => {
      const price = item.product?.discountPrice ?? item.product?.price ?? 0;
      return acc + price * item.quantity;
    }, 0);
  };

  const isInWishlist = (product) => {
    if (!product) return false;
    const productId = product._id || product.id || product;
    return wishlist.some((item) => (item._id || item.id || item) === productId);
  };

  const isCartLoading = (productId) => cartLoadingIds.includes(productId);
  const isWishlistLoading = (productId) => wishlistLoadingIds.includes(productId);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        searchOpen,
        setSearchOpen,
        cartDrawerOpen,
        setCartDrawerOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        isInWishlist,
        isCartLoading,
        isWishlistLoading,
        clearCart,
        getCartCount,
        getCartTotal,
        comments,
        addComment
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
