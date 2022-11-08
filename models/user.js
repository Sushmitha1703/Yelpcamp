const mongoose= require('mongoose')
const passportlocal= require('passport-local-mongoose')

const Schema= mongoose.Schema

const userschema = Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    }
})

userschema.plugin(passportlocal)

module.exports = mongoose.model('user',userschema)