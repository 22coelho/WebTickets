var express = require('express');
const locationController = require('../controllers/LocationController');
const authController = require('../controllers/AuthController');
var router = express.Router();

router.get('/locations', locationController.showAll);
router.post(
  '/:id?/local',
  locationController.save,
);

module.exports = router;
