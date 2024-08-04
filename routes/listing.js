const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ListingSchema = require("../schema.js");
const expressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner}=require("../middleware.js");




const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
      throw new expressError(400, error);
    } else {
      next();
    }
  };
  
  

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));

  //new route
  
  router.get("/new",isLoggedIn, (req, res) => {
   
    res.render("listings/new");
  });
  
//show route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  }));
  
//create route
  router.post("/",isLoggedIn, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
  }));
  
  //edit route
  router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  }));
  
  router.put("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
  }));
  
  //delete route
  router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res, next) => {
    try {
      let { id } = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success","listing deleted");
      res.redirect("/listings");
    } catch (err) {
      next(err);
    }
  }));
  
 
  
  
module.exports=router;


