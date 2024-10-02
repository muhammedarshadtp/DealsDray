
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/DealsDray")
.then(()=>{
    console.log("mongosh connected")
})
.catch(()=>{
    console.log("failed connect")
})

const userschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    imgUplode:{
        type:File,
        required:true
    }
})

const userCollection = mongoose.model('users',userschema)

module.export=userCollection