const express = require("express");

const mongoose = require("mongoose");

const eventRoute = require("./routes/event.js");
const userRoute = require("./routes/user.js");
const authMiddleWare = require("./middleware/auth.js");

const app = express();



// mongodb+srv://gauravkadam9044:Pass123@cluster0.nt0figi.mongodb.net/
const connectDb = async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/evnt_mngt");
}
connectDb()
.then(()=>console.log("Mongo DB connected to the server"))
.catch((err)=>console.log("Error connecting mongo DB",err))

app.use(express.json());

app.use('/api/v1/event',authMiddleWare,eventRoute);
app.use('/api/v1/user',userRoute);

const port = 7007;
app.listen(port,()=>{
    console.log("server is running up",port);
})  