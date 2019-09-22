// 1. call needed packages and defines port and some instances
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser");
var port = 8080;
var router = express.Router();

// model instances
var User = require("./app/models/user");

// 2. use body parser to get data from HTTP request
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// 3. create connection to mongodb
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/sample");

// 4. API Routes
// this one is root routes, just a simple response
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to REST API Users"
  });
});

// model related routes
// POST : create a user
// GET : get all users
router
  .route("/users")
  .post((req, res) => {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.name = req.body.name;
    user.email = req.body.email;
    user.save(err => {
      if (err) res.send(err);
      else
        res.json({
          message: "new user created"
        });
    });
  })
  .get((req, res) => {
    User.find((err, users) => {
      if (err) res.send(err);
      else res.json(users);
    });
  });

// GET : get a user
// PUT : updating user attributes
// DELETE : delete user
router
  .route("/users/:username")
  .get((req, res) => {
    User.findOne(
      {
        username: req.params.username
      },
      (err, user) => {
        if (err) res.send(err);
        else res.json(user);
      }
    );
  })
  .put((req, res) => {
    User.findOne(
      {
        username: req.params.username
      },
      (err, user) => {
        if (err) res.send(err);
        else {
          user.username = req.body.username;
          user.password = req.body.password;
          user.name = req.body.name;
          user.email = req.body.email;
          user.save(err => {
            if (err) res.send(err);
            else
              res.json({
                message: "user updated"
              });
          });
        }
      }
    );
  })
  .delete((req, res) => {
    User.remove(
      {
        username: req.params.username
      },
      (err, user) => {
        if (err) res.send(err);
        else
          res.json({
            message: "user deleted"
          });
      }
    );
  });

app.use("/api", router); // prefix for 'router'
app.listen(port); // this service will listen on port defined at point 1
console.log("services started at port : " + port);
