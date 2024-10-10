

const adminAuth = async(req,res,next)=>{
    try {
        if(!req.session.isAuth){
           return res.redirect('/')
        }
        next()
    } catch (error) {
        console.log(error,'session error');
    }
}


module.exports={
    adminAuth
}