import express, { Request, Response } from "express";
import { Pool } from "pg";

const app = express();
app.use(express.json());

const pool = new Pool({
  user: "user",
  host: "postgres", // Docker service name
  database: "eshop_db",
  password: "password",
  port: 5432,
});

// Get list of items
app.get("/items", async (req: Request, res: Response) => {
  await getItems(req, res);
});

// Create new order
app.post("/new-order", async (req: Request, res: Response) => {
  await createOrder(req, res);
});

// Delete order by id
app.delete("/delete-order/:id", async (req: Request, res: Response) => {
  await deleteOrder(req, res);
});

// Get list of orders
app.get("/get-order-list", async (req: Request, res: Response) => {
  await getOrders(req, res);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});


async function createOrder(req: Request, res: Response){
  const client = await pool.connect(); // Start a DB transaction
  try {
    const { email, items } = req.body;

    // validate
    if (!email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    // check if items are in stock
    for (const item of items) {
      const stockCheck = await client.query(
        "SELECT quantity FROM items WHERE id = $1",
        [item.id]
      );
      if (stockCheck.rows.length === 0) {
        return res.status(404).json({ error: `Item #${item.id} not found` });
      }
      if (stockCheck.rows[0].quantity < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for item ${item.id}` });
      }
    }

    // insert order
    const orderResult = await client.query(
      "INSERT INTO orders (email) VALUES ($1) RETURNING id",
      [email]
    );
    const orderId = orderResult.rows[0].id;

    // insert order items and update stock
    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3)",
        [orderId, item.id, item.quantity]
      );

      // upd stock quantity
      await client.query(
        "UPDATE items SET quantity = quantity - $1 WHERE id = $2",
        [item.quantity, item.id]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ message: "Order placed successfully", orderId });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal server error" }); 
  } finally {
    client.release();
  }
}

async function getItems(req: Request, res: Response): Promise<any> {
  try {
    const result = await pool.query("SELECT * FROM items;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching from db:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getOrders(req: Request, res: Response): Promise<any> {
  try {
    const result = await pool.query("SELECT * FROM orders;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching from db:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteOrder(req: Request, res: Response): Promise<any> {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    const order = await client.query("SELECT * FROM orders WHERE id = $1;", [id]);
    if (order.rows.length === 0){
      return res.status(400).json({ error: `Order with id ${id} not found`});
    }

    const orderItems = await client.query("SELECT * FROM order_items WHERE order_id = $1", [id]);
    //console.log(orderItems);

    for (const orderItem of orderItems.rows) {
      console.log(orderItem);
      // increment stock
      await client.query("UPDATE items SET quantity = (quantity + $1) WHERE id = $2", [orderItem.quantity, orderItem.item_id]);
    }
    // the deletion of order itself
    await client.query("DELETE FROM orders WHERE id = $1", [id])
    await client.query("COMMIT");
    return res.status(201).json({ message: "Order deleted successfully", id });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting an order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
