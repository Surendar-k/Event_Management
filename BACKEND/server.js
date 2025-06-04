// server.js
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/connection");

const eventInfo = require("./ROUTES/eventInfoRoutes");
const infraAndTechArrangements = require("./ROUTES/infraAndTechRoutes");
const loginRoutes = require("./ROUTES/loginRoutes");
const foodAndTravelRoutes = require("./ROUTES/foodAndTravelRoutes");
const checklistRoutes = require("./ROUTES/checklistRoutes");
const agendaRoutes = require("./ROUTES/agendaRoutes");
const financialPlanningRoutes = require("./ROUTES/financialPlanningRoutes");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Set the destination for file uploads
const combineObjectRoutes = require("./ROUTES/combinedObjects.Routes");
const remarkEventRoutes = require("./ROUTES/remarkedEventRoutes");
const getRemarkedEventRoutes = require("./ROUTES/getRemarkedEventRoutes");
const forwardAllEventsToHod = require("./ROUTES/forwardToHod.Routes");
const reportController = require("./ROUTES/report_Router");

// Middleware
app.use(express.json());

// MongoDB Connection
connectDB();

// CORS Middleware
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);

//routes
app.use("/event", financialPlanningRoutes);
app.use("/event", eventInfo);
app.use("/event", foodAndTravelRoutes);
app.use("/event", infraAndTechArrangements);
app.use("/auth", loginRoutes);
app.use("/event", checklistRoutes);
app.use("/event", agendaRoutes);
app.use("/event", combineObjectRoutes);
app.use("/event", remarkEventRoutes);
app.use("/event", getRemarkedEventRoutes);
app.use("/event", forwardAllEventsToHod);
app.use("/events", reportController);

app.post("/upload", upload.single("brochure"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File uploaded successfully: ${req.file.path}`);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
