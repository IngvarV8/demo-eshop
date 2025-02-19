import express, { Request, Response } from "express";
import { Pool } from "pg";

const app = express();

const pool = new Pool({
  user: "user",
  host: "postgres", // Docker service name
  database: "eshop_db",
  password: "password",
  port: 5432,
});

app.get("/items", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM items;");
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching from db:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server msg");
});

app.get("/inventory", (req: Request, res: Response) => {
  res.send("cart here");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
