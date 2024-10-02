const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController/adminview')

router.get('/',adminController.admin)

router.post('/login',adminController.adminlogin)

router.get('/adminHome',adminController.home)

router.post('/adminsignup',adminController.siginpost)



module.exports = router;