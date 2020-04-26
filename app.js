const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb+srv://admin-deekshith:<password>@cluster0-22hey.mongodb.net/articleDB', {
  useNewUrlParser: true, useUnifiedTopology: true});

// mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
//

const articleSchema =new mongoose.Schema ({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

// https://expressjs.com/en/guide/routing.html - routing parameters

app.route("/articles")
  .get(function(req,res){
    Article.find(function(err, foundArticles){
      if (!err){
        res.send(foundArticles);
      } else {
        res.send(err)
      }
      });
    })
  .post(function(req, res){
    const newArticle = new Article ({
      title : req.body.title,
      content : req.body.content
    });
    newArticle.save(function(err){
      if (!err){
        res.send("Successfully added a new article")
      } else {
        res.send(err)
      }
      });
    })
  .delete(function(req, res){
    Article.deleteMany(function(err){
      if (!err){
        res.send("Successfully deleted all articles")
      } else{
        res.send(err)
      }
      });
    });

app.route("/articles/:articleTitle")
  .get(function(req, res){
    Article.findOne(
      {title:req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send ("No article matching the title was found");
        }
      });
  })
  .put(function(req,res){
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err) {
          res.send("Successfully updated the article");
        }
      });
  })
  .patch(function(req,res){
    Article.update(
      {title: req.params.articleTitle},
      {$set:req.body},
      function(err){
        if (!err) {
          res.send('Successfully updated the article')
        } else {
          res.send (err)
        }
      });
  })
  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err,foundArticle){
        if (foundArticle){
          res.send("Successfully deleted")
        } else {
          res.send(err)
        }
      });
  });

// hosting
//
// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }

app.listen(8080, function() {
  console.log("Server started Successfully");
});
