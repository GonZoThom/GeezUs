const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  created_by: String, //should be ObjectId, ref "User"
  created_at: { type: Date, default: Date.now },
  content: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String, //hash created from password
  created_at: { type: Date, default: Date.now },
});

mongoose.model("Post", postSchema);
mongoose.model("User", userSchema);

// Find User functions
var User = mongoose.model("User");
exports.findByUsername = function (userName, callback) {
  User.findOne({ user_name: userName }, function (err, user) {
    if (err) {
      return callback(err);
    }

    //success
    return callback(null, user);
  });
};

exports.findById = function (id, callback) {
  User.findById(id, function (err, user) {
    if (err) {
      return callback(err);
    }

    return callback(null, user);
  });
};
