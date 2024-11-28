const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const ProductRoutes = require('./routes/productsRoutes');
const searchRoutes = require('./routes/searchRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');  // Import the auth routes
require('./passport');

const app = express();
dotenv.config();

// middleWares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: process.env.SECRET, // Use a secure session secret
  resave: false,
  saveUninitialized: true,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to DB
async function connectDB() { 
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log('Connected to Database');
}
connectDB();

// Routes 
app.use('/api/products', ProductRoutes);
app.use('/search', searchRoutes);
app.use('/api/cart', cartRoutes);
app.use('/auth',authRoutes);  // Use the authentication routes

app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.PORT}`));
