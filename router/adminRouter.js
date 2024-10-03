const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController/adminview')
const { adminAuth } = require('../middleware/auth')

router.post('/adminsignup',adminController.siginpost)

router.get('/',adminController.admin)

router.post('/login',adminController.adminlogin)

router.get('/adminHome',adminAuth,adminController.home)

router.get('/employelist',adminAuth,adminController.employelist)

router.get('/addemploye',adminAuth,adminController.addemploye)

router.post('/addemploypost',adminController.addemploypost)

router.get('/logout',adminAuth,adminController.logout)




module.exports = router;