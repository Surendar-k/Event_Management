// Express route: routes/eventArrangements.js
const express = require("express");

const EventArrangement = require("../MODELS/foodAndTravel.model");

exports. foodAndTravel = async (req, res) => {
  try {
    // Destructure the data properly from request body
    const { eventId, userId, meals, refreshments, travels } = req.body;
    console.log("Received data:", req.body);
    if (!eventId || !userId) {
      return res.status(400).json({ message: "eventId and userId are required." });
    }

    // Find and update or create a new document with the new arrays
    const updatedDoc = await EventArrangement.findOneAndUpdate(
      { eventId, userId },
      { meals, refreshments, travels },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Event arrangements saved successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Error saving event arrangements:", error);
    res.status(500).json({ message: "Failed to save arrangements" });
  }
};
