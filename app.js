const express = require('express');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secure-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

// Certificate paths
const certPath = path.join(__dirname, 'config', 'ssl', 'cert.pem');
const keyPath = path.join(__dirname, 'config', 'ssl', 'key.pem');

// Check if SSL certificates exist
if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.error('SSL certificates not found. Please generate them first.');
    process.exit(1);
}

const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

const PORT = process.env.PORT || 3000;

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Secure server is running!');
});