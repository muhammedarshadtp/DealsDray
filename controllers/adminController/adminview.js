
const adminCollection = require('../../model/admin-schema')
const bcrypt = require('bcrypt')


const admin = async(req,res)=>{
    try {
        
        res.render('adminLogin')
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
            
            const emailError = 'Email is not fount'
        }
        const passwordMatch =   await bcrypt.compare(data.password,admin.password)
        console.log(passwordMatch,'pass kitty');
        if(!passwordMatch){
            const passwordError = 'Password is not match'
        }
        req.session.isAuth = true
        res.redirect('/adminHome')
    } catch (error) {
        console.log(error);
    }
}

const home=async(req,res)=>{
    try {
        res.render('adminHome')
    } catch (error) {
        
    }
}

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

module.exports={
    admin,
    siginpost,
    adminlogin,
    home
}