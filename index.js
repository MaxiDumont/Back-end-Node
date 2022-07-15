'use strinct'

const { default: mongoose } = require('mongoose');
var mangoose = require('mongoose');
var app = require('./app')
var port = process.env.PORT || 3999;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Maximiliano:tjo56822@api-rest-node.tsxdsji.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
        .then (()=>{
            console.log("conexion a la base de datos establecida satisfactoriamente")

            // Creacion del Servidor
            app.listen(port,()=>{
                console.log("Servidor corriendo correctamente en la url: localhost:3999")
            })

        })
        .catch(err => console.log(err));