const express=require('express')
const router=new express.Router()
const bodyParser=require('body-parser')
const Student=require('../model/student')
const bcrypt=require('bcrypt')
const methodOverride=require('method-override')
router.use(express.json())
router.use(bodyParser.urlencoded({extended:true}))

router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and send to (_method) it
      return req.body._method;
    }
  }))

router.get('/student/user',async(req,res)=>{
    try{
        const result=await Student.find(req.query);
        res.send(result);

    }catch(e){
        res.status(404).send(e);
    }
})
router.post('/student/home',async(req,res)=>{
    try{
        
       const user=await Student.findOne({user:req.body.user});
        const verifyPass=await bcrypt.compare(req.body.password,user.password);
        if(verifyPass){
           
            res.render('studentHome',user);
        }else{
            res.status(401).redirect('/');
        }
    }catch(e){
        res.status(401).redirect('/');
    }
})
router.post('/student/user',async(req,res)=>{
   try{
    const std=new Student(req.body);
    const result= await std.save();
   // console.log(result);
    res.status(200).send(`New Student added Sucessfully:${result.user}`);

   }catch(e){
    res.status(208).send(`Somthing went wrong: duplicate Entries`);
   }
})
router.patch('/student/user/:id',async(req,res)=>{
    try{
        if(req.body.password!==undefined){
            req.body.password=await bcrypt.hash(req.body.password,10);
        }
        const std=await Student.findOneAndUpdate({user:req.params.id},req.body,{ 
            new:true
        });
        if(!std)throw Error('update Failed..!');
        res.status(200).send(`updateSucessFull...`);
    }catch(e){
        res.status(500).send(`Error while updating :${e}`);
    }
})
router.delete('/student/user/:id',async(req,res)=>{
    try{
        await Student.deleteOne({user:req.params.id});
        res.send("deleted sucessfully....");
    }catch(e){
        res.status(500).send("Deletion failed..");
    }
})

module.exports=router;

