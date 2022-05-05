const express = require("express");
constexpress= require('express')

const app =express();

//http://localhost:5555/

//rutas
app.get('/', function (req,res) {
    res.send('hola')
})

app.listen(5555);