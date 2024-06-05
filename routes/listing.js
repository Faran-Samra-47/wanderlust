const express = require("express");
const router = express.Router();
const wrapAsync = require('../UTILS/wrapAsyn.js');
const ExpressError = require("../UTILS/ExpressError.js");
const validateSchema = require('../schema');
const Listing = require("../models/listing.js");
const isLoggedIn = require('../middleware/authenticate.js');
const listingController = require("../Controllers/listing.js");
const middleware = require('../middleware/authenticate.js');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage});


//Index Route
router.get("/", listingController.Index);
  
  //New Route
router.get("/new",isLoggedIn, listingController.RenderNewEjs);

//Show Route
router.get("/:id", wrapAsync(listingController.ShowListing));
  
  //Create Route
router.post("/",isLoggedIn, upload.single('listing[image]'),wrapAsync(listingController.postListing));



  
//Edit Route
router.get("/:id/edit", isLoggedIn,wrapAsync(listingController.RenderEditEjs));

  
//Update Route
router.put("/:id",isLoggedIn,upload.single('listing[image]'), wrapAsync(listingController.UpdatingListing ));

router.delete("/:id",isLoggedIn, listingController.Destroy);
  

module.exports = router;  