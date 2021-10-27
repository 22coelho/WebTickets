var mongoose = require('mongoose');
var Event = require('../models/Event');
var Location = require('../models/Location');
var User = require('../models/User');
var ObjectId = mongoose.Types.ObjectId;

var eventController = {};

eventController.save = function (req, res, next) {
  var event = new Event(req.body);
  event.owner = req.body.owner;
  event.date = Date.parse(req.body.date);

  Location.findOne({ name: req.body.location }).exec((err, local) => {
    if (err) {
      return res.status(400).json(err);
    } else {
      event.location = local;
      if (req.file === undefined) {
        event.imagem = 'http://localhost:3000/images/default.jpg';
      } else {
        event.imagem = 'http://localhost:3000/images/' + req.file.filename;
      }

      event.save(() => {
        return res.status(200).json(event);
      });
    }
  });
};

eventController.showAll = function (req, res, next) {
  Event.find({}).exec((err, dbevents) => {
    if (err || dbevents === null) {
      return res.json(err);
    }
    res.json(dbevents);
  });
};

eventController.showMyEvents = function (req, res) {
  Event.find({ owner: req.user._id }).exec((err, dbevent) => {
    if (err || dbevent === null) {
      return res.send(err);
    }
    return res.send(dbevent);
  });
};

eventController.deleteEvent = function (req, res) {
  Event.deleteOne({ _id: req.params.ide }).exec((err) => {
    if (err) {
      res.json(err);
    }
  });
};

eventController.editEvent = function (req, res) {
  var updatevent = new Event(req.body);
  updatevent.date = Date.parse(req.body.date);

  Location.findOne({ name: updatevent.location }).exec((err, local) => {
    if (err) {
      return res.status(400).json(err);
    } else {
      updatevent.location = local;
    }
    if (req.file === undefined) {
      updatevent.imagem = 'http://localhost:3000/images/default.jpg';
    } else {
      updatevent.imagem = 'http://localhost:3000/images/' + req.file.filename;
    }

    Event.findByIdAndUpdate(
      req.params.ide,
      updatevent,
      { new: true },
      (err, event) => {
        if (err) {
          return res.status(500).send('There was a problem finding the event.');
        }
        if (!event) {
          return res.status(404).send('No event found.');
        }
        res.status(200).send(event);
      },
    );
  });
};

eventController.publishEvent = (req, res) => {
  Event.findByIdAndUpdate(
    { _id: req.params.ide },
    { published: true },
    (err, event) => {
      if (err) {
        return res.status(500).send('There was a problem finding the event.');
      }
      if (!event) {
        return res.status(404).send('No event found.');
      }

      res.status(200).send(event);
    },
  );
};

eventController.showEventByID = function (req, res, next) {
  Event.findOne({ _id: req.params.ide }).exec((err, dbevent) => {
    if (err || dbevent === null) {
      return res.send(err);
    }
    res.send(dbevent);
  });
};

eventController.buyTicket = function (req, res, next) {
  Event.findOne({ _id: req.params.ide }).exec((err, event) => {
    if (err) {
      return res.status(500).send('There was a problem finding the event.');
    } else if (!event) {
      return res.status(404).send('No event found.');
    }

    User.findById(req.user).exec((err, user) => {
      if (err) {
        return res.status(500).send('There was a problem finding the user.');
      }
      if (!user) {
        return res.status(404).send('No user found.');
      }

      if (user.ticketsBought === undefined) {
        user.ticketsBought = Number(req.body.quantity);
      } else {
        user.ticketsBought += Number(req.body.quantity);
      }
      user.tickets.push({
        Evento: event,
        Quantidade: Number(req.body.quantity),
        Teste: 'http://localhost:3000/images/files/' + req.file.filename,
      });

      user.save();
      event.capacity -= Number(req.body.quantity);
      if (event.capacity < 0) {
        event.capacity = 0;
      }

      event.save();

      return res.status(200).send();
    });
  });
};

eventController.getOwner = function (req, res, next) {

  var owner;

  Event.findOne({ _id: req.params.id }).exec((err, event) => {
    if (err) {
      console.log('aqui');
      return res.status(500).send('There was a problem finding the event.');
    }
    if (!event) {
      return res.status(404).send('No event found.');
    }

    owner = event.owner;

    User.findOne({ _id: owner }).exec((err, owner_event) => {
      if (err) {
        return res.status(500).send('There was a problem finding the owner.');
      }
      var owner_name = {
        firstName: owner_event.firstName,
        lastName: owner_event.lastName,
        email: owner_event.email,
      };
      return res.status(200).send(owner_name);
    });
  });
};

module.exports = eventController;
