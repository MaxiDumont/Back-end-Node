'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var jwt = require('../services/jwt');
const user = require('../models/user');

var controller = {

    probando: function(req, res) {
        return res.status(200).send({ message: 'Probando el controlador de usuarios' });
    },

    testeando: function(req, res){
        return res.status(200).send({message: 'testenado el controlador de usuarios'});

    },

    save : function(req, res){
        var params = req.body;


        //validar datos
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
            

            if(validate_name && validate_surname && validate_email && validate_password){
                //crear el usuario
                var user = new User();

                //asignar valores
                user.name = params.name;
                user.surname = params.surname;
                user.email = params.email.toLowerCase();
                user.image = "null";

                user.role = 'ROLE_USER';
                

                //comprobar usuario duplicado
                User.findOne({email: user.email}, (err, issetUser) => {
                    if(err){
                        return res.status(500).send({message: 'Error al comprobar usuario'});
                    }

                    if(!issetUser){
                        //si no existe cifrar la contraseña
                        bcrypt.hash(params.password, null, null, function(err, hash){
                            user.password = hash;

                            //guardar usuario
                            user.save((err, userStored) => {
                                if(err){
                                    return res.status(500).send({message: 'Error al guardar el usuario'});
                                }

                                if(!userStored){
                                    return res.status(404).send({message: 'No se ha registrado el usuario'});
                                }

                                //devolver respuesta
                                return res.status(200).send({
                                    status: 'success',
                                    user: userStored});
                            });//close save
                            
                        });//close hash
                    }else{
                        return res.status(200).send({message: 'El usuario ya existe'});
                    }
                });//close findOne

            }else{
                return res.status(200).send({message: 'Faltan datos por enviar'});
            }
        }catch(err){
            return res.status(200).send({message: 'Error al validar los datos'});
    }        
    },

    login: function(req, res){
        //recoger los parametros de la petecion
        var params = req.body;

        //validar datos
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);
        
        if (!validate_email || !validate_password){
            return res.status(200).send({message: 'Los datos son incorrectos'});
        }

        //buscar usuario por email
        User.findOne({email: params.email.toLowerCase()}, (err, user) => {
        
            if(err){
                return res.status(500).send({message: 'Error al comprobar el usuario'});
            }

            if(!user){
                return res.status(404).send({message: 'El usuario no existe'});
            }
            //si lo encuuentra
            //comprobar la contraseña (concidencias de email y password /bcrypt)
            bcrypt.compare(params.password, user.password, (err, check) => {

                //si es correcto
                if(check){
                    //generar y devolver el token de jwt
                    if(params.gettoken == "true"){
                        //devolver token jwt
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                        //devolver datos de usuario
                        user.password = undefined;
                        return res.status(200).send({
                            status: 'success',
                            message: 'Acceso correcto',
                            user: user,});
                    }
                }else{
                    return res.status(404).send({message: 'El usuario no ha podido logearse'});
                }//close check
            });//close bcrypt
        });//close findOne
    },

    update: function(req, res){
        //recoger los parametros de la petecion
        var params = req.body;

        try{
            //validar datos
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        }catch(err){
            return res.status(200).send({message: 'faltan datos por enviar',params});
        }
        //eliminar propiedades innecesarias
        delete params.password;

        //comprobar si el email es unico
        if(req.user.email != params.email){
            User.findOne({email: params.email.toLowerCase()}, (err, user) => {
        
                if(err){
                    return res.status(500).send({message: 'Error al comprobar el usuario'});
                }
    
                if(user){
                    return res.status(200).send({message: 'El usuario no puede ser modificado'});
                }else{
                    //buscar y actualizar el usuario
                    User.findOneAndUpdate({_id: req.user.sub}, params, {new: true}, (err, userUpdated) => {
                        if(err || !userUpdated){
                            return res.status(500).send({status: 'error',message: 'Error al actualizar el usuario'});
                        }

                    //devolver una respuesta
                    return res.status(200).send({status:"success",message: 'Actualizar usuario', user: userUpdated});
                    });
                }

            });
        }else{
            //buscar y actualizar el usuario
            User.findOneAndUpdate({_id: req.user.sub}, params, {new: true}, (err, userUpdated) => {
            if(err || !userUpdated){
            return res.status(500).send({status: 'error',message: 'Error al actualizar el usuario'});
            }
            
            //devolver una respuesta
            return res.status(200).send({status:"success",message: 'Actualizar usuario', user: userUpdated});
            });
        }
    },

    uploadAvatar: function(req, res){
        //configurar el modulo multiparty para subir archivos se realiza en routes/user.js

        //recoger el fichero de la peticion
        var file_name = 'Avatar no subido...';

        if(!req.files){
            return res.status(404).send({status:'error',message: file_name});
        }

        //Conseguir el nombre y la extencion del archivo 
        var file_path = req.files.file0.path;
        //advertencia en linux o mac tienes que poner esta otra linea || var file_split = file_path.split('/');
        var file_split = file_path.split('\\');
        //nombre del archivo
        var file_name = file_split[2];
        //extencion del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        //comprobar la extencion (solo imagenes), si no es valida borrar fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //borrar el archivo
            fs.unlink(file_path, (err) => {
                return res.status(200).send({status: 'error', message: 'La extencion del archivo no es valida'});
            });
        }else{
            //sacar el id del user identificadp
            var userId = req.user.sub;
            //buscar y actualizar el documento
            User.findOneAndUpdate({_id: userId}, {image: file_name}, {new: true}, (err, userUpdated) => {
                if(err || !userUpdated){
                    return res.status(500).send({status: 'error',message: 'Error al actualizar el usuario'});
                }
                //devolver una respuesta
                return res.status(200).send({status:"success",message: 'Actualizar usuario', user: userUpdated});
            })//close findOneAndUpdate
        }  
    },

    avatar: function(req, res){
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/'+fileName;

        fs.exists(pathFile, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(pathFile));
            }else{
                return res.status(404).send({message: 'La imagen no existe'});
            }
        });
    },

    getUsers: function(req, res){
        User.find({}, (err, users) => {
            if(err){
                return res.status(500).send({status:'error', message: 'Error en la peticion'});
            }
            if(!users){
                return res.status(404).send({status:'error', message: 'No hay usuarios'});
            }
            return res.status(200).send({status:'success',users});
        });

    },

    getUser: function(req, res){
        var userId = req.params.userId;
        User.findById(userId).exec((err, user) => {
            if(err){
                return res.status(500).send({status:'error', message: 'Error en la peticion'});
            }
            if(!user){
                return res.status(404).send({status:'error', message: 'El usuario no existe'});
            }

            return res.status(200).send({status:'success',user});
        });
    }

};

module.exports = controller;