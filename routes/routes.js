const express = require('express');
const router = new express.Router();
const controllers = require('../controllers/mainController')
const validate = require('../middleware/validate')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

router.use('/api-docs', swaggerUi.serve)

router.get('/', controllers.homePage);
router.get('/activities', controllers.getAllActivities)
router.get('/users', controllers.getAllUsers)
router.get('/activities/:id', controllers.getActivityById)
router.get('/users/:id', controllers.getUserById)
router.get('/api-docs', swaggerUi.setup(swaggerDocument))


router.post('/activities', validate.activityRules, validate.check, controllers.createActivity)
router.post('/users', validate.userRules, validate.check, controllers.createUser)

router.put('/activities/:id', validate.activityRules, validate.check, controllers.updateActivity)
router.put('/users/:id', validate.userRules, validate.check, controllers.updateUser)

router.delete('/activities/:id', controllers.deleteActivity)
router.delete('/users/:id', controllers.deleteUser)

module.exports = router