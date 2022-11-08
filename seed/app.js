const mongoose = require('mongoose')
const campGround=require('../models/travel')
const seed=require('./seeds')
const {descriptors,places}=require('./seeddescriptors')

mongoose.connect('mongodb://localhost:27017/campground')
const db=mongoose.connection
db.on('error',console.log.bind(console,'connection error'))
db.once('open',()=>{
    console.log('database connected')
})

const sample=array=>array[Math.floor(Math.random()*array.length)]
let pricerand=Math.floor(Math.random()*50)+30

const seedPlaces=async()=>{
    await campGround.deleteMany({})
    for(let i=0;i<300;i++){
        const random1000=Math.floor(Math.random()*1000);
        const random5000= Math.floor(Math.random()*5000)+1000;
        const camp=new campGround({
            author:"635781abeecb0ec7e53528ff",
            title:`${sample(descriptors)} ${sample(places)}`,
            location:`${seed[random1000].state}`,
            geometry:{
              type:"Point",
              coordinates:[
                seed[random1000].longitude,
                seed[random1000].latitude
            ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/du0lm77ah/image/upload/v1667135176/yelpcamp/wxlxo5nzfjfsga5irrex.jpg',
                  filename: 'yelpcamp/wxlxo5nzfjfsga5irrex',
                 //
                },
                {
                  url: 'https://res.cloudinary.com/du0lm77ah/image/upload/v1667371914/yelpcamp/s7ayoeniwosntoon05qe.jpg',
                  filename: 'yelpcamp/o1sqnwx2x2fshhangveh',
                }
              ],
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            price:pricerand
        })
        await camp.save()
    }
}


seedPlaces();