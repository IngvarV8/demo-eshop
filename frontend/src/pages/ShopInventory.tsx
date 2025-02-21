import { useEffect, useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Button,
    Grid2,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Item {
    id: number;
    name: string;
    quantity: number;
}

interface CartItem {
    id: number;
    name: string;
    orderedQuantity: number;
}

const ShopInventory = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:3000/get-items");
                setItems(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error fetching items");
                setLoading(false);
            }
        };

        fetchItems();

        // Load cart from localStorage
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
            console.log(JSON.parse(savedCart))
        }
    }, []);

    const addToCart = (item: Item) => {
        setCartItems((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

            let updatedCart;
            if (existingItem) {
                updatedCart = prevCart.map((cartItem) =>
                    cartItem.id === item.id && cartItem.orderedQuantity < item.quantity
                        ? { ...cartItem, orderedQuantity: cartItem.orderedQuantity + 1 }
                        : cartItem
                );
            } else {
                updatedCart = [...prevCart, { ...item, orderedQuantity: 1 }];
            }

            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems((prevCart) => {
            const updatedCart = prevCart.filter((cartItem) => cartItem.id !== id);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const goToCart = () => {
        navigate("/cart");
    };

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Shop Inventory
            </Typography>
            <List>
                {items.map((item) => (
                    <div key={item.id}>
                        <ListItem>
                            <Grid2 container alignItems="center" justifyContent="space-between">
                                <Grid2>
                                    <ListItemText primary={item.name} secondary={`Stock: ${item.quantity}`} />
                                </Grid2>
                                <Grid2>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            const existsInCart = cartItems.some((cartItem) => cartItem.id === item.id);
                                            existsInCart ? removeFromCart(item.id) : addToCart(item);
                                        }}
                                        disabled={item.quantity === 0}
                                    >
                                        {cartItems.some((cartItem) => cartItem.id === item.id) && item.quantity !== 0 ? "Remove" : "Add"}
                                    </Button>
                                </Grid2>
                            </Grid2>
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "16px" }}
                onClick={goToCart}
                disabled={cartItems.length === 0}
            >
                Go to Cart
            </Button>
        </div>
    );
};

export default ShopInventory;
