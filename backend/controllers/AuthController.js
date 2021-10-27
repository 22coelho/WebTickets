var User = require('../models/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../authconfig');


var authController = {};

authController.login = function (req, res) {
  var emailValidator = /\S+@\S+\.\S+/;

  if (!emailValidator.test(req.body.email)) {
    return res.status(400).send({ auth: false, message: 'Invalid Email' });
  }

  if (req.body.password.length < 6 || req.body.password.length > 16) {
    return res
      .status(400)
      .send({ auth: false, message: 'Invalid Password Length' });
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(500).send('Error on the server.');
    }
    if (!user || user === null) {
      return res.status(404).send('No user found.');
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    } else {
      if (user.active === false) {
        return res.status(404).send('No active user.');
      }
      var token = jwt.sign({ user: user }, config.secret, {
        expiresIn: 86400, //24 hours
      });

      return res.status(200).send({ auth: true, token: token });
    }
  });
};

authController.logout = function (req, res) {
  return res.status(200).send({ auth: false, token: null });
};

authController.verifyEmail = (req, res, next) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      return res.status(500).end('There was a problem registering the user.');
    }
    if (user) {
      return res.status(409).end('Email already in use');
    }
    next();
  });
};

authController.register = function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      typeUser: 'client',
      sentRequest: false,
      ticketsBought: 0,
    },
    function (err, user) {
      if (err) {
        return res.status(500).end('There was a problem registering the user.');
      } else {
        var token = jwt.sign({ user: user }, config.secret, {
          expiresIn: 84600, //24
        });
        return res.status(200).send({ auth: true, token: token });
      }
    },
  );
};

authController.verifyPassword = (req, res, next) => {
  User.findOne({ email: req.user.email }, function (err, user) {
    if (err) {
      return res.status(500).send('Error on the server.');
    }
    if (!user || user === null) {
      return res.status(404).send('No user found.');
    }

    if (user) {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
      );

      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
      } else {
        return res
          .status(200)
          .send({ auth: true, password: req.body.password });
      }
    }
  });
};

authController.verifyToken = function (req, res, next) {
  var token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  } else {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: 'Failed to authenticate token.' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  }
};

authController.verifyRoleAdmin = function (req, res, next) {
  User.findById(req.user._id, function (err, user) {
    if (err) {
      return res.status(500).send('There was a problem finding the user.');
    }
    if (!user) {
      return res.status(404).send('No user found.');
    }
    if (user.typeUser === 'admin') {
      next();
    } else {
      return res.status(403).send({ auth: false, message: 'Not authorized.' });
    }
  });
};

authController.verifyRoleAdminReturn = function (req, res, next) {
  User.findById(req.user._id, function (err, user) {
    if (err) {
      return res.status(500).send('There was a problem finding the user.');
    }
    if (!user) {
      return res.status(404).send('No user found.');
    }
    if (user.typeUser === 'admin') {
      return res.status(200).send({ auth: true, message: 'Authorized.' });
    } else {
      return res.status(403).send({ auth: false, message: 'Not authorized.' });
    }
  });
};

authController.verifyRolePromoter = function (req, res, next) {
  User.findById(req.user._id, function (err, user) {
    if (err) {
      return res.status(500).send('There was a problem finding the user.');
    }
    if (!user) {
      return res.status(404).send('No user found.');
    }
    if (user.typeUser === 'promoter') {
      return res.status(200).send({ auth: true, message: 'Authorized.' });
    } else {
      return res.status(403).send({ auth: false, message: 'Not authorized.' });
    }
  });
};

authController.verifyRoleClient = function (req, res, next) {
  User.findById(req.user._id, function (err, user) {
    if (err) {
      return res.status(500).send('There was a problem finding the user.');
    }
    if (!user) {
      return res.status(404).send('No user found.');
    }
    if (user.typeUser === 'client') {
      next();
    } else {
      return res.status(403).send({ auth: false, message: 'Not authorized.' });
    }
  });
};

authController.verifyDataValid = (req, res, next) => {
  var emailValidator = /\S+@\S+\.\S+/;

  if (!emailValidator.test(req.body.email)) {
    return res.status(400).send({ auth: false, message: 'Invalid Email' });
  }
  if (
    req.body.firstName.charAt(0) !=
      req.body.firstName.charAt(0).toUpperCase() ||
    req.body.lastName.charAt(0) != req.body.lastName.charAt(0).toUpperCase()
  ) {
    return res
      .status(400)
      .send({ auth: false, message: 'Invalid First and/or Last Name' });
  }
  if (req.body.password.length < 6 || req.body.password.length > 16) {
    return res
      .status(400)
      .send({ auth: false, message: 'Invalid Password Length' });
  }
  next();
};

module.exports = authController;
