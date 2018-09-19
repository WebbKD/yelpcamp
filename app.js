var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){

    var campgrounds = [
        {name: "Salmon Creek", image: "https://www.outdoorproject.com/sites/default/files/styles/odp_header_adaptive/public/features/dscf9483.jpg?itok=oIMTmpPV"},
        {name: "7 Lakes", image: "https://i.ytimg.com/vi/Hc8mvPmcJyU/maxresdefault.jpg"}

    ];


    res.render("campground", {campgrounds:campgrounds});
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
    res.render("new");
});

app.listen(3000, function(){
    console.log("Server has started");
});