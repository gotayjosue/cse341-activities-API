const express = require('express');
const router = new express.Router();
const controllers = require('../controllers/mainController')
const validate = require('../middleware/validate')
const {isAuthenticated} = require('../middleware/authentication')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json');
const passport = require('passport');

router.use('/api-docs', swaggerUi.serve)

router.get('/', controllers.homePage);
router.get('/activities', controllers.getAllActivities)
router.get('/users', controllers.getAllUsers)
router.get('/activities/:id', controllers.getActivityById)
router.get('/users/:id', controllers.getUserById)
router.get('/api-docs', swaggerUi.setup(swaggerDocument))
router.get('/login', passport.authenticate('github'), (req, res) => {})

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }

        req.session.destroy(function (err){
            if (err) {
                console.error("Error destroying session", err);
            }

            res.clearCookie('connect.sid')

            res.redirect('/');
        })
        
    });
});


router.post('/activities', isAuthenticated, validate.activityRules, validate.check, controllers.createActivity)
router.post('/users', isAuthenticated, validate.userRules, validate.check, controllers.createUser)

router.put('/activities/:id', isAuthenticated, validate.activityRules, validate.check, controllers.updateActivity)
router.put('/users/:id', isAuthenticated, validate.userRules, validate.check, controllers.updateUser)

router.delete('/activities/:id', isAuthenticated, controllers.deleteActivity)
router.delete('/users/:id', isAuthenticated, controllers.deleteUser)

module.exports = router