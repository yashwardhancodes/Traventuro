const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const engine=require("ejs-mate");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));




const port=8080;
const mongourl= "mongodb://127.0.0.1:27017/traventure";
main().then(()=>{
    console.log("connected to the database");
}).catch((err)=>{
  console.log(err);
})
async function main(){
    mongoose.connect(mongourl);
}

app.get("/",(req,res)=>{
    res.send("hi i am root");
});

// app.get("/testlisting",async (req,res)=>{
//     let samplelisting=new Listing({
//         title:"my new villa",
//         location:"india",
//         country:"india",
//         price:342,
//     });

//     await samplelisting.save();
//     console.log(samplelisting);
//     res.send("successfull testing");
// })
  
//index route
app.get("/listings",async (req,res)=>{
   const allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});


//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//read or show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

});

//create route
 app.post("/listings",async (req,res)=>{
  
    const newListing= new Listing(req.body.listing);
    newListing.save();
    res.redirect("/listings");
 })

 //edit route
 app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
 });

 //update route

 app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
 });

//delete route

app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    
})


app.listen(port,()=>{
    console.log(`app is listening to the port $port `);
});