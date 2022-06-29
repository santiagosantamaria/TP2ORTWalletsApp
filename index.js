const express = require('express');
const { randBitcoinAddress } = require('@ngneat/falso');
const moment = require('moment');
const app = express();
app.use(express.urlencoded({ extended: true }));

// accept json in post request
app.use(express.json());

// User Routes
const userRouter = require("./src/routes/userRoutes");
app.get('/users', userRouter);
app.get("/users/:id", userRouter);
app.get("/users/findbyemail/:email", userRouter);
app.post('/users', userRouter);
app.put('/users', userRouter);
app.delete('/users', userRouter);
app.post('/users/login', userRouter);
app.post('/users/logout', userRouter);
app.get('/users/getwallets', userRouter);

// Wallet Routes
const walletRouter = require('./src/routes/walletRoutes');
app.get('/wallets', walletRouter);
app.get('/wallets/findbyemail/:email', walletRouter);
app.post('/wallets', walletRouter);
app.put('/wallets', walletRouter);
app.delete('/wallets/:id', walletRouter);

// Coin Routes
const coinRouter = require('./src/routes/coinRoutes');
app.get('/coins', coinRouter);
app.post('/coins/buy', coinRouter);
app.post('/coins/sell', coinRouter);
app.post('/coins/swap', coinRouter);
app.post('/coins/deposit', coinRouter);
app.post('/coins/withdraw', coinRouter);
app.post('/coins/sendToEmail', coinRouter);

// Notification Routes
const notificationRouter = require('./src/routes/notificationRoutes');
app.get('/notifications', notificationRouter);
app.get('/notifications/mynotifications', notificationRouter);
app.post('/notifications', notificationRouter);
app.delete('/notifications/:id', notificationRouter);
app.put('/notifications/markasseen/', notificationRouter);
app.put('/notifications', notificationRouter);

// Transaction Routes
const transactionRouter = require('./src/routes/transactionRoutes');
app.get('/transactions', transactionRouter);
app.post('/transactions', transactionRouter);
app.put('/transactions', transactionRouter);
app.delete('/transactions/:id', transactionRouter);

// Cron Buy Routes
const cronBuyRouter = require('./src/routes/cronBuyRoutes');
app.post('/cronbuys', cronBuyRouter);
app.delete('/cronbuys/:ticker', cronBuyRouter);
app.put('/cronbuys', cronBuyRouter);
app.get('/cronbuys/run', cronBuyRouter);

// Tag Routes
const tagRouter = require('./src/routes/tagRoutes');
app.get('/tags', tagRouter);
app.get('/tags/find/:id', tagRouter);
app.post('/tags', tagRouter);
app.put('/tags/:id', tagRouter);
app.delete('/tags/:id', tagRouter);
app.get('/tags/getcointags/:id', tagRouter);

app.listen(5555);