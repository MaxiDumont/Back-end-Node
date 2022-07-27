'use strict'
var validator = require('validator');
var Topic = require('../models/topic');


var controller={

    test : function(req,res){
        return res.status(200).send({message: 'Topic tested'});
    },

    save : function(req,res){
        //recoger los parametros
        var params = req.body;
        //validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        }catch(err){
            return res.status(200).send({message: 'Error en la validacion'});
        }
        if (validate_title && validate_content && validate_lang){
            //crear objeto a guardar
            var topic = new Topic();
            //asignar valores
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;
            
            //guardar el topic
            topic.save((err,topicStored)=>{
                if (err || !topicStored){
                    return res.status(404).send({status:'error',message: 'Error al guardar el topic'});
                }else{
                     //devolver respuesta
                    return res.status(200).send({status:'success', topic: topicStored});
                }
            });


        }else{
            return res.status(200).send({message: 'Todos los campos son obligatorios'});
        }
        

    },

    getTopics : function(req,res){
        // cargar la libreria de paginacion en la clase (Modelo)
        //recoger la pagina
        if(!req.params.page ||req.params.page == 0 ||req.params.page == "0" ||  req.params.page == null || req.params.page == undefined){
            var page = 1;
        }else{
            var page = parseInt(req.params.page);
        }
        //indicar las opciones de paginacion
        var options = {
            sort : {date : -1},
            populate : 'user',
            limit : 5,
            page : page
        };

        //finde paginado
        Topic.paginate({},options,(err,topics,total)=>{
            //devolver respuesta (topics,total de topics y paginas)
            if (err){
                return res.status(500).send({status: 'error', message: 'Error en la peticion'});
            }else if(!topics){
                return res.status(404).send({status: 'error', message: 'No hay topics'});
            }else{
                return res.status(200).send({
                    status: 'success',
                    topics: topics.docs,                 
                    totalPages: topics.pages,
                    tuvieja : 'tuvieja'
                });
            }
        })//fin finde paginado
    },

    getTopicsByUser : function(req,res){
        //conseguir el id del usuario
        var userId = req.params.user;

        //Find con la condicion del usuario
        Topic.find({user: userId}).populate('user').sort([['date','descending']]).exec((err,topics)=>{
            if (err){
                return res.status(500).send({status: 'error', message: 'Error en la peticion'});
            }else if(!topics){
                return res.status(404).send({status: 'error', message: 'No hay topics'});
            }
            
        //devolver resultado

        return res.status(200).send({status: 'success', topics: topics});

        });

    },

    getTopic : function(req,res){
        //conseguir el id del topic
        var topicId = req.params.id;

        //finde topic
        Topic.findById(topicId).populate('user').populate('comments.user').exec((err,topic)=>{
            if (err){
                return res.status(500).send({status: 'error', message: 'Error en la peticion'});
            }else if(!topic){
                return res.status(404).send({status: 'error', message: 'No hay topic'});
            }
            
        //devolver resultado

        return res.status(200).send({status: 'success', topic: topic});

        });

    },

    update : function(req,res){
        //recoger los parametros
        var topicId = req.params.id;
        var params = req.body;

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        }catch(err){
            return res.status(200).send({message: 'Error en la validacion'});
        }
        if (validate_title && validate_content && validate_lang){
            var update = {
                title : params.title,
                content : params.content,
                code : params.code,
                lang : params.lang
            };

            //finde topic
            Topic.findByIdAndUpdate(topicId,update,{new:true},(err,topicUpdated)=>{
                if (err){
                    return res.status(500).send({status: 'error', message: 'Error en la peticion'});
                }else if(!topicUpdated){
                    return res.status(404).send({status: 'error', message: 'No hay topic'});
                }
                
            //devolver resultado

            return res.status(200).send({status: 'success', topic: topicUpdated});

            })
     }else{
        return res.status(200).send({message: 'Todos los campos son obligatorios'});
     }
    },

    delete : function(req,res){
        //recoger el id del topic
        var topicId = req.params.id;

        //finde and delete por topic id y por uer is
        Topic.findOneAndDelete({_id:topicId, user: req.user.sub},(err,topicRemoved)=>{
            if (err){
                return res.status(500).send({status: 'error', message: 'Error en la peticion'});
            }else if(!topicRemoved){
                return res.status(404).send({status: 'error', message: 'No hay topic no existe'});
            }
            
        //devolver resultado

        return res.status(200).send({status: 'success', topic: topicRemoved});

        });
    },

    search : function(req,res){
        //sacar string a buscar de la url
        var searchString = req.params.search;
        //Find or
        Topic.find({$or:[
            {"title":{$regex: searchString, $options: 'i'}},
            {"content":{$regex: searchString, $options: 'i'}},
            {"code":{$regex: searchString, $options: 'i'}},
            {"lang":{$regex: searchString, $options: 'i'}}
            ]})
                .populate('user')
                .sort([['date','descending']]).exec((err,topics)=>{
                    if (err){
                        return res.status(500).send({status: 'error', message: 'Error en la peticion'});
                    }else if(!topics){
                        return res.status(404).send({status: 'error', message: 'No hay topics'});
                    }
                    
                //devolver resultado

                return res.status(200).send({status: 'success', topics: topics});

                });
    }
};

module.exports = controller;