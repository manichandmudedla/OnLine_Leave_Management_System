const express=require('express')
const router= new express.Router()
const bodyParse=require('body-parser')
const StudentLeave=require('../model/studentLeave')
const methodOverride = require('method-override')
router.use(express.json())
router.use(bodyParse.urlencoded({extended:true}))


//method overriding
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and send to (_method) it
      return req.body._method;
    }
  }))

router.get('/student/leave',async(req,res)=>{
    try{
        
        const data=await StudentLeave.find(req.query);
        res.send(data);
    }catch(e){
        res.status(404).send(e);
    }
})

router.post('/student/leave',async(req,res)=>{
    
    try{
        const stdLeave=await StudentLeave(req.body);
        const data=await stdLeave.save();
        res.status(200).send("Leave applied sucessfully...");
    }catch(e){
        res.status(208).send("You can Apply Leave only once per a day");
    }
})
router.patch('/student/leave/:id',async(req,res)=>{
   
    try{
        const data=await StudentLeave.findOneAndUpdate({user : req.params.id},req.body,{
            new:true
        });
         res.send(data);
    }catch(e){
        res.status(500).send(e);
    }
})
router.delete('/student/leave/:id',async(req,res)=>{
    try{
        await StudentLeave.deleteOne({user:req.params.id});
        res.send("Deleted sucessfully...!");
    }catch(e){
        res.send(500).send(e);
    }
})

module.exports=router;