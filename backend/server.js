require("dotenv").config();
require("./db/connect.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const getRouter = require("./src/router/get.router.js");
const postRouter = require("./src/router/post.router.js");
const putRouter = require("./src/router/put.router.js");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:5173', // Do not use '*'
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/ShopNow/api/get", getRouter);
app.use("/ShopNow/api/post", postRouter);
app.use("/ShopNow/api/put", putRouter);

// Example route
app.get("/ShopNow", (req, res) => {
    res.send("Welcome to the ShopNow backend!");
});

app.listen(PORT, () => {
    console.log(`Server Port is set to: ${PORT}`);
    console.log(`Server is running on: http://localhost:${PORT}`);
});