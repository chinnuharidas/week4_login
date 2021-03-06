// const { response } = require('express');
var express = require('express');
var router = express.Router();

var verifyLogin = (req, res, next) => {
	if (req.session.userLoggedIn) {
		next()
	} else {
		res.redirect('/login')
	}
}

router.get('/', (req, res) => {
	var user = req.session.user;
	if (req.session.user) {
		res.render('user/home', { user })
	} else {
		res.redirect('/login')
	}
})

router.get('/login', (req, res) => {
	if (req.session.user) {
		res.redirect('/')
	} else {
		res.render('user/login', { "LoginErr": req.session.userLoginErr })
		req.session.userLoginErr = false
	}
})

function doLogin(formDatas) {
	const formEmail = formDatas.Email;
	const formPassword = formDatas.Password;
	var response = {}
	var user = { Email: 'user@gmail.com', _id: 123, Name: 'Chinnu' , Password: '12345'}
	if (user.Email === formEmail && user.Password === formPassword ) {
		console.log("Login Success");
		response.user = user
		response.status = true
	} else {
		console.log("Login Failed : User doesnot exist");
		response.user = null;
		response.status = false;
	}
	return response;
}

router.post('/login', (req, res) => {
	var response = doLogin(req.body);
	if (response.status) {
		req.session.user = response.user
		req.session.userLoggedIn = true
		res.redirect('/')
	} else {
		req.session.user = null
		req.session.userLoggedIn = false
		req.session.userLoginErr = "Invalid Username or Password"
		res.redirect('/login')
	}
})

router.get('/logout', (req, res) => {
	// req.session.destroy()
	req.session.user = null
	req.session.userLoggedIn = false
	res.redirect('/')
})

module.exports = router;