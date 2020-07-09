var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
//// Initialize Mongoose Models
require("./models/models");
// Declare ROUTES
var index = require("./routes/index");
var api = require("./routes/api");
var authenticate = require("./routes/authenticate")(passport);
var mongoose = require("mongoose");
// Connect to Mongoose
mongoose.connect(
  "mongodb+srv://MasterGonzo:fHV382JuRjxRhVx@geezus.eusc9.mongodb.net/DB_geezus?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
// prettier-ignore
app.use(session({
    secret: "super secret stuff !!! duuuuuhhhhh",
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

// Declare LANDING API and AUTHENTICATE routes;
app.use("/", index);
app.use("/api", api);
app.use("/auth", authenticate);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//// Initialize Passport
var initPassport = require("./passport-init");
initPassport(passport);

// ERROR handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

module.exports = app;
