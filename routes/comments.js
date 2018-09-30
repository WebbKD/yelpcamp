var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comments = require("../models/comment.js");
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new",  middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){

        res.render("comment/new", {campground: campground});
    });
});

router.post("/campgrounds/:id/comments",  middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comments.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

router.get("/campgrounds/:id/comments/:comment_id/edit",  middleware.checkCommentOwnership, function(req,res){

    Comments.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comment/edit", {campground_id: req.params.id, comment: foundComment}); 
        }
    });
});

router.post("/campgrounds/:id/comments/:comment_id/update",  middleware.checkCommentOwnership, function(req,res){
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.post("/campgrounds/:id/comments/:comment_id/destroy",  middleware.checkCommentOwnership, function(req, res){
    Comments.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/campgrounds/"+ req.params.id);
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});




module.exports = router;