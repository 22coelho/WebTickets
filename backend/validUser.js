var mongoose = require("mongoose");
var User = require("./models/User");
var bcrypt = require("bcrypt");

function searchUser(req, res, next) {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      var errors = [];
      errors.push({ msg: `Erro: ${err}` });
      res.render("../views/register.ejs", { errors });
    } else {
      if (user) {
        var errors = [];
        errors.push({ msg: "Email já utilizado." });
        res.render("../views/register.ejs", { errors });
      } else {
        next();
      }
    }
  });
}

function confirmUser(req, res, next) {
  User.findOne({ email: req.body.email}).exec(
    async (err, user) => {
      if (err) {
        var errors = [];
        errors.push({ msg: `Erro: ${err}` });
        res.render("../views/login.ejs", { errors });
      } else {
        if (user) {
          req.body._id = user._id;
          try {
            if (await bcrypt.compare(req.body.password, user.password)) {
              next();
            } else {
              var errors = [];
              errors.push({ msg: "Email e/ou password incorreto/s." });
              res.render("../views/login.ejs", { errors });
            }
          } catch {
            var errors = [];
            errors.push({ msg: "Erro:" });
            res.render("../views/login.ejs", { errors });
          }
        } else {
          var errors = [];
          errors.push({ msg: "Email e/ou password incorreto/s." });
          res.render("../views/login.ejs", { errors });
        }
      }
    }
  );
}

function searchUserById(req, res, next) {
  if (req.params.id != undefined) {
    User.findOne({ _id: req.params.id }).exec((err, user) => {
      if (err) {
        res.redirect("/login");
      } else {
        if (user) {
          next();
        }
      }
    });
  } else {
    next();
  }
}

function validUser(req, res, next) {
  if (req.user == null) {
    res.status(403);
    return res.send("Conta inexistente.");
  }
  next();
}

module.exports = {
  validUser,
  searchUser,
  searchUserById,
  confirmUser,
};
