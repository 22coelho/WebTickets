var express = require('express');
var router = express.Router();

const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');
const User = require('../models/User');


router.get(
  '/',
  authController.verifyToken,
  authController.verifyRoleAdmin,
  userController.getUsers,
);

router.post('/cancelticket', authController.verifyToken, userController.cancelTicket);

router.put(
  '/sendrequest',
  authController.verifyToken, 
  authController.verifyRoleClient,
  userController.sendRequest,
);

router.put(
  '/refuserequest/:id?',
  authController.verifyToken,
  authController.verifyRoleAdmin,
  userController.removeRequest,
);

router.put(
  '/acceptrequest/:id?',
  authController.verifyToken,
  authController.verifyRoleAdmin,
  userController.acceptRequest,
);

router.get(
  '/mytickets',
  authController.verifyToken,
  userController.showMyTickets,
);

router.delete('/deleteuser/:id?', authController.verifyToken, authController.verifyRoleAdmin, userController.deleteUser);
router.delete('/deleteme/:id', authController.verifyToken, userController.deleteUser);


module.exports = router;
