const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const engine=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const expressError=require("./utils/ExpressError.js");
const {ListingSchema,ReviewSchema}=require("./schema.js");
const Review = require("./models/review.js");


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

const validateListing=((req,res,next)=>{

    let {error}=ListingSchema.validate(req.body); 
        if(error){
            throw new expressError(400,error);
        }

        else{
            next();
        }
})

const validateReview=((req,res,next)=>{

    let {error}=ReviewSchema.validate(req.body); 
        if(error){
            throw new expressError(400,error);
        }

        else{
            next();
        }
})

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
app.get("/listings",wrapAsync(async (req,res)=>{
   const allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}));


//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//read or show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

}));

//create route
 app.post("/listings",validateListing,wrapAsync( async(req,res,next)=>{
  
       
        const newListing= new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
   
 }));

 //edit route
 app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
 }));

 //update route

 app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
 }));

//delete route

app.delete("/listings/:id",wrapAsync(async (req,res,next)=>{
    try{
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    }
    catch(err){
        next(err)
    }
   
    
}));

//post route reviews

app.post("/listings/:id/reviews",wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
  console.log(newReview);

}));

app.all("*",(req,res,next)=>{
    next(new expressError(404,"page not found"));
});

//middleware to handle error
app.use((err, req, res, next) => {
    let {status=500,message}=err;
    res.status(status).render("error.ejs",{message});
});



app.listen(port,()=>{
    console.log(`app is listening to the port $port `);
});