const lR = require('../routes/listing');

let isLoggedIn =(req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
       req.flash('error','You must be logged in')
       return res.redirect('/logIn');
    }
    next();
};

module.exports = isLoggedIn;

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
 };

module.exports.Validate = (req, res, next) => {
    const { error } = validateSchema.validate(req.body);
    if (error) {
        const errMsg = error.message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
  };

  
