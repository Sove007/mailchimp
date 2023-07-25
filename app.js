const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();


const app = express();
client.setConfig({
  apiKey:  `${process.env.API_KEY}`,
  server: "us11",
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",function(req,res){
  const subscribingUser = {
    firstNamee: req.body.fName,
    lastNamee: req.body.lName,
    Email: req.body.email
  };

const run = async () => {
    try{
  const response = await client.lists.addListMember( `${process.env.AUDIENCE_ID}`, {
    email_address: subscribingUser.Email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstNamee,
      LNAME: subscribingUser.lastNamee
    }

  });
  
    res.sendFile(__dirname+"/success.html");
  }catch(err){
    console.log(err.status);
    res.sendFile(__dirname+"/failure.html");
  }
  }; 
run();
});
app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req,res){
    console.log("Server is listening at port 3000");
});