const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const isAuthenticated = require("./middlewares/auth");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const googleAuth = require("./routes/googleAuth");
const auth = require("./routes/auth");
const ProductRoutes = require("./routes/productsRoutes");
const searchRoutes = require("./routes/searchRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cloudinary = require("cloudinary").v2;

const app = express();
dotenv.config();

// middleWares
allowedOrigins = [process.env.FRONTEND_URL2, process.env.FRONTEND_URL];
app.use(
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to DB
async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("Connected to Database");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process if the connection fails
    }
}
connectDB();

// Routes
app.use("/api/products", ProductRoutes);
app.use("/search", searchRoutes);
app.use("/api/cart", isAuthenticated, cartRoutes);
app.use("/api/address", isAuthenticated, addressRoutes);
app.use("/api/orders", isAuthenticated, orderRoutes);

// Authentication routes (Login, Logout)
app.use("/auth/google", googleAuth);
app.use("/api/auth", auth);

// Error handling middleware (catch-all)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(process.env.PORT, () =>
    console.log(`Server is running at ${process.env.PORT}`)
);
