const { string } = require("joi")
const mongoose = require("mongoose")
const review=require('./reviews')
const user= require('./user')
const Schema=mongoose.Schema

const imageSchema= new Schema({
    url:String,
    filename:String
})

imageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_200');
})

const opts = {toJSON: { virtuals:true}};

const campGroundSchema= new Schema({
    title:String,
    images:[imageSchema],
    geometry:{
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:'review'
    }]
},opts)

campGroundSchema.virtual('properties.popUp').get(function(){
  return `
  <strong><a href="/campground/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0,30)}...</p>`
})

campGroundSchema.post('findOneAndDelete',async function (doc){
   if(doc){
    await review.deleteMany({
        _id:{$in:doc.review}
    })
   }
})


module.exports=mongoose.model('campGround',campGroundSchema)