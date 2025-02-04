const { check, validationResult } = require('express-validator');

const captchaValidationRules = () => {
  return [
    check('captchaInput')
      .trim()
      .isLength({ min: 6 })
      .withMessage('CAPTCHA input must be 6 characters long')
      .escape(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  captchaValidationRules,
  validate,
};
