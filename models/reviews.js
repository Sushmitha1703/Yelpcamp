const mongoose = require("mongoose")
const Schema=mongoose.Schema

const reviewSchema= new Schema({
    text:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
})

module.exports=mongoose.model('review',reviewSchema)