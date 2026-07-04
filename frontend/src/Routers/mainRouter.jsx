import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LandingPage from "../pages/landing/LandingPage";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";
import Shop from "../pages/shop/shop";
import ShopDetails from "../pages/shop/shopDetails";
import CheckOut from "../pages/checkout/checkOut";
import ShoppingCart from "../pages/shop/shoppingCart";
import NotFound from "../pages/404/notFound";
import CommentsPage from "../pages/shop/commentsPage";

// User authentication + profile pages
import Login from "../pages/userSetup/login";
import Signup from "../pages/userSetup/signup";
import ForgotPassword from "../pages/userSetup/forgotPassword";
import Profile from "../pages/profile/profile";


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

const MainRouter = ({ isUserLoged, setIsUserLoged }) => {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PageTransition><LandingPage isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/home" element={<PageTransition><LandingPage isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/about" element={<PageTransition><About isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><Contact isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/shop" element={<PageTransition><Shop isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/shop/:id" element={<PageTransition><ShopDetails isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/checkout" element={<PageTransition><CheckOut isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/shopping-cart" element={<PageTransition><ShoppingCart isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/shop/:id/comments" element={<PageTransition><CommentsPage isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />

      {/* Auth routes — redirect to home if already logged in */}
      <Route path="/login" element={<PageTransition><Login setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/signup" element={<PageTransition><Signup setIsUserLoged={setIsUserLoged} /></PageTransition>} />
      <Route path="/recover-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
      {/* Protected route — redirect to login if not logged in */}
      <Route path="/profile" element={<PageTransition><Profile isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />

      {/* Fallback */}
      <Route path="*" element={<PageTransition><NotFound isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} /></PageTransition>} />
    </Routes>
  );
};

export default MainRouter;