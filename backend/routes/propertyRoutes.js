const express = require("express");
const router = express.Router();

const Property = require("../models/Property");

// GET /api/properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({
      success: true,
      cont: properties.length,
      data: properties,
    });
  } catch (erro) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties.",
    });
  }
});

module.exports = router;
