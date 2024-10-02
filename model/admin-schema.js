
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/DealsDray")
.then(()=>{
    console.log("mongosh connected")
})
.catch(()=>{
    console.log("failed connect")
})

const adminschema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    
})

const adminCollection = mongoose.model('admin',adminschema)

module.exports=adminCollection