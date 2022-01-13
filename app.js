const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/studentListDB");

const studentSchema = {
  name: String,
  dob:String,
  age: Number,
  mobileNo: Number,
  Email: String,
  department: String,
  address: String
};

const Student = mongoose.model("Student",studentSchema);

app.get("/",function(req, res){
  res.render("index");
})

app.post("/",function(req, res){


  const sName = req.body.name;
  const sDOB = new Date(req.body.dob);
  const dateOfBirth = (sDOB.getMonth()+ "/"+sDOB.getDate() +"/"+sDOB.getFullYear());

// age calculation
      const day = new Date(sDOB);
      const time = day.getTime();
      const today  = new Date();
      const timenow = today.getTime();
      const value = timenow - time;
      const sAge = Math.floor(value / (1000*60*60*24*365.25));

  const sMobileNo = req.body.mobileNo;
  const sEmail = req.body.eMail;
  const sDepartment = req.body.department;
  const sAddress = req.body.address;

  console.log(dateOfBirth);

  Student.find({},function(err, foundItems){
    if(foundItems.length === 0){
      const student = new Student({
        name: sName,
        dob: dateOfBirth,
        age: sAge,
        mobileNo: sMobileNo,
        Email: sEmail,
        department: sDepartment,
        address: sAddress
      });
      student.save();
      res.render("index");
      console.log(err);
    }else{
      Student.insertMany([{
        name: sName,
        dob: dateOfBirth,
        age: sAge,
        mobileNo: sMobileNo,
        Email: sEmail,
        department: sDepartment,
        address: sAddress
      }]),function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully Inserted!");

        }
      }
      res.render("index");

    }
  })

})

app.get("/result",function(req, res){
  Student.find({},function(err, Data){
    if(Data.length === 0){
      res.render("empty");
    }
    else{
    if(err){
      console.log(err);
    }else{
      res.render("result",{finalData: Data});
    }
  }
  })

})

app.post("/result",function(req, res){
  res.redirect("/result");
})


app.get("/delete",function(req, res){
  Student.find({},function(err, Data){
    if(err){
      console.log(err);
    }else{
      res.render("delete",{finalData: Data});
    }
  })



})




app.post("/delete",function(req, res){
  const checkedItemId = req.body.checkbox;

  Student.findByIdAndRemove(checkedItemId,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Success!");
    res.redirect("/delete");
  }
  })

})


app.listen(2000,function(){
  console.log("The server is running on the Port 2000");
});
