import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My App
        </Typography>

        <Button color="inherit" onClick={() => navigate("/")}>
          Inventory
        </Button>
        <Button color="inherit" onClick={() => navigate("/cart")}>
          My cart
        </Button>
        <Button color="inherit" onClick={() => navigate("/orders")}>
          My orders
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;