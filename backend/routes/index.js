var express = require("express");
var router = express.Router();
const {
  validUser,
  searchUser,
  confirmUser,
  searchUserById,
} = require("../validUser");

const userController = require("../controllers/userController");
const eventController = require("../controllers/eventController");
const locationController = require("../controllers/locationController");
var multer = require("multer");
var moment = require("moment");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name + ".jpg");
  },
});
var upload = multer({ storage: storage });

router.get("/login", function (req, res) {
  res.render("login.ejs");
});

router.post(
  "/login",
  (req, res, next) => {
    const { email, password } = req.body;
    var errors = [];
    if (!email || !password) {
      errors.push({ msg: "Insira todos os campos" });
    }

    if (errors.length > 0) {
      res.render("login.ejs", { errors });
    }
    next();
  },
  confirmUser,
  (req, res) => {
    res.redirect(`/${req.body._id}`);
  }
);

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post(
  "/register",
  (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    var errors = [];

    if (!email || !firstName || !lastName || !password) {
      errors.push({ msg: "Insira todos os campos" });
    }

    var formatoValido = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!email.match(formatoValido)) {
      errors.push({
        msg: "Não introduziu um email válido.",
      });
    }

    if (password.length < 6) {
      errors.push({ msg: "Password demasiado curta. Mínimo é 6 caracteres." });
    } else if (password.length > 16) {
      errors.push({
        msg: "Password demasiado comprida. Máximo é 16 caracteres.",
      });
    }
    if (errors.length > 0) {
      res.render("register.ejs", { errors });
    }else{
      next();
    }
 
  },
  searchUser,
  userController.save
);

router.get(
  "/:id?/event",
  searchUserById,
  locationController.showAll,
  (req, res) => {
    if (!req.params.id) {
      res.redirect("/");
    } else {
      res.render("event_create.ejs", {
        id: req.params.id,
        local: req.body.locals,
      });
    }
  }
);

router.get(
  "/:id?/myevents",
  searchUserById,
  eventController.show,
  (req, res) => {
    if (!req.params.id) {
      res.redirect("/");
    } else {
      var a = [];
      for (var i = 0; i < req.body.events.length; i++) {
        a.push(moment(req.body.events[i].date).format("DD-MM-YYYY"));
      }
      res.render("my_events.ejs", { id: req.params.id, item: req.body.events,data : a });
    }
  }
);

router.get(
  "/:id?/myevents/:ide?/delete",
  searchUserById,
  (req, res, next) => {
    if (!req.params.id) {
      res.redirect("/");
    } else {
      if (!req.params.ide) {
        res.redirect("/");
      } else {
        next();
      }
    }
  },
  eventController.delete,
  eventController.show,
  (req, res) => {
    res.redirect(`/${req.params.id}/myevents`);
  }
);

router.get("/:id?/seemore/:ide?", eventController.showByID, (req, res) => {
  var a = moment(req.body.event.date).format("DD-MM-YYYY");
  res.render("see_more.ejs", {
    event: req.body.event,
    data: a,
    query: req.params.id,
  });
});

router.get("/:id?/local", searchUserById, (req, res) => {
  if (!req.params.id) {
    res.redirect("/");
  } else {
    res.render("local_create.ejs", { id: req.params.id });
  }
});

router.post(
  "/:id?/local",
  (req, res, next) => {
    const { name, lat, lon, address } = req.body;
    if (!name || !lat || !lon || !address) {
      res.redirect(`${req.body.id}`);
    }
    next();
  },
  locationController.save
);

router.post(
  "/:id?/event",
  upload.single("imagem"),
  (req, res, next) => {
    const { name, id, description, date, capacity, ticketPrice } = req.body;
    if (!name || !description || !date || !capacity || !ticketPrice) {
      res.redirect(`/${id}`);
    } else {
      next();
    }
  },
  eventController.save
);

router.get(
  "/:id?",
  searchUserById,
  eventController.showAll,
  function (req, res, next) {
    var a = [];
    for (var i = 0; i < req.body.events.length; i++) {
      a.push(moment(req.body.events[i].date).format("DD-MM-YYYY"));
    }
    res.render("main.ejs", { query: req.params.id, events: req.body.events,data : a });
  }
);

module.exports = router;
