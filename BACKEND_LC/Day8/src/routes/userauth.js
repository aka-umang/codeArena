const express = require('express');
const router = express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require('../controllers/userAuth');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');
//Register
router.post('/register',register);
router.post('/login',login);
router.post('/logout',userMiddleware,logout);
router.post('/admin/register',adminMiddleware,adminRegister);
router.delete('/deleteProfile',userMiddleware,deleteProfile)
router.get('/check',userMiddleware,(req,res)=>{
    const reply={
       firstName:req.user.firstName,
       emailId:req.user.emailId,
       _id: req.user._id,
       role:req.user.role,
       isPremium: req.user.isPremium
    }
    res.status(200).json({
        user:reply,
        message:"valid"
    })
})
// router.get('/getProfile',getProfile);


module.exports=router;