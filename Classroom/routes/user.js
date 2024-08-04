const express=require("express");
const router=express.Router();

// index-  users
router.get("/",(req,res)=>{
    res.send("get route for the users")
});

//show - users
router.get("/:id",(req,res)=>{
    res.send("Show route for users")
})

//post- users
router.post("/",(req,res)=>{
    app.send("post route for the users");
})

//delete - users
router.delete("/:id",(req,res)=>{
    app.delete("delete route for the users")
});

module.exports=router;