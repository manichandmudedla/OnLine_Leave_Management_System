const express=require('express')
const router= new express.Router()
const bodyParse=require('body-parser')
const HodLeave=require('../model/hodLeave')
const methodOverride=require('method-override')
router.use(express.json())
router.use(bodyParse.urlencoded({extended:true}))
//over riding patch
router.use(methodOverride((req,res)=>{
    if(req.body && typeof(req.body)==Object && _method in req.body) return req._method;
}))

router.get('/hod/leave',async(req,res)=>{
    try{
        const data=await HodLeave.find(req.query);
        res.send(data);
    }catch(e){
        res.status(404).send(e);
    }
})

router.post('/hod/leave',async(req,res)=>{
    try{
        const fcltyLeave=await HodLeave(req.body);
        const data=await fcltyLeave.save();
        res.status(200).send("Leave Applied Sucessfully...");
    }catch(e){
        res.status(208).send("You can Apply Leave only once per a day");
    }
})
router.patch('/hod/leave/:id',async(req,res)=>{
    
    try{
        const data=await HodLeave.findOneAndUpdate({_id: req.params.id},req.body,{ new:true});
        res.status(200).send(data);
    }catch(e){
        res.status(500).send(e);
    }
})
router.delete('/hod/leave/:id',async(req,res)=>{
    try{
        await HodLeave.deleteOne({_id:req.params.id});
        res.send("Deleted sucessfully...!");
    }catch(e){
        res.send(500).send(e);
    }
})

module.exports=router;