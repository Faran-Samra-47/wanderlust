const Listing = require('../models/listing');
const ExpressError = require("../UTILS/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.Map_Token;
const geocodingClient = mbxGeocoding({ accessToken:mapToken  });


module.exports.Index =  async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.RenderNewEjs = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.ShowListing =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate('owner');
    res.render("listings/show.ejs", { listing });
};

module.exports.postListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 2
  })
    .send();
    if (!req.body.listing) {
      throw new ExpressError(400, 'Send Valid Data');
    }
    
    const { title, description, price, location, country, image } = req.body.listing;
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      image: {
        filename: req.file.filename, 
        url: req.file.path 
      }
    });
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
   let savedGEO =  await newListing.save();
   console.log(savedGEO);
    req.flash("success","New Listing Created Successfully");
    res.redirect(`/listings`);
  };

  module.exports.RenderEditEjs = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};
 

module.exports.UpdatingListing = async (req, res) => {
  try {
    if (!req.body.listing) {
      throw new ExpressError(400, 'Send Valid Data');
    }
    const { id } = req.params;
    const { title, description, price, location, country, image } = req.body.listing;
    let updatedFields = {
      title,
      description,
      price,
      location,
      country,
    };
    // Check if image exists and add it to updatedFields
    if (req.file) {
      updatedFields.image = {
        filename: req.file.filename,
        url: req.file.path,
      };
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedListing) {
      req.flash("error", "Listing not found or could not be updated");
      return res.redirect("/listings");
    }
    req.flash("success", "Listing Edit Successfully");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing");
    res.redirect(`/listings/${id}/edit`);
  }
};


 module.exports.Destroy = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted Successfully");
    res.redirect("/listings");
  };

