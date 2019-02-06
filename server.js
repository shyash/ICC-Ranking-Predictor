var port  = process.env.PORT || 8800,
    dburi = process.env.DBURI || "mongodb://localhost/icc";
	bodyParser = require("body-parser"),
    express = require("express"),
	app 	= express(),
    mongoose = require("mongoose") ;

	mongoose.connection.openUri(dburi, {useNewUrlParser:  true, useFindAndModify: false})
  
  app.use(bodyParser.urlencoded({ extended: true}))
  app.use(express.static( __dirname + "/public")) 
  app.set("view engine", "ejs")

 var seriesSchema  =  new mongoose.Schema({
         team1:String,
         team1Short:String,
         team2:String,
         team2Short:String,
         matches:Number 
 });
	var series = mongoose.model("series",seriesSchema)

app.get("/", function(req, res){
	
	res.sendFile("index.html" , {root : __dirname + "/views"});
			 
});

app.get("/api/data", function(req, res){
	series.find({},function(err,founded){
		if (err) console.log(err)
			else res.status(201).json(founded)
	})	 
});

app.get("/addSeries", function(req, res){
 res.sendFile("add.html" , {root : __dirname + "/views"});		 
});

app.get("/removeSeries", function(req, res){
 res.sendFile("remove.html" , {root : __dirname + "/views"});		 
});

function getshort(team) {
 var teams= [
              {name:"India", short:"IND"}, 
              {name:"England", short:"ENG"}, 
              {name:"South Africa", short:"SA"},
              {name:"New Zealand", short:"NZ"},
              {name:"Pakistan", short:"PAK"},
              {name:"West Indies", short:"WI"}, 
              {name:"Ireland", short:"IRE"},
              {name:"Afghanistan", short:"AFG"},
              {name:"Australia", short:"AUS"},
              {name:"Sri Lanka", short:"SL"},
              {name:"Zimbabwe", short:"ZIM"}, 
              {name:"Bangladesh", short:"BAN"},
            ]
 	for (var i = 0; i < teams.length; i++) {
 		if(teams[i].name == team){
 			return teams[i].short
 		}
 	}
}
// add/remove for admin only
app.post("/addSeries",function(req,res){
	 if (req.body.team1 != req.body.team2) {
	series.create(
		{
			team1:req.body.team1,
			team1Short:getshort(req.body.team1),
			team2:req.body.team2,
			team2Short:getshort(req.body.team2),
			matches:req.body.matches
		},
		 function(err, newseries) {
				if(err)  console.log(err)
      		    else     console.log(newseries) 
      		    res.redirect("back")
	})
	}
})
app.post("/removeSeries/:id",function(req,res){
	 series.findByIdAndRemove(req.params.id,function(err,deleted) {
	 	if(err)console.log(err)
	 	else console.log(deleted) , res.redirect("back")
	 })
})

app.get("*", function(req, res){
  res.send("404 URL NOT FOUND");
});
app.listen(port,function(){console.log("Server Started!");});