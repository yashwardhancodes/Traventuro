const { required } = require("joi");
const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const reviewSchema=new Schema({
    comment:{
        type:String,
        required:true},
    rating:{
        type:Number,
        max:5,
        min:0,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});


module.exports=mongoose.model("Review",reviewSchema);