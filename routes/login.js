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
            req.flash("success", "User Created!")
            res.redirect("/locations");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login.ejs");
});

router.post("/login", (req, res, next) => {
    const redirectTo = req.session.redirectTo ? req.session.redirectTo : '/locations'
    
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.log(err)
            return next(err)
        }
        if(!user){
            req.flash("error", "Invalid Username/Password")
            return res.redirect('/login')
        }
        req.logIn(user, (err) => {
            if (err) { 
                return next(err)
            }
            delete req.session.redirectTo
            return res.redirect(redirectTo)
        })
    })(req, res, next)
})



    
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!")
    res.redirect("/locations");
});

module.exports = router;