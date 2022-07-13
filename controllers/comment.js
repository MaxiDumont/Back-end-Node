'use strict'
var validator = require('validator');
var Topic = require('../models/topic');

var controller = {
    add: function(req, res) {
        //recoger el id del topic de la url
        var topicId = req.params.topicId;


        //find el id del topic
        Topic.findById(topicId).exec((err, topic) => {
            if (err) {
                return res.status(500).send({status: 'error',message: 'Error en la peticion'});
            }
            if (!topic) {
                return res.status(404).send({status: 'error',message: 'El topic no existe'});
            } 
            //comprobar el objeto usuario y validar datos
            if (req.body.content) {
                var params = req.body;
                //validar datos
                try{
                    var validate_content = !validator.isEmpty(params.content);
                }catch(err){
                    return res.status(200).send({message: 'No has comentado nada'});
                }
                if (validate_content) {
                    var comment = {
                        user: req.user.sub,
                        content: params.content,
                    }
                    //en la propiedad comments del objeto resultante añadir un push
                    topic.comments.push(comment);

                    //guardar el objeto topic
                    topic.save((err, topicStored) => {
                        if (err) {
                            return res.status(500).send({status: 'error', message: 'Error en la peticions'});
                        }
                        if (!topicStored) {
                            return res.status(404).send({status: 'error', message: 'No se ha guardado el topic'});
                        }
                        //devolver una respuesta
                        return res.status(200).send({status: 'success', topic: topicStored});
                    });

                }else{
                    return res.status(200).send({message: 'No se han enviado los datos correctamente'});
                }
            }

        });

    },

    update: function(req, res) {
        //conseguir el id del comentareio que llega de la url
        var commentId = req.params.commentId;

        //recoger datos y validar
        var params = req.body;

        try{
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({message: 'No has comentado nada'});
        }
        if(validate_content){
            
            //find and update de un sub documento 
            Topic.findOneAndUpdate({"comments._id": commentId}, { $set: {"comments.$.content": params.content}}, {new: true}, (err, topicUpdated) => {

                if (err) {
                    return res.status(500).send({status: 'error', message: 'Error en la peticion'});
                }
                if (!topicUpdated) {
                    return res.status(404).send({status: 'error', message: 'No se ha podido actualizar el topic'});
                }
                return res.status(200).send({status: 'success', topic: topicUpdated});
            });
        }
    },

    delete: function(req, res) {
        //sacar el id del topic y del comentario a borrar
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;

        //buscar el topic
        Topic.findById(topicId, (err, topic) => {
            if (err) {
                return res.status(500).send({status: 'error', message: 'Error en la peticion'});
            }
            if (!topic) {
                return res.status(404).send({status: 'error', message: 'El topic no existe'});
            }
        //seleccionar el subdocumento (comentario)
        var comment = topic.comments.id(commentId);

        //borrar el comentario
        if (comment) {
            comment.remove();
            //guardar el topic
            topic.save ((err) => {
                if (err) {
                    return res.status(500).send({status: 'error', message: 'Error en la peticion'});
                }
                //devolver una respuesta
                return res.status(200).send({status: 'success', topic: topic});
            });
        }else{
            return res.status(404).send({status: 'error', message: 'El comentario no existe'});
        }
        });
    }
};

module.exports = controller;