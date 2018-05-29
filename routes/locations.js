const 	express		= require('express'),
		middleware	= require('../middleware') //If set to a folder, automatically grabs index.js
		Location	= require('../models/locations.js'),
		multer		= require('multer'),
        cloudinary 	= require('cloudinary')

const router = express.Router();

//Stores environment variables in .env file
require('dotenv').config()

//Handles Image Storage
const storage = multer.diskStorage({
	filename: (req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	}
})
const imageFilter = (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

//Connects to Image storage
cloudinary.config({ 
  cloud_name: 'kevinchen9315', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//Index
router.get("/", (req, res) => {
	Location.find({}, (err, locations) => {
		res.render('locations/index.ejs', {locations: locations});
	})
})

//New
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render('locations/new.ejs')
})

//Create
router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {

	const createLocation = () => {
		Location.create(req.body.location, (err, newLocation) => {
			if (err) {
				console.log(err)
				res.redirect('/locations')
			} else {
				newLocation.author.id = req.user._id;
	            newLocation.author.username = req.user.username
	            newLocation.save();
	            res.redirect('/locations')
			}
		})
	}

	if(req.file){
		cloudinary.uploader.upload(req.file.path, (result) => {
		req.body.location.image = result.secure_url
		createLocation()
		})
	} else {
		req.body.location.image = 'http://res.cloudinary.com/kevinchen9315/image/upload/v1526358053/hbzxngztwrxz8gu5nkgc.jpg';
		createLocation()
	}
})

//Show
router.get("/:id", (req, res) => {
	Location.findById(req.params.id, (err, location) => {
		if(err){
			console.log(err)
			res.redirect('/locations')
		} else {
			res.render('locations/show.ejs', {location: location})
		}
	})	
})

//Edit
router.get("/:id/edit", middleware.checkOwnership, (req, res) => {
	Location.findById(req.params.id, (err, location) => {
		if(err){
			console.log(err)
			res.redirect('/locations')
		} else {
			res.render('locations/edit.ejs', {location: location})
		}
	})
})

//Update
router.put("/:id", middleware.checkOwnership, (req, res) => {
	Location.findByIdAndUpdate(req.params.id, req.body.location, (err, location) => {
		if(err){
			console.log(err)
			res.redirect('/locations')
		} else {
			res.redirect('/locations/'+req.params.id)
		}
	})
})

//Delete
router.delete("/:id", middleware.checkOwnership, (req, res) => {
	Location.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			console.log(err)
			res.redirect('/locations')
		} else {
			res.redirect('/locations')
		}
	})
})

module.exports = router;