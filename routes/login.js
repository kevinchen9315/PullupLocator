const   express 	= require("express"),
        router  	= express.Router(),
        passport	= require("passport"),
        User    	= require("../models/users.js");


router.get('/register', (req, res) => {
	res.render('register.ejs')
})

router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req, res, () => {
            res.redirect("/locations");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/locations",
        failureRedirect:"/login"
    })
);

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/locations");
});

module.exports = router;