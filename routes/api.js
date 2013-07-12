 
var userLog=[];
var https= require('https');

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

	var pdx911Options = {
		host: "www.portlandonline.com",
		path:"/scripts/911incidents.cfm",
		// host: "api.github.com",
		// path: "/users/KayakDave/repos",
		method: "GET"
	};

	var request = https.request(pdx911Options, function(response) {
		var body = '';
		response.on('data',function(chunk){
			body+= chunk.toString('utf8');
		console.log("got data");
		});
		response.on('end',function(){
			parseString = require('xml2js').parseString;
			parseString (body, function(err,result){
				var json= JSON.parse(JSON.stringify(result));
		   		// res.send(json);
		   		res.json({pdx911:json});
		   });
		});
	});
	request.end();
}