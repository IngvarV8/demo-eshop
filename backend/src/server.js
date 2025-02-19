const express = require("express");
const app = express();
const { Pool } = require("pg");

const pool = new Pool({
    user: "user",
    host: "postgres",  // name of service inside Docker
    database: "eshop_db",
    password: "password",
    port: 5432,
});


app.get("/items", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM items;");
        console.log(result)
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching from db:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/", (req, res) => {
    res.send("Server msg")
})

app.get("/inventory", (req, res) => {
    res.send("cart here")
})

app.listen(3000)