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


router.route('/')
    .get(catchasync(campgrounds.index))
    .post(upload.array('images'),validatedata,catchasync(campgrounds.postnewcamp))


router.get('/new',loggedin,catchasync(campgrounds.newform))

router.route('/:id')
      .get(catchasync(campgrounds.showcamp))
      .put(isauthor,upload.array('images'),catchasync(campgrounds.update))
      .delete(isauthor,catchasync(campgrounds.delete))


router.get('/:id/edit',isauthor,catchasync(campgrounds.editform))


module.exports = router
