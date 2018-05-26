
const middleware = {}

middleware.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First")
	res.redirect("/login")
}

middleware.checkOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Location.findById(req.params.id, (err, location) => {
			if(err){
				console.log(err)
				res.redirect('back')

			} else {
				if(location.author.id.equals(req.user.id)){
					return next()
				}
				req.flash("error", "You don't have permission to do that")
                res.redirect("/locations")
			}
		})
	} else {
		req.flash("error", "Please Login First")
		res.redirect("/locations")
	}
}

module.exports = middleware