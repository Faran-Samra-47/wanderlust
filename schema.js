const Joi = require('joi');

let validateSchema = Joi.object({
    review: Joi.object({
       rating: Joi.number().required(),
       comment: Joi.string().required()
    }).required()
});

module.exports = validateSchema;
