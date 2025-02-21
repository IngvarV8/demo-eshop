import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography, Divider, Button, Grid2 } from "@mui/material";
import axios from "axios";

interface Item {
  item_name: string;
  item_quantity: number;
}

interface Order {
  order_id: number;
  email: string;
  order_date: string;
  items: Item[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-orders");
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Delete order from DB and state
  const handleDeleteOrder = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/delete-order/${id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== id));
    } catch (err) {
      setError("Error deleting order");
    }
  };

  // Loading and error handling
  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <div>
      <List>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id}>
              <ListItem>
                <Grid2 container
                  direction="column"
                  sx={{
                    justifyContent: "space-evenly",
                    alignItems: "baseline",
                  }}>
                  <Grid2>
                    <ListItemText
                      primary={`Order ID: ${order.order_id}`}
                      secondary={`Email: ${order.email} | Date: ${new Date(order.order_date).toLocaleString()}`}
                    />
                    {/* Display ordered items */}
                    <div>
                      {order.items.map((item, index) => (
                        <Typography key={index}>
                          {item.item_name}: {item.item_quantity}
                        </Typography>
                      ))}
                    </div>
                  </Grid2>
                  <Grid2>
                    {/* Delete Button */}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteOrder(order.order_id)}
                    >
                      Delete
                    </Button>
                  </Grid2>
                </Grid2>
              </ListItem>
              <Divider />
            </div>
          ))
        ) : (
          <Typography variant="h6">No orders available</Typography>
        )}
      </List>
    </div>
  );
};

export default Orders;