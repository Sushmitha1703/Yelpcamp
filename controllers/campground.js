const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapbox_token= process.env.MAPBOX_TOKEN
const geocoder=mbxGeocoding({accessToken:mapbox_token})
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary')


const campGround=require('../models/travel')
module.exports.index=async(req,res ,next)=>{
        const campgrounds= await campGround.find({})
        res.render('index',{campgrounds})
    
}

module.exports.newform=async(req,res ,next)=>{
        res.render('new')
}


module.exports.postnewcamp= async(req,res,next)=>{
    const geoData= await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
      }).send()
    const campgrounds=new campGround(req.body.campground)
    campgrounds.geometry= geoData.body.features[0].geometry
    campgrounds.images=req.files.map(f=>({url:f.path, filename:f.filename}))
    campgrounds.author= req.user._id
    await campgrounds.save()
    console.log(campgrounds)
    req.flash('success','Successfully made a new campground')
    res.redirect(`campground/${campgrounds._id}`)
}


module.exports.editform= async(req,res,next)=>{
    const {id}=req.params
    const campground=await campGround.findById(id)
    res.render('edit',{campground})
}

module.exports.update= async(req,res,next)=>{
    const {id}=req.params
    const campgrounds= await campGround.findById(id)
    console.log(req.body.deleteImages)
    if(!campgrounds){
        req.flash('error','Cannot find that campground')
        return res.redirect(`/campground/${campgrounds._id}`)
    }
    const camp=await campGround.findByIdAndUpdate(id,{...req.body.campground},{new:true})
    const img=req.files.map(f=>({url:f.path, filename:f.filename}))
    campgrounds.images.push(...img)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename)
        }
        await campgrounds.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
     }
    await campgrounds.save()
    req.flash('success','Successfully Updated campground')
    res.redirect(`/campground/${camp._id}`)
}


module.exports.showcamp=async(req,res,next)=>{
    const {id}=req.params
    const campgrounds= await campGround.findById(id).populate({
        path:'review',
        populate:{
            path:'author'
        }
         }).populate('author')
    console.log(campgrounds)
    if(!campgrounds){
        req.flash('error','Cannot find that campground :(')
        return res.redirect('/campground')
    }
    res.render('show',{campgrounds})

}


module.exports.delete=async(req,res,next)=>{
    const {id}=req.params
    await campGround.findByIdAndDelete(id)
    req.flash('success','Successfully deleted campground')
    res.redirect('/campground')
}