const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const expressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "public")));



const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user;
  next();

});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.get("/demouser",async(req,res)=>{

  const fakeUser=new User({
    email:"yashvardhansingar2gmail.com",
    username:"delta",
  });

  let registeredUser= await  User.register(fakeUser,"Bidl");
  res.send(registeredUser);

})

const port = 8080;
const mongourl = "mongodb://127.0.0.1:27017/traventure";
main()
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongourl);
}

app.get("/", (req, res) => {
  res.send("hi i am root");
});




app.use("*",(req,res,next)=>{
  next(new  expressError(404,"page not found") );
})
app.use((err, req, res, next) => {
  let { status = 500, message } = err;
  res.status(status).render("error", { message });
});

app.listen(port, () => {
  console.log(`app is listening to the port ${port}`);
});
