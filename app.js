//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-raman:Raman123@cluster0.wv3m6.mongodb.net/todolistDB",{useNewUrlParser : true, useUnifiedTopology: true})


const itemSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "string cannot be blank"]
  }

});
const item = new mongoose.model("item",itemSchema);

const item1 = new item({
  name : "Welcome to your Todo-List!!"
})
const item2 = new item({
  name :"Hit + to add a new item"
})


const defaultName = [item1,item2];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})
const List = new mongoose.model("List",listSchema);

app.get("/", function(req, res) {

item.find({},function(err,foundItems)
{

  if(foundItems.length == 0)
  {
    item.insertMany(defaultName,function(err)
    {
      if(err)
      console.log(err);
      else
      console.log("successfully inserted!")
    })

    res.redirect("/");
  }
  else
    res.render("list", {listTitle: "Today", newListItems: foundItems});
})



});

app.post("/", function(req, res){

const itemName = req.body.newItem;
const  listName = req.body.list;

const item4 = new item({
  name: itemName
})

if(listName =="Today")
{
  item4.save(function (err) {
     if (err) {
       console.log(err);
     } else {
       res.redirect("/");
         }
     });
}
else{
  List.findOne({name: listName},function(err,foundlist)
{
  foundlist.items.push(item4);
  foundlist.save();
  res.redirect("/"+listName);
}
)
}

});



app.post("/delete",function(req,res){
  const deleteItem = req.body.checkbox;
  const listName = req.body.listName;

if(listName=="Today"){
  item.deleteOne({_id : deleteItem},function(err){
  if (err)
  console.log(err);
  else
  res.redirect("/");
});

}  else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id: deleteItem}}},function(err,foundList){
    if(!err)
    {
      res.redirect("/"+listName);
    }
  })

}

});


app.get("/:post",function(req,res)
{
 const cumstomTodo = _.capitalize(req.params.post);
 List.findOne({name: cumstomTodo},function(err,foundList)
{
  if(!err){
        if(!foundList)
      {
         // create a new list
         const list = new List({
           name: cumstomTodo,
           items: defaultName
         })
         list.save();
         res.redirect("/"+ cumstomTodo);
      }
      else
      // show the existing list
      res.render("list",{listTitle: foundList.name , newListItems: foundList.items})
     }

})


});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});
KS
