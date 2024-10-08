

const adminCollection = require('../../model/admin-schema')
const Employee = require('../../model/employeeSchema');
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const { alphanumValid, validateEmail, isValidMobile, isValidDesignation } = require('../../utils/adminvalidation');
const course = require('../../model/course-schema');





const siginpost = async(req,res)=>{
    try {
      const {email,password} = req.body
        const hashPassword= await bcrypt.hash(password,10)
        const collection = new adminCollection({email,password: hashPassword})
        await collection.save()
        
        
    } catch (error) {
       console.log(error,'sigin error'); 
    }
}

const admin = async(req,res)=>{
    try {
        if(req.session.isAuth){
            return res.redirect('/adminHome')
        }
        const emailError = req.session.error;
        req.session.errorMsg = null; 
        res.render('adminLogin', { emailError });
    } catch (error) {
        console.log(error,'enth error');
    }
}
const adminlogin = async (req, res) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password
        };
       
        const admin = await adminCollection.findOne({ email: data.email });

        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(data.password, admin.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        req.session.isAuth = true;
        req.session.error = null;
        return res.json({ result: "success" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error.' }); 
    }
};


const home=async(req,res)=>{
    try {
        res.render('adminHome')                     
    } catch (error) {
        console.log(error);
    }
}

const employelist = async (req, res) => {
    try {
        const limit = 4; 
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
      const courses = await course.find()
        res.render('addemploye',{courses})
    } catch (error) {
        console.log(error);
    }
}


const addemploypost = async (req, res) => {
    try {
      const { name, email, mobile, designation, gender, course } = req.body;
      console.log(req.body,'data kitty');
  
      
      req.body.messages = { name, email, mobile, designation, gender, mastercourse };
  
     
      if (!alphanumValid(name)) {
        req.flash('error', 'Name must be alphanumeric and not empty');
        return res.redirect('/addemploye');
      }
  
      if (!validateEmail(email)) {
        req.flash('error', 'Invalid email format');
        return res.redirect('/addemploye');
      }
  
      if (!isValidMobile(mobile)) {
        req.flash('error', 'Mobile number must be 10 digits');
        return res.redirect('/addemploye');
      }
  
      if (!isValidDesignation(designation)) {
        req.flash('error', 'Designation must only contain letters');
        return res.redirect('/addemploye');
      }
  
      const uniqueID = parseInt(crypto.randomBytes(4).toString('hex'), 16) % 100000000;
      const paddedUniqueID = String(uniqueID).padStart(8, '0');
      const existingEmployee = await Employee.findOne({ email });
  
      if (existingEmployee) {
        req.flash('duplicateError', 'Email already exists');
        return res.redirect('/addemploye');
      }
  
      const employeData = {
        uniqueID: paddedUniqueID,
        name: name,
        email: email,
        mobile: mobile,
        designation: designation,
        gender: gender,
        course:course,
        imgUpload: req.file ? req.file.path : null,
      };
  
      const addEmployee = new Employee(employeData);
      await addEmployee.save();
      console.log(addEmployee,'addemployee kitty')
  
      res.redirect('/employelist');
    } catch (error) {
      console.log(error, 'add employee error');
    }
  }



  const mastercourselist = async(req,res)=>{
    try {

        const courses = await course.find()
        res.render('courselist',{courses})
    } catch (error) {
        
    }
  }
  

  const mastercourse= async(req,res)=>{
    try {
        res.render('mastercourse')
    } catch (error) {
        console.log(error,'mastercourse erro')
    }
  }

  const mastercoursepost = async(req,res)=>{
    try {
        const {coursename,description} = req.body
        console.log(req.body);

        const newCourse = new course({
            coursename: coursename,   
            description: description,  
        });
        const existingEmployee = await course.findOne({ coursename });
  
      if (existingEmployee) {
        req.flash('duplicateError', 'coursename already exists');
        return res.redirect('/mastercourse');
      }
  
      

        
        await newCourse.save(); 
        console.log(newCourse);
        res.redirect('/mastercourselist')

        
    } catch (error) {
        
    }
  }
  

  const courseedit= async (req,res)=>{
    try {

      const {id} = req.params

      const courses = await course.findById(id)
    
        res.render('editcourse',{courses})
    } catch (error) {
        
    }
  }

  const courseeditpost = async(req,res)=>{
    const { id } = req.params;
    try {
      const { coursename, description } = req.body;


      const existingCourse = await course.findOne({
        courseName: coursename,
        _id: { $ne: id } // Exclude the current course by id
      });
     
  
      if (existingCourse) {
        req.flash('duplicateError', 'Course name already exists');
        return res.redirect(`/updatecourse/${id}`); // Redirect back to the edit form
      }

      const updatecourse = {
        coursename,
        description
      }
  
      // Update the course if no conflict
      await course.findByIdAndUpdate(id,updatecourse,{new:true});
  

      res.redirect('/mastercourselist')
        
    } catch (error) {
        
    }
  }

  const deletecourse=async(req,res)=>{
    try {
      const {id} = req.params;

      const courses = await course.findById(id)
      if (!courses) {
        return res.status(404).json({ error: 'course not found' });
      }
      await course.findByIdAndDelete(id);
      res.status(200).json({ message: 'course deleted successfully' })
        
    } catch (error) {
        
    }
  }







const editemployee = async (req, res) => {
    try {
      const { empId } = req.params;
      const courses = await course.find()
      const employedata = await Employee.findById(empId);
      res.render('employeedit', { employedata,courses });
    } catch (error) {
      console.log(error);
    }
  };
  
  const editemployeepost = async (req, res) => {
    const { empId } = req.params;
    try {
       
        const { name, email, mobile, designation, gender,course } = req.body;
        const filePath = req.file ? req.file.path : null;

       
        if (!alphanumValid(name)) {
            req.flash('error', 'Name must be alphanumeric and not empty');
            return res.redirect(`/editEmployee/${empId}`);
        }

        if (!validateEmail(email)) {
            req.flash('error', 'Invalid email format');
            return res.redirect(`/editEmployee/${empId}`);
        }

        if (!isValidMobile(mobile)) {
            req.flash('error', 'Mobile number must be 10 digits');
            return res.redirect(`/editEmployee/${empId}`);
        }

        if (!isValidDesignation(designation)) {
            req.flash('error', 'Designation must only contain letters');
            return res.redirect(`/editEmployee/${empId}`);
        }

        const emailExists = await  Employee.findOne({ email: email, _id: { $ne: empId } });
        
        if (emailExists) {
            req.flash('error', 'Email already exists!');
            return res.redirect(`/editEmployee/${empId}`);
        }
        const selectedMasterCourses = course || [] ;

        const updatedEmployeeData = {
            name,
            email,
            mobile,
            designation,
            gender,
            course: selectedMasterCourses,
        };
        console.log('Employee edit kitty')
        if (filePath) {
            updatedEmployeeData.imgUpload = filePath;
        }

        await Employee.findByIdAndUpdate(empId, updatedEmployeeData, { new: true });

        console.log(Employee,'Employee edit kitty')

        req.flash('success', 'Employee details updated successfully!');
        res.redirect('/employelist');
    } catch (error) {
        console.log(error, 'edit employee error');
        req.flash('error', 'An error occurred while updating the employee details.');
        // res.redirect(`/editEmployee/${empId}`);
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
      
    }
  };

const employeeSearch = async (req, res) => {
    const searchTerm = req.body.search;
    try {

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
    sortEmployees,
    mastercourse,
    mastercoursepost,
    mastercourselist,
    courseeditpost,
    courseedit,
    deletecourse,
}