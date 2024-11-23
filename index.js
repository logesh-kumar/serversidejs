import express from "express";

const app = express();

// CRUD -
// GET - Read
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
// POST - Create
app.post("/", (req, res) => {
  const body = req.body;
  // save to database
  res.send("Hello World");
});
// PUT - Update
app.put("/", (req, res) => {
  res.send("Hello World");
});
// DELETE - Delete
app.delete("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
