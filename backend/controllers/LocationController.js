var Location = require("../models/Location");

var locationController = {};

locationController.save = (req, res) => {

  var location = new Location(req.body);
  location.coords.lat = req.body.lat;
  location.coords.lon = req.body.lon;
  location.address = req.body.address;

  location.save(()=>{
    res.json(location);
  });
};

locationController.showAll = (req, res, next) => {
  Location.find({}).exec((err, dblocal) => {
    res.json(dblocal);
  });
};

module.exports = locationController;
