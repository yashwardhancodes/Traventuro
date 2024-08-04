const express=require("express");

const router=express.Router();

// index-  post
router.get("/",(req,res)=>{
    res.send("get route for the post")
});

//show - post
router.get("/:id",(req,res)=>{
    res.send("Show route for post")
})

//post- post
router.post("/",(req,res)=>{
    app.send("post route for the post");
})

//delete - post
router.delete("/:id",(req,res)=>{
    app.delete("delete route for the post")
})

module.exports=router;