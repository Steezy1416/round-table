// set up landing page routes for login and signup
const router = require('express').Router();

// route user to login.handlebars page when they first visit the site
router.get('/', async (req, res) => {
  res.render('login');
});

// route user to signup.handlebars page when they click the signup button
router.get('/signup', async (req, res) => {
  res.render('signup');
});

module.exports = router;
