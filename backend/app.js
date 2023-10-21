const express = require("express");
const errorMiddleware = require("../backend/middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

//route Import
const getAllProductRoute = require("../backend/routes/productRoute");
const userRoutes = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");

// attching all routes with a static route

// products router
app.use("/api/ecommerce", getAllProductRoute);

// User Route
app.use("/api/ecommerce", userRoutes);

//Order Router
app.use("/api/ecommerce", orderRoute);

// error middleware

app.use(errorMiddleware);

module.exports = app;
