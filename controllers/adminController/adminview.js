

const adminCollection = require('../../model/admin-schema')
const employee = require('../../model/employeeSchema')
const bcrypt = require('bcrypt')



const siginpost = async(req,res)=>{
    try {
      const {email,password} = req.body
      console.log(email,password);
        const hashPassword= await bcrypt.hash(password,10)
        const collection = new adminCollection({email,password: hashPassword})
        await collection.save()
        console.log('saved');
        
        
    } catch (error) {
       console.log(error,'sigin error'); 
    }
}

const admin = async(req,res)=>{
    try {
        if(req.session.isAuth){
            return res.redirect('/adminHome')
        }
        
        res.render('adminLogin',{
            emailError:req.flash('emailError'),
            passwordError:req.flash('passwordError'),
        })
    } catch (error) {
        console.log(error,'enth error');
    }
}

const adminlogin = async(req,res)=>{
    try {
        const data={
            email:req.body.email,
            password:req.body.password
        }
        console.log(data,'kitty');
        const admin = await adminCollection.findOne({email:data.email})
        if(!admin){
            
            const emailError = 'Email is not found.'
            return res.json({error:`${emailError}`});
        }
        const passwordMatch =   await bcrypt.compare(data.password,admin.password)
        if(!passwordMatch){
            const passwordError = 'Password is not match.'
            return res.json({error:`${passwordError}`})
        }
        req.session.isAuth = true
        req.session.errorMsg = null
        return res.json({result:"success"})
        
    } catch (error) {
        console.log(error);
    }
}

const home=async(req,res)=>{
    try {
        res.render('adminHome')
    } catch (error) {
        console.log(error);
    }
}

const employelist=async(req,res)=>{
    try {
        res.render('employeeList')
        
    } catch (error) {
        console.log(error);
    }
}

const addemploye = async (req,res)=>{
    try {
    
        res.render('addemploye')
    } catch (error) {
        console.log(error);
    }
}
const addemploypost = async(req,res)=>{
    try {
        const {name,email,mobile,designation,gender,course}=req.body
        console.log(req.body,'data varunilla');

       const employeData={
        name:name,
        email:email,
        mobile:mobile,
        designation:designation,
        gender:gender,
        course:course
       }
       console.log(employeData);
       const addEmployee = await employee.create(employeData)
       console.log(addEmployee,'employee kitty');
        res.redirect('/employeelist')
        
    } catch (error) {
        console.log(error,'add employee error');
    }
}

const logout = async(req,res)=>{
    try {
        req.session.isAuth = false
        res.redirect('/')
        
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    admin,
    siginpost,
    adminlogin,
    home,
    employelist,
    addemploye,
    logout,
    addemploypost
}