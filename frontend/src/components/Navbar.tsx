import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Inventory
          </Button>
          <Button color="inherit" onClick={() => navigate("/cart")}>
            Cart
          </Button>
          <Button color="inherit" onClick={() => navigate("/orders")}>
            Orders
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
