
const middleware = {}

middleware.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
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
                res.redirect("back")
			}
		})
	} else {
		res.redirect("back")
	}
}

module.exports = middleware