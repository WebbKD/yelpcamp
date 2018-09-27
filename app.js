var express = require("express");
var mongoose = require("mongoose");
var app = express();
var Campground = require("./models/campground.js");
var Comments = require("./models/comment.js");
var User = require("./models/users.js");
var passport = require("passport"); 
var LocalStrategy = require("passport-local");

mongoose.connect("mongodb://localhost/yelpCamp");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


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
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){

    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }  else {
            res.render("campground/index", {campgrounds:allcampgrounds});
        }
     });
});

app.post("/campgrounds", function(req, res){
        //get data from form  and add to array
        var name = req.body.name;
        var image = req.body.image;
        var newCampground = {name: name, image: image};
        //create new campground in database to save
        Campground.create(newCampground, function(err, newlyCreatedCampGround){
           if(err){
               console.log(err);
           } else{
              //redirect to campgrounds
              res.redirect("/campgrounds");
           }
        });
});

app.get("/campgrounds/new", function(req, res){

    res.render("campground/new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, showCamp){
        if(err){
            console.log(err);
        }else{
            //find the campground with the provided id and render the template
            res.render("campground/show", {campground: showCamp});
        }
    });
  
});


app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){

        res.render("comment/new", {campground: campground});
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comments.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});


//Auth Routes
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds"); 
        });
    });
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        
    }), function(req, res){});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

app.listen(3000, function(){
    console.log("Server has started");
});