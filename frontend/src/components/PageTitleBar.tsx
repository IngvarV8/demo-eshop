import { Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const PageTitleBar = () => {
  const location = useLocation();

  const titles = {
    "/": "Inventory",
    "/cart": "Cart",
    "/orders": "Orders",
  };

  const defaultTitle = "Home";

  const pageTitle = titles[location.pathname] || defaultTitle;

  return (
    <Box sx={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4">{pageTitle}</Typography>
    </Box>
  );
};

export default PageTitleBar;
