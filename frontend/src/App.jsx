import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ShopProvider } from "./context/ShopContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchModal from "./components/SearchModal";
import CartDrawer from "./components/CartDrawer";
import MainRouter from "./Routers/mainRouter";
import { CheckUserData } from "./utils/checkUser";

function App() {
  const [isUserLoged, setIsUserLoged] = useState(false);

  const checkUserLoged = async () => {
    const res = await CheckUserData();
    setIsUserLoged(res.status);
  }

  useEffect(() => {
    checkUserLoged();
  }, []);
  return (
    <ShopProvider>
      <BrowserRouter>
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "8px",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "14px",
              fontWeight: "600",
            },
            success: {
              style: { background: "#111111", color: "#fff" },
              iconTheme: { primary: "#066220ff", secondary: "#fff" },
            },
            error: {
              style: { background: "#e53637", color: "#fff" },
              iconTheme: { primary: "#fff", secondary: "#e53637" },
            },
            message: {
              style: { background: "#111111", color: "#fff" },
              iconTheme: { primary: "#e0f00aff", secondary: "#fff" },
            }
          }}
        />
        {/* Global Page Layout Elements */}
        <Header isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} />
        <SearchModal />
        <CartDrawer />
        {/* Dynamic Route Render */}
        <main style={{ minHeight: "60vh" }}>
          <MainRouter isUserLoged={isUserLoged} setIsUserLoged={setIsUserLoged} />
        </main>
        <Footer />
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;
