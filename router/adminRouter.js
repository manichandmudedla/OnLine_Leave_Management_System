const express=require('express')
const router=new express.Router()
const bodyParse=require('body-parser')
router.use(express.json())
router.use(bodyParse.urlencoded({extended:true}))
const Admin=require('../model/admin')
const bcrypt=require('bcrypt')


router.post('/admin/home',async(req,res)=>{
    try{
        const fclty=await Admin.findOne({user:req.body.user});
        const verifyPass=await bcrypt.compare(req.body.password,fclty.password);
        if(!verifyPass)throw Error("Invalid Credentials");
        
        res.render('adminHome',fclty);
    }catch(e){
        res.status(401).redirect('/');
    }
})

router.post('/admin/user',async(req,res)=>{
    try{
        const fclty=await Admin(req.body);
        const result=await fclty.save();
        res.status(200).send(fclty);
    }catch(e){
        res.status(208).send("Some thing went wrong Error in create");
    }
})


router.delete('/admin/user/:id',async(req,res)=>{
    try{
        await Admin.deleteOne({user:req.params.id});
        res.send("Deleted sucessfully...!");
    }catch(e){
        res.status(500).send(`Delete failed`);
    }
})

module.exports=router;