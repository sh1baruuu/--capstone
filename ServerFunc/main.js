const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const loginProcessRouter = require('./LoginProcess');
const serverRouter = require('./server');
const FCRouter = require('./FranchiseProcess');
const OccuProcessRouter = require('./Occuprocess');
const VerifyingRouter = require('./Verifying');
const HeadadminRouter = require('./HeadadminLogin'); // Head admin login router
const AdminChangPass = require('./AdminChangPass');
const PasswordReset = require('./PasswordReset');
const InspectorSignup = require('./InspectorSignup');
const inspectorchangepass = require('./inspectorchangepass')
const inspectorchangepass2 = require('./inspectorchangepass2')
const HeadadminAccountRouter = require('./HeadAdminaccount');
const Analysis = require('./Analysis');
const occupational= require("./occupational");
const OccupationalApplicants = require("./OccupationalApplicants"); // Use HeadadminAccount for account management routes
const pool = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Occuformhandler = require("./Occuformhandler");
require('dotenv').config(); // Load environment variables from .env

// Initialize Express app
const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

// Port configuration
const port = process.env.PORT || 8000;

// Use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8000', // Adjust this to your front-end's URL if different
    credentials: true
}));

// Use session middleware with PostgreSQL session store
app.use(session({
    store: new pgSession({
        pool: pool, // Connect to PostgreSQL
        tableName: 'session' // Customize the session table name
    }),
    secret: process.env.SESSION_SECRET || 'aV3ryC0mpl3xP@ssphr@se1234!', // Use secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
        secure: false // Set to true in production with HTTPS
    }
}));

// Use routers for different routes
app.use('/', loginProcessRouter);  // Login related routes
app.use('/', serverRouter);  // Other server routes
app.use('/', FCRouter);  // Franchise routes
app.use('/', OccuProcessRouter);  // Occupation process routes
app.use('/', VerifyingRouter);  // Verifying routes
app.use('/', HeadadminRouter);  // Head admin login routes
app.use('/', AdminChangPass);
app.use('/', PasswordReset);
app.use('/', inspectorchangepass);
app.use('/', inspectorchangepass2);
app.use('/', InspectorSignup);
app.use('/', HeadadminAccountRouter);
app.use('/data', Analysis); 
app.use("/signup", occupational);
app.use("/auth", OccupationalApplicants );
app.use("/", Occuformhandler);
  // Use HeadadminAccountRouter for account management

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
