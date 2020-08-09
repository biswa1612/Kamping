var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
var flash      = require("connect-flash");
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");
var User       = require("./models/user");
var seedDB     = require("./seeds");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

// seedDB(); //seed the database-now we'll do it manually

//passport configuration
app.use(require("express-session")({
	secret: "The Best Page",
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


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// Campground.create(
 // 	{
 // 		name: "Salmon Creek",
 // 		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSHn5VnTY_ZABQZdR4hbj_qTIj5hwhrNCbt5Q&usqp=CAU",
 // description: "Salmon Creek is a census-designated place in Clark County, Washington, United States"
 // 	}, function(err, campground){
 // 		if(err) {
 // 			console.log(err);
 // 		} else {
 // 			console.log("NEWLY CREATED CAMPGROUND: ");
 // 			console.log(campground);
 // 		}
 // 	});


app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("Kamping server has started!!");
});