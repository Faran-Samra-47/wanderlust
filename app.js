if(process.env.NODE_ENV != "prodeuction"){
       require('dotenv').config()
}; 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./UTILS/wrapAsyn.js');
const ExpressError = require("./UTILS/ExpressError.js");
const { render } = require("ejs");
const validateSchema = require('./schema');
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./init/user.js");



const listing = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const userRoute= require("./routes/user.js");


const MONGO_URL = process.env.ATLASDB;



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const sessionOption = {
  secret:"MysecretCode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires : Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpsOnly: true,
  }

}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user; // Passing req object to res.locals.req
  next();
});

app.use("/listings",listing);
app.use("/listings/:id/reviews", reviews);
app.use("/",userRoute);

app.all('*',(req,res,next)=>{
  res.render('listings/NotF.ejs');
});
app.use((err, req, res, next) => {
  let statusCode = err.status || 500; // Default to 500 if status is not provided
  let message = err.message || 'Internal Server Error'; // Default error message
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
