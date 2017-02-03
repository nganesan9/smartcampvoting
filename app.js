/*eslint-env node*/
var express = require("express");
var cfenv = require("cfenv");
var app = express();
var request = require("request");
var Cloudant = require("cloudant");
var path = require("path");
var bodyParser = require("body-parser");
var fs = require("fs");
app.use(express.static(__dirname + "/public"));

var cloudant_url;
/*
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
if(process.env.VCAP_SERVICES)
{
	services = JSON.parse(process.env.VCAP_SERVICES);
	if(services.cloudantNoSQLDB)
	{
		cloudant_url = services.cloudantNoSQLDB[0].credentials.url;
		console.log("Name = " + services.cloudantNoSQLDB[0].name);
		console.log("URL = " + services.cloudantNoSQLDB[0].credentials.url);
        console.log("username = " + services.cloudantNoSQLDB[0].credentials.username);
		console.log("password = " + services.cloudantNoSQLDB[0].credentials.password);
	}
}
*/

//var cloudant = Cloudant({url: cloudant_url});
var cloudant = Cloudant({url:"https://fadb1c43-0b42-45d7-887c-38464d90fd9f-bluemix:ecd40a0cef8a97d7619accbb657e9e855906068c499ef875be59ed5e94206a2b@fadb1c43-0b42-45d7-887c-38464d90fd9f-bluemix.cloudant.com"});
var dbname = "results_london";
var db = cloudant.db.use(dbname);

//Create database

cloudant.db.create(dbname, function(err, data) {
  	if(err) //If database already exists
	    console.log("Database exists. Error : ", err); //NOTE: A Database can be created through the GUI interface as well
  	else
	    console.log("Created database.");

  	db = cloudant.db.use(dbname);
  	db.insert(
	 {
		  	_id: "_design/results_london",
		    views: {
	  				  "results_london":
	  				   {
	      					"map": "function (doc) {\n  emit(doc._id, [doc._rev, doc.team_name]);\n}"
	    			   }
      	   		   }
     },
	 function(err, data) {
	    	if(err)
	    			console.log("View already exsits. Error: ", err);
	    	else
	    		console.log("results_london view has been created");
	 });

});

app.get('/submit_vote', function(req, res){
	console.log("Received vote for : " + req.query.team_name);
	//Add to backend in cloudant
	db.insert(req.query, function(err, data){
						if (!err)
						{
							console.log("Vote has been added");
							name_string="{\"added\":\"Yes\"}";
							res.contentType('application/json'); //res.contentType and res.send is added inside every block as code returns immediately
							res.send(JSON.parse(name_string));
						}
						else
						{
							console.log("Vote couldn't be added. Error inserting into DB." + err);
							name_string="{\"added\":\"DB insert error\"}";
							res.contentType('application/json');
							res.send(JSON.parse(name_string));
						}
	});
});



// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, "0.0.0.0", function() {
  console.log("server starting on " + appEnv.url);
});
