const 	express 		= require('express'),
		app 			= express(),
		bodyParser		= require('body-parser'),
		mongoose		= require('mongoose'),
		methodOverride  = require("method-override"), 
		passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        User 			= require('./models/users.js'),
        flash           = require('connect-flash');

const 	locationRoutes	= require('./routes/locations.js'),
		loginRoutes		= require('./routes/login.js');

//Stores environment variables in .env file
require('dotenv').config()

//Allows routes to read req.body.{name attribute on input form}
app.use(bodyParser.urlencoded({extended: true}));

//File path for express to find static CSS files; dirname gets the current directory string
app.use(express.static(__dirname + "/public"));

//Allows HTML form to PUT & DELETE
app.use(methodOverride("_method"));

//DATABASEURL is set in environment variable. MongoDB is being hosted by MLAB
mongoose.connect(process.env.DATABASEURL)

//User Authentication
app.use(require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Allows flash messages
app.use(flash());

//res.locals sets "global" values in the EJS files
app.use(function(req, res, next){
    //Passes User data to every EJS file
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next();
})


app.get("/", (req, res) => {
	res.render('landing.ejs');
})

app.use(loginRoutes)
app.use("/locations", locationRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
	console.log("Server had started")
})

