// init/index.js

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

const initDB = async () => {
  await Listing.deleteMany({});
  // Ensure that each image property is formatted as an object
  const listings = initData.data.map(listing => ({
    ...listing,
    image: {
      filename: listing.image.filename,
      url: listing.image.url
    }
  }));
 // Create a new array with the owner added, instead of reassigning listings
 const updatedListings = listings.map(obj => ({
  ...obj,
  owner: "6636876205126bb50961dc39"
}));

await Listing.insertMany(updatedListings);
console.log("data was initialized");
};

initDB();