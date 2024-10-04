

const adminCollection = require('../../model/admin-schema')
const Employee = require('../../model/employeeSchema');
const bcrypt = require('bcrypt')
const crypto = require('crypto');




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
        const emailError = req.session.errorMsg;
        req.session.errorMsg = null; 

        console.log(emailError, 'Error message retrieved.'); 
        res.render('adminLogin', { emailError });
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
        console.log(data);
        const admin = await adminCollection.findOne({email:data.email})

        if(!admin){
            // req.flash('emailError', 'Invalid credentials.');
            req.session.errorMsg = 'Invalid credentials.';
            console.log('error email:', req.flash('emailError'));
            return res.redirect('/'); 
        }
        const passwordMatch =   await bcrypt.compare(data.password,admin.password)

        if(!passwordMatch){
            req.flash('emailError', 'Invalid credentials.');
            console.log('error email:pa', req.flash('emailError'));
            return res.redirect('/'); 
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

const employelist = async (req, res) => {
    try {
        const limit = 3; 
        let page = Number(req.query.page) || 1; 

        
        const TOTAL_COUNT_OF_EMPLOYEES = await Employee.countDocuments();

        const totalPages = Math.ceil(TOTAL_COUNT_OF_EMPLOYEES / limit);
        page = Math.max(1, Math.min(page, totalPages)); 

        const skip = (page - 1) * limit; 
        const employedata = await Employee.find().skip(skip).limit(limit); 

        res.render('employeeList', {
            employedata,
            page,
            totalPages,
            count: TOTAL_COUNT_OF_EMPLOYEES
        });
    } catch (error) {
        console.log("employelist error", error);
       
    }
}


const sortEmployees = async (req, res) => {
    try {
        const { column, order } = req.query;

        const validColumns = ['uniqueID', 'name', 'email', 'createdAt']; 
        if (!validColumns.includes(column)) {
            return res.status(400).send('Invalid column name');
        }
        const sortOrder = order === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending

        const employees = await Employee.find().sort({ [column]: sortOrder });
        res.json(employees);
    } catch (error) {
        console.error('Error fetching sorted employees:', error);
        res.status(500).send('Server Error');
    }
};



const employelistSearch=async(req,res)=>{
    try {

        const employedata = await Employee.find()

        res.json(employedata);
         
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

        const uniqueID = parseInt(crypto.randomBytes(4).toString('hex'), 16) % 100000000;
        const paddedUniqueID = String(uniqueID).padStart(8, '0');       
        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
          req.flash('duplicateError', 'Email already exists');
          return res.redirect('/addemploye'); 
        }

       const employeData={
        uniqueID : paddedUniqueID,
        name:name,
        email:email,
        mobile:mobile,
        designation:designation,
        gender:gender,
        course:course,
        imgUpload: req.file ? req.file.path : null 

       }

       const addEmployee = new Employee(employeData)
       await addEmployee.save()

       res.redirect('/employelist')
        
    } catch (error) {
        console.log(error,'add employee error');
    }
}

const editemployee = async (req, res) => {
    try {
      const { empId } = req.params;
      const employedata = await Employee.findById(empId);
      res.render('employeedit', { employedata });
    } catch (error) {
      console.log(error);
    }
  };
  
  const editemployeepost = async (req, res) => {
    try {
        const { empId } = req.params;
        const { name, email, mobile, designation, gender, course } = req.body;
        const filePath = req.file ? req.file.path : null;

        const emailExists = await Employee.findOne({ email: email, _id: { $ne: empId } });
        
        if (emailExists) {
            req.flash('error', 'Email already exists!');
            return res.redirect(`/editEmployee/${userId}`);
        }

       

        const updatedEmployeeData = {
            name,
            email,
            mobile,
            designation,
            gender,
            course,
        };

        if (filePath) {
            updatedEmployeeData.imgUpload = filePath;
        }

        await Employee.findByIdAndUpdate(userId, updatedEmployeeData, { new: true });

        req.flash('success', 'Employee details updated successfully!');
        res.redirect('/employelist');
    } catch (error) {
        console.log(error, 'edit employee error');
        req.flash('error', 'An error occurred while updating the employee details.');
        res.redirect(`/editEmployee/${req.params.userId}`);
    }
};

const deleteemployee = async (req, res) => {
    try {
      const { empId } = req.params;
  
      const employee = await Employee.findById(empId);
  
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      await Employee.findByIdAndDelete(empId);
  
      res.status(200).json({ message: 'Employee deleted successfully' });
  
    } catch (error) {
      console.error('Delete employee error:', error);
      res.status(500).json({ error: 'An error occurred while deleting the employee' });
    }
  };



  const updateStausEmployee = async (req, res) => {
    try {
      const { empId } = req.params;
  
      const employee = await Employee.findById(empId);
  
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      employee.status = !employee.status;
      await employee.save();  
      res.status(200).json({ message: 'Employee status updated successfully' });
  
    } catch (error) {
      console.error('update employee error:', error);
      res.status(500).json({ error: 'An error occurred while updating  status of the employee' });
    }
  };

const employeeSearch = async (req, res) => {
    const searchTerm = req.body.search;
    try {

        console.log(searchTerm);
        const employees = await Employee.find({
            name: { $regex: searchTerm, $options: 'i' } 
        });
        res.json(employees);
    } catch (error) {
        console.error('Error searching for employees:', error);
        res.status(500).json({ error: 'Error fetching employees' });
    }
};
  


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
    addemploypost,
    editemployee,
    editemployeepost,
    deleteemployee,
    updateStausEmployee,
    employeeSearch,
    employelistSearch,
    sortEmployees
}