const mongoose= require("mongoose");
const schema= mongoose.Schema;

const listingSchema = new schema({
    title: {
       type:String,
       required:true,
    },
    description:String,
    image:{
         filename:{ 
        type:String,
         },
         url: { 
            type:String,
        default:"https://unsplash.com/photos/man-sitting-on-rock-surrounded-by-water--Q_t4SCN8c4",
        set :(v)=> v===""? "https://unsplash.com/photos/man-sitting-on-rock-surrounded-by-water--Q_t4SCN8c4" :v,
         },
    },
    location:String,
    country:String,
    price:Number,
    
});



const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;