'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave-secreta-para-generar-token-9999';

exports.authenticate = function(req, res, next) {
    
    //comprobar si llega el token
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
    };
    
    //limpiar el token
    var token = req.headers.authorization.replace(/['"]+/g, '');
;

    
    try{
        //decodificar el token
        var payload = jwt.decode(token, secret);

        //comprobar si el token ha expirado
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'El token ha expirado'});
        }

    }catch(ex){
        return res.status(404).send({message: 'El token no es válido'});
    }

    //adjuntar usuario al request
    req.user = payload;

    //pasar a la accion
    
    next();
};