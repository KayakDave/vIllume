 
var userLog=[];
var https= require('https'),
    MongoClient = require('mongodb').MongoClient,
    format = require('util').format,
    mdb;

// //Get Heroku mongodb uri
var mongoUri = "mongodb://heroku_app16842266:kf4735nc0pnhm9podvm04ileil@ds035358.mongolab.com:35358/heroku_app16842266";



//  function (err,db) {
// 	if (err)
// 	{
// 		console.log("Database connection err: ",err);
// 		return;
// 	}
// 	mdb= db.collection('villume', function(er, collection) {

// 	});
// });

function updatePdx911 (response) {
	var pdxJson;
	var pdx911Options = {
		host: "www.portlandonline.com",
		path:"/scripts/911incidents.cfm",
		// host: "api.github.com",
		// path: "/users/KayakDave/repos",
		method: "GET"
	};

	// Get data from PDX server and convert it to JSON
	var request = https.request(pdx911Options, function(res) {
		var body = '';
		res.on('data',function(chunk){
			// Save data as it comes in
			body+= chunk.toString('utf8');
		});
		res.on('end',function(){

			// mongodb doesn't like $ as the start of a key.  So throw any we see away
			function censorBling (key,value) {
				if ('$')
					return undefined;
				else
					return value;
				// replace id with _id
				// undefined means to remove the key
			}
			//Once all the data has been sent convert it to JS
			parseString = require('xml2js').parseString;

			// Use attrkey of @ instead $ because $ freaks mongodb out
			parseString (body,{mergeAttrs:true, explicitRoot:false,explicitArray: false}, function(err,result){
				pdxJson= JSON.parse(JSON.stringify(result),censorBling());

		   });
			// response.json({pdx911:pdxJson});
			MongoClient.connect(mongoUri, function(err,mdb) {
				if (err) throw err;

			var collection = mdb.collection("villume");

        	// Load all records into database
		   for (var i =0;i < pdxJson.entry.length;i++)
		   {
	
	           cEntry = pdxJson.entry[i];
			   collection.update({_id:cEntry.id},cEntry, {upsert: true},function(err,results){
			   	if (err) throw err;
			   });
		   }

		  	// Send data to client  -- move this...
		  	collection.find().toArray(function(err,results){
				response.json({pdx911:results});
			});
			});
		});
	});
	request.end();

	
};

exports.users = function(req, res){
  console.log("Users sent")
  res.json({users:userLog});
};

exports.addUser = function(name,date) {
	var i;
	for (i=0;i< userLog.length;i++)
		if (userLog[i].userName == name)
          return;
	userLog.push({userName: name,
				  date: date
				});
};

exports.pdx911 = function(req, res) {
	console.log("in pdx911");

	// var pdx911Options = {
	// 	host: "www.portlandonline.com",
	// 	path:"/scripts/911incidents.cfm",
	// 	// host: "api.github.com",
	// 	// path: "/users/KayakDave/repos",
	// 	method: "GET"
	// };

	// var request = https.request(pdx911Options, function(response) {
	// 	var body = '';
	// 	response.on('data',function(chunk){
	// 		body+= chunk.toString('utf8');
	// 	console.log("got data");
	// 	});
	// 	response.on('end',function(){
	// 		parseString = require('xml2js').parseString;
	// 		parseString (body, function(err,result){
	// 			var json= JSON.parse(JSON.stringify(result));
	// 	   		// res.send(json);
	// 	   		res.json({pdx911:json});
	// 	   });
	// 	});
	// });
	// request.end();
	updatePdx911(res);
	// var data = mdb.pdx911.find().printjson();
	// res.json({pdx911:data});
};