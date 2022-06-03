const express = require("express");
constexpress= require('express')

const app =express();

const {Notification, Coin,User} = require('./src/db/models')

//http://localhost:5555/

//rutas
app.get('/', function (req,res) {
    res.send('hola')
})

app.get('/notifications', async function (req,res){
    let notifications = await Notification.findAll()
    return res.send(notifications)
})

//get user notifications
app.get('/getusernotification', async function (req,res){
    const john = await User.findByPk(2);
    const notification = await john.getNotifications();

    return res.send(notification)
})

app.listen(5555);