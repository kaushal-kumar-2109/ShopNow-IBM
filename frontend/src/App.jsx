import { BrowserRouter } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchModal from "./components/SearchModal";
import CartDrawer from "./components/CartDrawer";
import MainRouter from "./Routers/mainRouter";

function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        {/* Global Page Layout Elements */}
        <Header />
        <SearchModal />
        <CartDrawer />

        {/* Dynamic Route Render */}
        <main style={{ minHeight: "60vh" }}>
          <MainRouter />
        </main>

        <Footer />
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;
