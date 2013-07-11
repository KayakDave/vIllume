 
var userLog=[];

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