import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShopInventory from "./pages/ShopInventory.tsx";
import Cart from "./pages/Cart.tsx";
import Orders from "./pages/Orders.tsx"
import Navbar from "./components/Navbar.tsx";

const App = () => {
  return (

    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ShopInventory />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>

  );
};

export default App;