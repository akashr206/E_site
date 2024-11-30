const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: process.env.SECRET, // Use a secure session secret
  resave: false,
  saveUninitialized: false, // Avoid saving empty sessions
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 hours (in milliseconds)
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to DB
async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log('Connected to Database');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);  // Exit the process if the connection fails
  }
}
connectDB();

// Routes
app.use('/api/products', ProductRoutes);
app.use('/search', searchRoutes);
app.use('/api/cart', cartRoutes);
app.use('/auth', authRoutes);  // Use the authentication routes

// Error handling middleware (catch-all)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.PORT}`));
