const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport=require("passport");
const { saveRedirectUrl } = require('../middleware');

router.get('/signup', (req, res) => {
    res.render('user/signup.ejs');
});

router.post('/signup',wrapAsync( async (req, res) => {
    
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash('success', 'Welcome to Wanderlust!');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', err.message);
        res.redirect('/signup');
    }
}));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs")
});

router.post("/login",saveRedirectUrl,
    passport.authenticate('local',{failureRedirect:'/login',failureFlash:true},)
    ,async(req,res)=>{
        req.flash("success","you are logged in");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);

});

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out successfully");
        res.redirect("/listings");
    })
})

module.exports = router;
