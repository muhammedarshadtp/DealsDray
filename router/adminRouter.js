const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController/adminview')
const { adminAuth } = require('../middleware/auth')
const { upload } = require('../middleware/multer')

router.post('/adminsignup',adminController.siginpost)

router.get('/',adminController.admin)

router.post('/login',adminController.adminlogin)

router.get('/adminHome',adminAuth,adminController.home)

router.get('/employelist',adminAuth,adminController.employelist)

router.get('/employelistSearch',adminAuth,adminController.employelistSearch)

router.get('/addemploye',adminAuth,adminController.addemploye)

router.post('/addemploypost',upload.single('profilePicture'), adminController.addemploypost)

router.get('/editEmployee/:empId',adminAuth,adminController.editemployee)

router.post('/updateEmployee/:empId',upload.single('profilePicture'), adminController.editemployeepost)

router.delete('/deleteEmployee/:empId',adminAuth,adminController.deleteemployee)

router.patch('/updateStatusEmployee/:empId',adminAuth,adminController.updateStausEmployee)

router.post('/employeeSearch',adminAuth ,adminController.employeeSearch)


router.get('/sortEmployees',adminAuth,adminController.sortEmployees)


router.get('/logout',adminAuth,adminController.logout)




module.exports = router;