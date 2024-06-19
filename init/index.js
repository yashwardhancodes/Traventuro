const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js")


const mongourl= "mongodb://127.0.0.1:27017/traventure";
main().then(()=>{
    console.log("connected to the database");
}).catch((err)=>{
  console.log(err);
})
async function main(){
    mongoose.connect(mongourl);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();