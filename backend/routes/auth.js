var express = require('express');
var router = express.Router();

var authController = require('../controllers/authController');
var userController = require('../controllers/userController');

router.post('/login', authController.login);
router.post(
  '/register',
  authController.verifyDataValid,
  authController.verifyEmail,
  authController.register,
);
router.get('/logout', authController.logout);
router.get('/profile', authController.verifyToken, userController.profile);
router.put(
  '/edit-profile',
  authController.verifyToken,
  userController.editProfile,
);
router.get(
  '/userprofile/:id',
  authController.verifyToken,
  userController.getUser,
);
router.post(
  '/verify-password',
  authController.verifyToken,
  authController.verifyPassword,
);

router.post(
  '/verify-auth-admin',
  authController.verifyToken,
  authController.verifyRoleAdminReturn,
);
router.post(
  '/verify-auth-promoter',
  authController.verifyToken,
  authController.verifyRolePromoter,
);

module.exports = router;
