const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcrypt"),
  bcrypt_rounds = 5;

const validator = require("validator");

const user_schema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(str) {
        return validator.isEmail(str);
      },
      message: "email not valid"
    }
  },
  date_joined: {
    type: Date,
    default: Date.now()
  }
});

user_schema.pre("save", next => {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(bcrypt_rounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else return next();
});

user_schema.methods.isPassMatch = (pass, callback) => {
  bcrypt.compare(pass, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model("User", user_schema);
