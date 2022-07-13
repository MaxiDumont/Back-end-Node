'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String
});

//para borrar la contraseña de los json enviados
UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

module.exports = mongoose.model('User', UserSchema);
                            //lowercase y plralizar el nombre de la coleccion
                            //user -> documentos(schema)