import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShopInventory from "./pages/ShopInventory.tsx";
import Cart from "./pages/Cart.tsx";
import Orders from "./pages/Orders.tsx"
import Navbar from "./components/Navbar.tsx";
import PageTitleBar from "./components/PageTitleBar.tsx";
import Content from './components/Content.tsx';

const App = () => {
  return (

    <Router>
      <Navbar />
      <PageTitleBar />
      <Content>
        <Routes>
          <Route path="/" element={<ShopInventory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Content>
    </Router>

  );
};

export default App;