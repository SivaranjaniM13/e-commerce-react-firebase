const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

// POST endpoint to add product to a category
app.post("/addProduct", async (req, res) => {
  try {
    const { category, name, image, description, price } = req.body;

    if (!category || !name || !image || !description || !price) {
      return res.status(400).send("Missing fields");
    }

    const categoryRef = db.collection("categories").doc(category);
    const productsRef = categoryRef.collection("products");

    await productsRef.add({
      name,
      image,
      description,
      price,
    });

    res.status(200).send("Product added successfully");
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
