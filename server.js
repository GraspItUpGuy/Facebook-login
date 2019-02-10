const express = require('express')
const passport = require('passport')
const Strategy = require('passport-facebook').Strategy;

const port = process.env.PORT || 3000

// from the documentation
passport.use(new Strategy({
    clientID : "354750295125258",
    clientSecret: "0871db3b3cbf23350d706bc4ac0374d9",
    callbackURL : "http://localhost/login/facebook/return",
}, (accessToken, refreshToken, profile, cb)=>{
    return cb(null, profile);
})
);  //  copied till here .....

passport.serializeUser(function(user,cb){
    cb(null, user);
})

passport.deserializeUser(function(obj,cb){
    cb(null, obj);
})

//create express server
const app = express()

//set view dirs
app.set("views", __dirname +  "/views")
app.set("view engine", "ejs")


// configruation -> grab them from the npm page
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extened: true}))
app.use(require('express-session')({secret : 'GraspItUp App', resave : true,
saveUninitialized  : true}));


//@route  -   GET  /home
//@desc   -   a route to home page
//@access -   PUBLIC
//@source -   express
app.get('/',(request,response)=>{
     response.render('home.ejs', {user: request.user})
})


//@route  -   GET  /login
//@desc   -   a route to Login page
//@access -   PUBLIC
//@source -   express
app.get('/login',(request,response)=>{
    response.render('login.ejs')
});

//@route  -   GET  /login/facebook
//@desc   -   a route to facebook auth
//@access -   PUBLIC
//@source -   documentation -> passport-facebook on github
app.get('/login/facebook',
  passport.authenticate('facebook'));   // to call the strategy


//@route  -   GET  /login/facebook/callback
//@desc   -   a route to Login page
//@access -   PUBLIC
//@source -   documentation -> passport-facebook on github
// incase user clicks and then decides that he doesn't want to be logged in

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res)=> {
    // Successful authentication, redirect home.
    res.redirect('/');
    // incase user clicks and then decides that he doesn't want to be logged in
  });

//@route  -   GET  /profile
//@desc   -   a route to profile of the user
//@access -   PROTECTED
//@source -   documentation -> passport-facebook on github
app.get('/profile', require('connect-ensure-login').ensureLoggedIn(),(req,res)=>{
   res.render('profile', {user : req.user})
})


app.listen(port,()=>{
   console.log(`Server is running at  ${port}`)
})