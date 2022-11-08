const campGround=require('../models/travel')
const reviews = require('../models/reviews')
const user= require('../models/user')


module.exports.register=async(req,res,next)=>{
        res.render('users/register')
}

module.exports.postregister= async(req,res,next)=>{
    try{ 
        const {username,email,password}= req.body
        const User= new user({username,email})
        const registereduser= await user.register(User,password)
        req.login(registereduser,err=>{
            if(err){
                return next(err);
            }
            else{
                req.flash('success','Welcome to Campxgrounds')
                res.redirect('/campground')
            }
        })
    }
        catch(e){
            req.flash('error',e.message)
            res.redirect('/register')
        }
}


module.exports.loginpage=async(req,res,next)=>{
    res.render('users/login')
}

module.exports.login=async(req,res,next)=>{
    req.flash('success','welcome back')
    const redirecturl = req.session.returnTo || '/campground'
    delete req.session.returnTo
    res.redirect(redirecturl)
}


module.exports.logout=async(req,res,next)=>{
    req.logOut(function(err) {
        if (err) { return next(err); }
        req.flash('success','Seeya ya soon')
        res.redirect('/');
})
}