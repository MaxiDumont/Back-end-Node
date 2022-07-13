'use strinct'

const { default: mongoose } = require('mongoose');
var mangoose = require('mongoose');
var app = require('./app')
var port = process.env.PORT || 3999;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true })
        .then (()=>{
            console.log("conexion a la base de datos establecida satisfactoriamente")

            // Creacion del Servidor
            app.listen(port,()=>{
                console.log("Servidor corriendo correctamente en la url: localhost:3999")
            })

        })
        .catch(err => console.log(err));