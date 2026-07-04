import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import LandingPage from "../pages/landing/LandingPage";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";
import Shop from "../pages/shop/shop";
import ShopDetails from "../pages/shop/shopDetails";
import CheckOut from "../pages/checkout/checkOut";
import ShoppingCart from "../pages/shop/shoppingCart";
import NotFound from "../pages/404/notFound";

// User authentication pages
import Login from "../pages/userSetup/login";
import Signup from "../pages/userSetup/signup";
import ForgotPassword from "../pages/userSetup/forgotPassword";

// Shared page transition wrapper
export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
      <Route path="/about" element={<PageTransition><About /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
      <Route path="/shop/:id" element={<PageTransition><ShopDetails /></PageTransition>} />
      <Route path="/checkout" element={<PageTransition><CheckOut /></PageTransition>} />
      <Route path="/shopping-cart" element={<PageTransition><ShoppingCart /></PageTransition>} />
      
      {/* User authentication routes */}
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
      <Route path="/recover-password" element={<PageTransition><ForgotPassword /></PageTransition>} />

      {/* Fallback to NotFound page */}
      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
    </Routes>
  );
};

export default MainRouter;