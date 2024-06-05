const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Api_key,
    api_secret: process.env.Api_Secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Wanderlust',
        allowedFormats: ['jpg', 'jpeg', 'png'],
    
    },
});

// Export both storage and cloudinary as properties of an object
module.exports = {
    storage,
    cloudinary,
};
