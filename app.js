'use strict'
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const req = require('express/lib/request');
const app = express();

var bodyParser =  require('body-parser');
var mangoose = require('mongoose');
var PORT = process.env.PORT || 3999;

//esto de abajo sirve para conectarnos con el servidor en linea de Mongodb atlas
//al mismo tiempo ayuda a la coneccion adecuada de heroku para mantener el servidor en linea, no se si es un paso extra o no
//pero de que funciona funciona. para que heroku funcione tenemos que manejar bien las versiones de git y claro los errores
//con las dependencias que utiliza el proyecto fallos en la configuracion de las dependencias generaran errores con heroku 
//al igual que las malas lineas de codigo de las conecciones a la base de datos pertinentes.

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Maximiliano:tjo56822@api-rest-node.tsxdsji.mongodb.net/api-rest-node?retryWrites=true&w=majority', { useNewUrlParser: true })
        .then (()=>{
            console.log("conexion a la base de datos establecida satisfactoriamente")

            // Creacion del Servidor
            app.listen(PORT,()=>{
                console.log(`Servidor corriendo correctamente en la url:${PORT}`)
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