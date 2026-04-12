const Joi = require("joi");

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      return res
        .status(400)
        .json({ code: "VALIDATION_ERROR", message: messages });
    }
    req.validated = value;
    next();
  };
};

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "নাম প্রয়োজন",
    "string.min": "নাম কমপক্ষে 3 অক্ষর",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "ইমেইল প্রয়োজন",
    "string.email": "বৈধ ইমেইল প্রয়োজন",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "পাসওয়ার্ড প্রয়োজন",
    "string.min": "পাসওয়ার্ড কমপক্ষে 6 অক্ষর",
  }),
  phone: Joi.string().min(10).max(15).optional().messages({
    "string.empty": "ফোন নম্বর প্রয়োজন",
  }),
  role: Joi.string().valid("viewer", "admin").default("viewer"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const passwordResetSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
  resetToken: Joi.string().required(),
});

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email().required(),
});

const propertySchema = Joi.object({
  title: Joi.string().min(10).max(200).required(),
  description: Joi.string().min(50).max(5000).required(),
  category: Joi.string().required(),
  propertyType: Joi.string().required(),
  location: Joi.object({
    division: Joi.string().required(),
    district: Joi.string().required(),
    area: Joi.string().required(),
    address: Joi.string().allow('', null),
  }).required(),
  price: Joi.string().required(),
  bedrooms: Joi.number().min(0).allow('', null),
  bathrooms: Joi.number().min(0).allow('', null),
  size: Joi.number().min(0).allow('', null),
  amenities: Joi.array().items(Joi.string()).allow(null),
  images: Joi.array().items(Joi.any()).allow(null),
});

const validateProperty = (req, res, next) => {
  const { error, value } = propertySchema.validate(
    {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      propertyType: req.body.propertyType || req.body.type,
      location:
        typeof req.body.location === "string"
          ? JSON.parse(req.body.location || "{}")
          : req.body.location,
      price: req.body.price,
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : undefined,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
      size: req.body.size ? Number(req.body.size) : undefined,
      amenities: typeof req.body.amenities === 'string' ? JSON.parse(req.body.amenities || '[]') : req.body.amenities,
    },
    { abortEarly: false, stripUnknown: true },
  );

  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return res
      .status(400)
      .json({ code: "VALIDATION_ERROR", message: messages });
  }
  req.validated = value;
  next();
};

module.exports = {
  validateRequest,
  validateProperty,
  registerSchema,
  loginSchema,
  passwordResetSchema,
  passwordResetRequestSchema,
  propertySchema,
};
