const express = require("express");
const path = require("path");
const cors = require("cors");
const mercadopago = require("mercadopago");
require("dotenv").config();

const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());

// Serve static frontend assets
app.use(express.static(path.join(__dirname, "../frontend")));

// MercadoPago SDK Configuration
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

/**
 * @route   POST /api/create-preference
 * @desc    Creates a MercadoPago checkout preference for book transactions
 * @access  Public
 */
app.post("/api/create-preference", async (req, res) => {
  try {
    const { title, price } = req.body;

    const preference = {
      items: [
        {
          title: title || "RELIVRO Book Purchase",
          quantity: 1,
          unit_price: Number(price) || 50.00,
          currency_id: "BRL",
        },
      ],
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/error",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    return res.status(201).json({ id: response.body.id });
  } catch (error) {
    console.error("Error creating payment preference:", error);
    return res.status(500).json({ error: "Failed to create payment preference" });
  }
});

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in environment at http://localhost:${PORT}`);
});