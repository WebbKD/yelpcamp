var express = require("express");
var mongoose = require("mongoose");
var app = express();
var Campground = require("./models/campground.js");
var Comments = require("./models/comment.js");
var User = require("./models/users.js");
var passport = require("passport"); 
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");

//adding in routes
var commentRoutes = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes = require("./routes/index.js")

mongoose.connect("mongodb://localhost/yelpCamp");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(flash());

//Passport Config
app.use(require("express-session")({
    secret: "This is our secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);



app.listen(3000, function(){
    console.log("Server has started");
});