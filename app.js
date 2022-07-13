'use strict'
const express = require('express');
var bodyParser =  require('body-parser');
const req = require('express/lib/request');
const cors = require('cors');
const mongoosePaginate = require('mongoose-paginate-v2');

const { default: mongoose } = require('mongoose');
var mangoose = require('mongoose');
var app = require('./app')
var PORT = process.env.PORT || 3999;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true })
        .then (()=>{
            console.log("conexion a la base de datos establecida satisfactoriamente")

            // Creacion del Servidor
            app.listen(PORT,()=>{
                console.log("Servidor corriendo correctamente en la url: localhost:3999")
            })

        })
        .catch(err => console.log(err));

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