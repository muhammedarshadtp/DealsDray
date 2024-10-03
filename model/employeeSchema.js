
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/DealsDray",{
    useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
    console.log("mongosh connected")
})
.catch(()=>{
    console.log("failed connect")
})

const employeeSchema  = new mongoose.Schema({
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
        type:String,
        
    },
    createdAt:{
        type:Date,
        default: Date.now,
    },
    updatedAt:{
        type:Date,
    }
})

const Employee = mongoose.model('Employee',employeeSchema )

module.export=Employee