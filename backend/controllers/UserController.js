var User = require('../models/User');
var Evento = require('../models/Event');
var bcrypt = require('bcryptjs');
const { RFC_2822 } = require('moment');

var userController = {};

userController.profile = function (req, res) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) {
      return res.status(500).send('There was a problem finding the user.');
    }
    if (!user) {
      return res.status(404).send('No user found.');
    }

    res.status(200).send(user);
  });
};

userController.getUsers = function (req, res) {
  User.find({}, function (err, users) {
    if (err) {
      return res.status(500).send('There was a problem finding the users.');
    }
    if (!users) {
      return res.status(404).send('No users found.');
    }
    res.status(200).send(users);
  });
};

userController.getUser = function (req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).send('There was a problem finding the users.');
    }
    if (!user) {
      return res.status(404).send('No user found.');
    }
    res.status(200).send(user);
  });
};

userController.editProfile = (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 8);

  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(500).send('There was a problem finding the users.');
      }
      if (!user) {
        return res.status(404).send('No users found.');
      } else {
        res.status(200).send(user);
      }
    },
  );
};

userController.sendRequest = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { sentRequest: true }, (err, user) => {
    if (err) {
      return res.status(500).send('There was a problem finding the users.');
    }
    if (!user) {
      return res.status(404).send('No users found.');
    } else {
      res.status(200).send(user);
    }
  });
};

userController.removeRequest = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { sentRequest: false },
    (err, user) => {
      if (err) {
        return res.status(500).send('There was a problem finding the users.');
      }
      if (!user) {
        return res.status(404).send('No users found.');
      }

      res.status(200).send(user);
    },
  );
};

userController.acceptRequest = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { typeUser: 'promoter' },
    (err, user) => {
      if (err) {
        return res.status(500).send('There was a problem finding the users.');
      }
      if (!user) {
        return res.status(404).send('No users found.');
      }

      res.status(200).send(user);
    },
  );
};

userController.deleteUser = function (req, res) {
  User.deleteOne({ _id: req.params.id }).exec((err) => {
    if (err) {
      return res.status(500).send('There was a problem finding the users.');
    }
  });
};

userController.showMyTickets = function (req, res) {
  User.findById(req.user).exec((err, user) => {
    if (err) {
      return res.status(500).send('There was a problem finding the users.');
    }
    if (!user) {
      res.status(404).send('No user found.');
    }
    res.status(200).send(user.tickets);
  });
};

userController.cancelTicket = function (req, res) {
  User.findById(req.user).exec((err, user) => {
    if (err) {
      return res.status(500).send('There was a problem finding the users.');
    }
    if (!user) {
      res.status(404).send('No user found.');
    }

    let canceltickets = 0;
    let ticket = JSON.parse(req.body.ticket);
    let index = req.body.index;
    let newQuantityBuy = user.tickets[index].Quantidade - req.body.quantity;
    let newQuantityevent = ticket.Evento.capacity + req.body.quantity;

    let date = new Date();

    Evento.findByIdAndUpdate(
      ticket.Evento._id,
      { capacity: newQuantityevent },
      { new: true },
      (err, event) => {
        if (err) {
          return res.status(500).send('There was a problem finding the event.');
        }
        if (!event) {
          return res.status(404).send('No event found.');
        }
        event.save();

        if (user.ticketsCanceled.length === 0) {
          user.tickets.set(index, {
            Evento: ticket.Evento,
            Quantidade: newQuantityBuy,
            Teste: ticket.Teste,
          });

          user.ticketsCanceled.push({
            canceledtickets: 1,
            date: date,
            indexOfTicket: user.ticketsCanceled.length,
          });
        } else {
          for (let i = 0; i < user.ticketsCanceled.length; i++) {
            for (let j = i + 1; j < user.ticketsCanceled.length; j++) {
              if (
                user.ticketsCanceled[i].date.getMonth() ===
                user.ticketsCanceled[j].date.getMonth()
              ) {
                if (
                  user.ticketsCanceled[i].date.getFullYear() ===
                  user.ticketsCanceled[j].date.getFullYear()
                ) {
                  canceltickets++;
                }
              }
            }
          }

          if (canceltickets >= 5) {
            user.active = false;
          } else {
            user.tickets.set(index, {
              Evento: ticket.Evento,
              Quantidade: newQuantityBuy,
              Teste: ticket.Teste,
            });

            canceltickets++;
            user.ticketsCanceled.push({
              canceledtickets: canceltickets,
              date: date,
              indexOfTicket: user.ticketsCanceled.length,
            });
          }
        }
        user.ticketsBought -= req.body.quantity;
        user.save();
        if (user.active == true) {
          res.status(200).send(user);
        } else {
          res.status(400).send();
        }
      },
    );
  });
};

module.exports = userController;
