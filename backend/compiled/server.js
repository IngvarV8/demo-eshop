"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pool = new pg_1.Pool({
    user: "user",
    host: "postgres", // Docker service name
    database: "eshop_db",
    password: "password",
    port: 5432,
});
// Get list of items
app.get("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield getItems(req, res);
}));
// Create new order
app.post("/new-order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield createOrder(req, res);
}));
// Delete order by id
app.delete("/delete-order/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield deleteOrder(req, res);
}));
// Get list of orders
app.get("/get-order-list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield getOrders(req, res);
}));
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool.connect(); // Start a DB transaction
        try {
            const { email, items } = req.body;
            // validate
            if (!email || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: "Invalid request format" });
            }
            // check if items are in stock
            for (const item of items) {
                const stockCheck = yield client.query("SELECT quantity FROM items WHERE id = $1", [item.id]);
                if (stockCheck.rows.length === 0) {
                    return res.status(404).json({ error: `Item #${item.id} not found` });
                }
                if (stockCheck.rows[0].quantity < item.quantity) {
                    return res.status(400).json({ error: `Not enough stock for item ${item.id}` });
                }
            }
            // insert order
            const orderResult = yield client.query("INSERT INTO orders (email) VALUES ($1) RETURNING id", [email]);
            const orderId = orderResult.rows[0].id;
            // insert order items and update stock
            for (const item of items) {
                yield client.query("INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3)", [orderId, item.id, item.quantity]);
                // upd stock quantity
                yield client.query("UPDATE items SET quantity = quantity - $1 WHERE id = $2", [item.quantity, item.id]);
            }
            yield client.query("COMMIT");
            return res.status(201).json({ message: "Order placed successfully", orderId });
        }
        catch (error) {
            yield client.query("ROLLBACK");
            console.error("Error creating order:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        finally {
            client.release();
        }
    });
}
function getItems(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query("SELECT * FROM items;");
            res.json(result.rows);
        }
        catch (err) {
            console.error("Error fetching from db:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
function getOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query("SELECT * FROM orders;");
            res.json(result.rows);
        }
        catch (err) {
            console.error("Error fetching from db:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
function deleteOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const client = yield pool.connect();
        try {
            const order = yield client.query("SELECT * FROM orders WHERE id = $1;", [id]);
            if (order.rows.length === 0) {
                return res.status(400).json({ error: `Order with id ${id} not found` });
            }
            const orderItems = yield client.query("SELECT * FROM order_items WHERE order_id = $1", [id]);
            //console.log(orderItems);
            for (const orderItem of orderItems.rows) {
                console.log(orderItem);
                // increment stock
                yield client.query("UPDATE items SET quantity = (quantity + $1) WHERE id = $2", [orderItem.quantity, orderItem.item_id]);
            }
            // the deletion of order itself
            yield client.query("DELETE FROM orders WHERE id = $1", [id]);
            yield client.query("COMMIT");
            return res.status(201).json({ message: "Order deleted successfully", id });
        }
        catch (err) {
            yield client.query("ROLLBACK");
            console.error("Error deleting an order:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
        finally {
            client.release();
        }
    });
}
