
/*
 * GET home page.
 */


exports.index = function(req, res){
  console.log("index sent");
  res.render('index', { title: 'vIllume' });
};

exports.partials = function(req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
}
