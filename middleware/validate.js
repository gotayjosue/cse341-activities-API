const { body, validationResult } = require('express-validator');

const validate = {};

// Rules to add or update activities
validate.activityRules = [
    body('activity_name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be 3-50 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
    body('responsible')
        .notEmpty().withMessage('responsible is required'),
    body('time')
        .notEmpty().withMessage('Time is required'),
    body('organization')
        .notEmpty().withMessage('Organization is required'),
    body('completed')
        .isBoolean('Activity status must be true or false')

];


// Middleware for reviewing results
validate.check = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
};

module.exports = validate;