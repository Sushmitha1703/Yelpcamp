const express=require('express')
const router= express.Router()
const campGround=require('../models/travel')
var bodyParser = require('body-parser')
const {campgroundschema, reviewSchema}=require('./joischemas')
const catchasync=require('../utils/Asyncerrors')
const catchexpress=require('../utils/expresserrors')
const session=require('express-session')
const methodOverride=require('method-override')
const reviews = require('../models/reviews')
const user=require('../models/user')
const passport= require('passport')
const campgrounds= require('../controllers/campground')
const reviewsController= require('../controllers/reviews')
const userController= require('../controllers/users')
const multer  = require('multer')
const {storage}= require('../cloudinary/index')
const upload = multer({storage:storage})
const {loggedin,isauthor,validatedata,validatereview, isreviewauthor}= require('../middleware')




router.use(methodOverride('_method'))
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())


///campground/:id/reviews

router.post('/',validatereview,catchasync(reviewsController.create))


router.delete('/:reviewId',isreviewauthor,catchasync(reviewsController.delete))


module.exports = router;