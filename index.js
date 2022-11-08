if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}
//mongodb+srv://sushmitha:<password>@cluster0.8az0s4s.mongodb.net/?retryWrites=true&w=majority
const express=require('express')
const mongoose = require('mongoose')
const app=express()
const session=require('express-session')
const ejsmate=require('ejs-mate')
const flash=require('connect-flash')
const passport =  require('passport')
const user=require('./models/user')
const Plocal =  require('passport-local')
//const {MongoStore}= require('connect-mongo');
const MongoStore = require('connect-mongo')
const dbUrl= process.env.DB_URL || 'mongodb://localhost:27017/campground';
//
mongoose.connect(dbUrl,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl:true
})
const db=mongoose.connection
db.on('error',console.log.bind(console,'connection error'))
db.once('open',()=>{
    console.log('database connected')
})

const secret= process.env.SECRET || 'thisisasecret'

const store =  MongoStore.create({
    mongoUrl:dbUrl,
    secret,
    touchAfter:24*60*60
})

store.on("error", function(e){
    console.log("SESSION STORE ERROR")
})

const sessionConfig={
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now + 1000*60*60*24*7 , 
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new Plocal(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())



app.use((req,res,next)=>{
   // if(!['/login','/'].includes(req.originalUrl)){
    //    req.session.returnTo= req.originalUrl
   // }
    res.locals.currentUser= req.user
    res.locals.success = req.flash('success')
    res.locals.error=req.flash('error')
    next();
})

const indexRouter=require('./routes/route')


app.listen('8000',()=>{
    console.log('listening on port 8000')
})
app.engine('ejs',ejsmate)
app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.use('/public',express.static(__dirname+'/public'))
app.use('/',indexRouter)
