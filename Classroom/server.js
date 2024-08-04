const express=require("express");
const app=express();
const users=require("./routes/user");
const posts=require("./routes/post");
const session=require("express-session");

app.use(session({
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
}));

app.get("/test",(req,res)=>{
    res.send("test successfull");
   
})


app.listen(3000,()=>{
    console.log("listening to the port");
})