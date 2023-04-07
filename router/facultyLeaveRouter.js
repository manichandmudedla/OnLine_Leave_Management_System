const express=require('express')
const router= new express.Router()
const bodyParse=require('body-parser')
const FacultyLeave=require('../model/stafLeave')
const methodOverride=require('method-override')
router.use(express.json())
router.use(bodyParse.urlencoded({extended:true}))
//over riding patch
router.use(methodOverride((req,res)=>{
    if(req.body && typeof(req.body)==Object && _method in req.body) return req._method;
}))

router.get('/faculty/leave',async(req,res)=>{
    try{
        const data=await FacultyLeave.find(req.query);
        res.send(data);
    }catch(e){
        res.status(404).send(e);
    }
})

router.post('/faculty/leave',async(req,res)=>{
    try{
        const fcltyLeave=await FacultyLeave(req.body);
        const data=await fcltyLeave.save();
        res.status(200).send("Leave applied sucessfully...")
    }catch(e){
        res.status(208).send("You can Apply Leave only once per a day");
    }
})
router.patch('/faculty/leave/:id',async(req,res)=>{
    
    try{
        const data=await FacultyLeave.findOneAndUpdate({user : req.params.id},req.body,{
            new:true
        });
        res.status(200).send(data);
    }catch(e){
        res.status(500).send(e);
    }
})
router.delete('/faculty/leave/:id',async(req,res)=>{
    try{
        await FacultyLeave.deleteOne({user:req.params.id});
        res.send("Deleted sucessfully...!");
    }catch(e){
        res.send(500).send(e);
    }
})

module.exports=router;