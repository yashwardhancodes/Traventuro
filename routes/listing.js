const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ListingSchema = require("../schema.js");
const expressError = require("../utils/ExpressError.js");




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
  
  router.get("/new", (req, res) => {
    res.render("listings/new");
  });
  
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  }));
  
  router.post("/", wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
  }));
  
  router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  }));
  
  router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","listing updated");
    res.redirect("/listings");
  }));
  
  router.delete("/:id", wrapAsync(async (req, res, next) => {
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


