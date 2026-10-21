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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties.",
    });
  }
});

// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found :(",
      });
    }
    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties.",
    });
  }
});

// POST /api/properties
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const newProperty = await Property.create(req.body);
    res.status(201).json({
      success: true,
      message: "property created successfully!",
      data: newProperty,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE /api/properties/:id
router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found :(",
      });
    }
    res.status(200).json({
      success: true,
      message: "Property found and Deleted off of the list.",
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch and delete property.",
    });
  }
});

// UPDATE /api/properties/:id
router.patch("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found :(",
      });
    }
    res.status(200).json({
      success: true,
      message: "Property updated Successfully.",
      data: updatedProperty,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update property.",
      error: error.message,
    });
  }
});

module.exports = router;
