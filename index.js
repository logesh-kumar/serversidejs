import express from "express";
import mysql from "mysql2";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { usersApiPrefix } from "./api-utils.js";

const app = express();

app.use(express.json());

const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "helloworld",
});

db.connect();

db.on("connect", () => {
  console.log("Connected to database");
  db.query(
    `CREATE TABLE IF NOT 
      EXISTS users 
      (id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255), 
      email VARCHAR(255))`
  );
});

db.on("error", (err) => {
  console.log("Error connecting to database.", err);
});

// POST - Create
app.post(usersApiPrefix, (req, res) => {
  const body = req.body;

  db.query(
    `INSERT INTO users (name, email) VALUES ('${body.name}', '${body.email}')`,
    (err, result) => {
      if (err) {
        console.log("Error inserting data into database.", err);
        return res.status(500).send("Error inserting data into database.");
      }
      res.status(200).send("Successfully inserted data into database.");
    }
  );
  // save to database
});

// GET - Read
app.get(usersApiPrefix, (req, res) => {
  db.query(`SELECT * FROM users`, (err, result) => {
    if (err) {
      console.log("Error fetching data from database.", err);
      return res.status(500).send("Error fetching data from database.");
    }
    res.status(200).json(result);
  });
});

// GET - Read by id
app.get(`${usersApiPrefix}/:id`, (req, res) => {
  const id = req.params.id;
  db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log("Error fetching data from database.", err);
      return res.status(500).send("Error fetching data from database.");
    }
    if (result.length === 0) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(result);
  });
});

// PUT - Update
app.put(`${usersApiPrefix}`, (req, res) => {
  const id = req.body.id;
  const body = req.body;
  db.query(
    `UPDATE users SET name = '${body.name}', email = '${body.email}' WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.log("Error updating data in database.", err);
        return res.status(500).send("Error updating data in database.");
      }
      res.status(200).send("Successfully updated data in database.");
    }
  );
});

// DELETE - Delete
app.delete(`${usersApiPrefix}/:id`, (req, res) => {
  const id = req.params.id;
  db.query(`DELETE FROM users WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log("Error deleting data from database.", err);
      return res.status(500).send("Error deleting data from database.");
    }

    if (result.length === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("Successfully deleted data from database.");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
