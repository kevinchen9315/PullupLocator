const 	express 		= require('express'),
		app 			= express(),
		bodyParser		= require('body-parser'),
		mongoose		= require('mongoose'),
		methodOverride  = require("method-override"), 
		passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        User 			= require('./models/users.js');

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
console.log(process.env.DATABASEURL)
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

//Passes User data to every route
app.use(function(req, res, next){
    //Locals is a "global" object in the Res object
    res.locals.currentUser = req.user;
    next();
})


app.get("/", (req, res) => {
	res.render('landing.ejs');
})

app.use(loginRoutes)
app.use("/locations", locationRoutes);

app.listen("8080", () => {
	console.log("Server had started")
})

