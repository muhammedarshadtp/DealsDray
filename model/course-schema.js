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

const courseSchema = new mongoose.Schema({
    coursename:{
        type:String,
        required:true,
    },
    description:{
        type:String,

    }

})

const course = mongoose.model('course',courseSchema)

module.exports = course