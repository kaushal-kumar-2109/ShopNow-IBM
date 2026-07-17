// ------------------------- requiring configration -------------------------
require("dotenv").config(); // --- dotenv configration
require("./db/connect.js"); // --- database configration

// ------------------------- requiring other package -------------------------
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ------------------------- router requiring -------------------------
const getRouter = require("./src/router/get.router.js"); // --- get router
const postRouter = require("./src/router/post.router.js"); // --- post router
const putRouter = require("./src/router/put.router.js"); // --- put and delete router

// ------------------------- requiring other files -------------------------
const AppError = require("./src/utils/errorMessage.js"); // --- custom error file
const errorHandler = require("./src/handler/error.handler.js"); // --- error handler file

// ------------------------- server variables -------------------------
const app = express();
const PORT = process.env.PORT || 4000;

// ------------------------- initialization middlewares -------------------------
app.use(cors({
    origin: ['https://shop-now-neon.vercel.app', 'http://localhost:5173','https://shopnow-ibm.onrender.com'],
    credentials: true
})); // --- cors for site verification 
app.use(cookieParser()); // --- for pase the cookie to the frontend
app.use(express.json()); // --- pare string data into json

// ------------------------- router initalization -------------------------
app.use("/ShopNow/api/get", getRouter); // --- get router initialization
app.use("/ShopNow/api/post", postRouter); // --- post router initialization
app.use("/ShopNow/api/put", putRouter); // --- put and delete router initialization
app.use(errorHandler); // --- error handler initialization

// Example route
app.get("/ShopNow", (req, res) => {
    res.send("Welcome to the ShopNow backend!");
});

// ------------------------- handle invalid router paths -------------------------
app.all('/*any', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ------------------------- server initalization -------------------------
app.listen(PORT, () => {
    console.log(`Server Port is set to: ${PORT}`);
    console.log(`Server is running on: http://localhost:${PORT}`);
});
