import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, Typography, Button, TextField } from "@mui/material";
import axios from "axios";

interface Item {
    id: number;
    name: string;
    orderedQuantity: number;
}

const Cart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedItems: Item[] = location.state?.selectedItems || [];
    const [cartItems, setCartItems] = useState<Item[]>([]);
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        } else if (selectedItems.length > 0) {
            setCartItems(selectedItems);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        if (cartItems.length === 0) {
            localStorage.removeItem("cartItems");
        }
    }, [cartItems]);


    const increaseQuantity = (id: number) => {
        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, orderedQuantity: item.orderedQuantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setCartItems((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.id === id ? { ...item, orderedQuantity: item.orderedQuantity - 1 } : item
            );
            // rm item if orderedQuantity is 0
            return updatedCart.filter((item) => item.orderedQuantity > 0);
        });
    };

    const handleSendOrder = async () => {
        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        try {
            await axios.post("http://localhost:3000/new-order", {
                email,
                items: cartItems.map(({ id, orderedQuantity }) => ({
                    id,
                    quantity: orderedQuantity,
                })),
            });
            alert("Order placed successfully!");
            setCartItems([]);
            localStorage.removeItem("cartItems");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const errorMessage = err.response.data?.error || "Failed to send order";
                setError(errorMessage);
                alert(errorMessage);
            } else {
                setError("Failed to send order");
                alert("An unexpected error occurred");
            }
        }
    };

    return (
        <div>
            <List>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <ListItem key={item.id}>
                            <ListItemText primary={item.name} secondary={`Ordered: ${item.orderedQuantity}`} />
                            <button onClick={() => decreaseQuantity(item.id)} disabled={item.orderedQuantity < 1}>
                                -
                            </button>
                            <span style={{ margin: "0 10px" }}>{item.orderedQuantity}</span>
                            <button onClick={() => increaseQuantity(item.id)}>+</button>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="h6">Your cart is empty</Typography>
                )}
            </List>

            {/* Email Input */}
            <TextField
                label="Enter your email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
            />

            {/* Buttons */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSendOrder}
                disabled={cartItems.length === 0} // Disable if cart is empty
                style={{ marginTop: "16px" }}
            >
                Send Order
            </Button>

            <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/")}
                style={{ marginTop: "8px" }}
            >
                Go to Inventory
            </Button>
        </div>
    );
};

export default Cart;
