var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware");



router.get("/campgrounds", function(req, res){

    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }  else {
            res.render("campground/index", {campgrounds:allcampgrounds});
        }
     });
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
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

router.get("/campgrounds/new",  middleware.isLoggedIn, function(req, res){

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

//edit routes
router.get("/campgrounds/:id/edit",  middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campground/edit", {campground:foundCampground});
    });
});

//update route
router.post("/campgrounds/:id/update",  middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//remove route
router.post("/campgrounds/:id/destroy",  middleware.checkCampgroundOwnership ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});





module.exports = router;