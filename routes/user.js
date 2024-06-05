const express = require("express");
const router = express.Router();
const wrapAsync = require('../UTILS/wrapAsyn.js');
const User = require('../init/user.js');
const passport = require("passport");
const { error } = require("../schema.js");
const {saveRedirectUrl} = require('../middleware/authenticate.js');

router.get('/signUP', (req,res)=>{
  res.render("../views/user.ejs");
});

router.post("/signUP",async (req,res)=>{
  let { username, email, password } = req.body;

  const newUser = new User({email,username});
   const registeredUser =  await User.register(newUser,password);
   req.login(registeredUser, (err)=>{
    if(err){
      return next(err);
    }
    req.flash('success', 'Sign Up Successfully!');
    res.redirect("/listings");
   })
    
     console.log(registeredUser);
});

router.get('/logIn', (req,res)=>{
  res.render("../views/login.ejs");
});

router.post('/logIn',saveRedirectUrl, passport.authenticate('local',
   {
  failureRedirect:"/logIn",
  failureFlash: true,
}),

  async(req,res)=>{
    req.flash('success', 'Welcom Back!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);

});

router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash('success', 'Log Out successfully ');
    res.redirect('/listings');
   });
  
});

module.exports = router;