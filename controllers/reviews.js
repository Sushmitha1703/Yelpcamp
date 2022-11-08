const campGround=require('../models/travel')
const reviews = require('../models/reviews')


module.exports.create=async(req,res,next)=>{
    const campgrounds= await campGround.findById(req.params.id)
    const review = new reviews(req.body.review)
    review.author= req.user._id
    campgrounds.review.push(review)
    await review.save()
    await campgrounds.save()
    req.flash('success','review created')
    res.redirect(`/campground/${campgrounds._id}`)
}


module.exports.delete= async(req,res,next)=>{
    async(req,res)=>{
        const {id,reviewId}= req.params
        await campGround.findByIdAndUpdate(id,{$pull:{review:reviewId}})
        await reviews.findByIdAndDelete(reviewId)
        req.flash('success','review deleted')
        res.redirect(`/campground/${id}`)
    }
}