const campGround=require('./models/travel')
const catchexpress=require('./utils/expresserrors')
const {campgroundschema, reviewSchema}=require('./routes/joischemas')
const reviews = require('./models/reviews')
module.exports.loggedin =(req,res,next)=>{
  if(!req.isAuthenticated()){
     req.session.returnTo= req.originalUrl
     req.flash('error','Sign in to view')
     return res.redirect('/login')
  }
  else{
    next();
  }
}

module.exports.isauthor= async(req,res,next)=>{
  const {id}=req.params
    const campgrounds= await campGround.findById(id)
    if(!campgrounds.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campground/${campgrounds._id}`)
    }
    else{
    next();
    }
}

module.exports.isreviewauthor= async(req,res,next)=>{
  const {id,reviewId}=req.params
  const review= await reviews.findById(reviewId)
  if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campground/${id}`)
    }
    next();
}

module.exports.validatedata=(req,res,next)=>{
  const {error}=campgroundschema.validate(req.body)
  if(error){
      const msg=error.details.map(el=>el.message).join(',')
      throw new catchexpress(msg,400)
  }
  else{
      next();
  }
}

module.exports.validatereview=(req,res,next)=>{
  const {error}=reviewSchema.validate(req.body)
  if(error){
      const msg=error.details.map(el=>el.message).join(',')
      throw new catchexpress(msg,400)
  }
  else{
      next();
  }
}