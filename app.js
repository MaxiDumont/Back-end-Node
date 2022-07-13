'use strict'
const express = require('express');
var bodyParser =  require('body-parser');
const req = require('express/lib/request');
const cors = require('cors');

var PORT = process.env.PORT || 3999;

// Creacion del Servidor
app.listen(PORT,()=>{
    console.log("Servidor corriendo correctamente en la url: localhost:3999")
})



// archivos de rutas rutas
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var comment_routes = require('./routes/comment');


//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//reescribir rutas con /api/
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

//ruta de pruba 
app.get('/prueba',(req,res)=>{
    res.status(200).send({message:'Hola mundo desde mi API REST con NodeJS'})
});


// //cors Configurar cabeceras y cors
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, application/json, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });