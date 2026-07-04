import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

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

  const addToCart = (product, size = "M", color = "", quantity = 1) => {
    // Pick default color if none provided
    const selectedColor = color || (product.colors && product.colors[0]) || "";
    // Pick default size if none provided
    const selectedSize = size || (product.sizes && product.sizes[0]) || "OS";

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, size: selectedSize, color: selectedColor, quantity }];
    });

    // Automatically trigger cart drawer for quick feedback
    setCartDrawerOpen(true);
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateCartQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleWishlist = (product) => {
    const productId = typeof product === "object" ? product.id : product;
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

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
