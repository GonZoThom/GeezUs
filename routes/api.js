var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Post = mongoose.model("Post");

// if user is authenticated in the session, call the next() to call the next request handler
function isAuthenticated(req, res, next) {
  //allow all get request methods
  if (req.method === "GET") {
    return next();
  }
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not authenticated then redirect him to the login page
  return res.redirect("/#login");
}

//Register the authentication middleware
router.use("/posts", isAuthenticated);

// API for ALL POSTS
// prettier-ignore
router.route("/posts")
//creates a new post
.post(function(req, res){
	var post = new Post();
	post.content = req.body.content;
	post.created_by = req.body.created_by;
	post.save(function(err, post) {
		if (err){
			return res.send(err);
		}
		return res.json(post);
	});
})
//gets all posts
.get(function(req, res){
  Post.find(function(err, posts){
    if(err){
      return res.send(500, err);
    }
    return res.send(posts);
  });
});

// API for ONE SPECIFIC POST
// prettier-ignore
router.route('/posts/:id')
	//updates specified post
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
      // Set new values
			post.created_by = req.body.created_by;
			post.content = req.body.content;
      // Save updated post
			post.save(function(err, post){
				if(err)
					res.send(err);
				res.json(post);
			});
		});
	})
	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
			res.json(post);
		});
	}) 
	//deletes the post
	.delete(function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});

module.exports = router;
