import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchModal() {
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery } = useShop();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="search-model"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-100 d-flex align-items-center justify-content-center">
            {/* Close Button */}
            <div
              className="search-close-switch"
              onClick={() => setSearchOpen(false)}
            >
              +
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="search-model-form">
              <motion.input
                type="text"
                id="search-input"
                placeholder="Search here....."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
