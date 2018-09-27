var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");



router.get("/campgrounds", function(req, res){

    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }  else {
            res.render("campground/index", {campgrounds:allcampgrounds});
        }
     });
});

router.post("/campgrounds", isLoggedIn, function(req, res){
        //get data from form  and add to array
        var name = req.body.name;
        var image = req.body.image;
        var description = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        var newCampground = {name: name, image: image, description: description, author: author};
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

router.get("/campgrounds/new", isLoggedIn, function(req, res){

    res.render("campground/new");
});

router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, showCamp){
        if(err){
            console.log(err);
        }else{
            //find the campground with the provided id and render the template
            res.render("campground/show", {campground: showCamp});
        }
    });
  
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;