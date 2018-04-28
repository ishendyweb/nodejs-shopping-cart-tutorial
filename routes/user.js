var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders, user: req.user });
    });
});

router.get('/users/:userId?', isLoggedIn, isAdmin, function (req, res, next) {
	if(req.params.userId){
		User.findById(req.params.userId, function(err, user) {
			if (err) {
				return res.write('Error!');
			}
			Order.find({user: user}, function(err, orders) {
				if (err) {
					return res.write('Error!');
				}
				var cart;
				orders.forEach(function(order) {
					cart = new Cart(order.cart);
					order.items = cart.generateArray();
				});
				user.orders = orders;
			});
			res.render('user/user_orders', { userO: user });
		});
	}else{
		User.find({ email: { $ne: req.user.email } }, function(err, users) {
			if (err) {
				return res.write('Error!');
			}
			users.forEach(function(user) {
				Order.find({user: user}, function(err, orders) {
					if (err) {
						return res.write('Error!');
					}
					var cart;
					orders.forEach(function(order) {
						cart = new Cart(order.cart);
						order.items = cart.generateArray();
					});
					user.orders = orders;
				});
			});
			res.render('user/users', { users: users });
		});
	}
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isAdmin(req, res, next) {
    if (req.user.admin) {
        return next();
    }
    res.redirect('/');
}