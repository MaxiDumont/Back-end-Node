'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-V2');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    content : String,
    date : { type: Date, default: Date.now },
    user : { type: Schema.ObjectId, ref: 'User' }
});

var coment = mongoose.model('Comment', CommentSchema);

var TopicSchema = new Schema({
    title : String,
    content : String,
    code : String,
    lang : String,
    date : { type: Date, default: Date.now },
    user : { type: Schema.ObjectId, ref: 'User' },
    comments : [CommentSchema]
});
//cargar paginacion
TopicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Topic', TopicSchema);