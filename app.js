const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true,useUnifiedTopology:true});
const articleSchema={
    title:String,
    content:String
};
const Article= mongoose.model("article",articleSchema);

//route chaining in express
app.route("/articles").get(function(req,res){
    Article.find({},function(err,result){
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
        
    });
})
.post(function(req,res){
 
    let newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("successfully inserted new article");
        }
    });
})
.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("successfully deleted all the ");
        }
    });
});

app.route("/articles/:searchedTitle")
.get(function(req,res){
    Article.findOne({title:req.params.searchedTitle},function(err,result){
        if(err){res.send(err);}
        else{
            res.send(result);
        }
    });
})
.put(function(req,res){
    Article.update(
        {title:req.params.searchedTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
            if(err){res.send(err)}
            else{ res.send("successfully repalced the article")}
        })
})
.patch(function(req,res){
    Article.update(
        {title:req.params.searchedTitle},
        {$set:req.body},
        function(err){
            if(err){res.send(err);}
            else{res.send("successfully updated/patched the values");}
        });
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.searchedTitle},
        function(err){
            if(err){res.send(err)}
            else{res.send("successfully deleted the article")}
        });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});