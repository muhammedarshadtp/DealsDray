

const adminAuth = async(req,res,next)=>{
    try {
        console.log(req.session.isAuth,'session kitty');
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