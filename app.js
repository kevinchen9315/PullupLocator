const 	express 		= require('express'),
		bodyParser		= require('body-parser'),
		mongoose		= require('mongoose'),
		Location		= require('./models/locations.js');

const app = express();

//Allows routes to read req.body.{name attribute on input form}
app.use(bodyParser.urlencoded({extended: true}))
//File path for express to find static CSS files; dirname gets the current directory string
app.use(express.static(__dirname + "/public"))
//DATABASEURL is set in environment variable. MongoDB is being hosted by MLAB
mongoose.connect(process.env.DATABASEURL)

Location.create({name:'TestLocation1'}, (err, location) => {
	if(err) {
		console.log(err)
	} else {
		console.log('Added Location!')
	}
})


app.get("/", (req, res) => {
	res.render('landing.ejs');
})

app.get("/locations", (req, res) => {
	Location.find({}, (err, locations) => {
		res.render('index.ejs', {locations: locations});
	})
	
})

app.listen("8080", () => {
	console.log("Server had started")
})

