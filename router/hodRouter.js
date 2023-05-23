const express=require('express')
const router=new express.Router()
const bodyParse=require('body-parser')
router.use(express.json())
router.use(bodyParse.urlencoded({extended:true}))
const Hod=require('../model/hod')
const bcrypt=require('bcrypt')
const methodOverride=require('method-override')

router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and send to (_method) it
      return req.body._method;
    }
  }))

router.get('/hod/user',async(req,res)=>{
    try{
        const result=await Hod.find(req.query);
        res.send(result);

    }catch(e){
        res.status(404).send(e);
    }
})

router.post('/hod/home',async(req,res)=>{
    try{
        const fclty=await Hod.findOne({user:req.body.user});
        const verifyPass=await bcrypt.compare(req.body.password,fclty.password);
        if(!verifyPass)throw Error("Invalid Credentials");
        res.render('hodHome',fclty);
    }catch(e){
        res.status(401).redirect('/');
    }
})

router.post('/hod/user',async(req,res)=>{
    try{
        const fclty=await Hod(req.body);
        const result=await fclty.save();
        res.status(200).send(fclty);
    }catch(e){
        res.status(208).send("Some thing went wrong Error in create");
    }
})

router.patch('/hod/user/:id',async(req,res)=>{
    try{
         if(req.body.password !==undefined ){
             req.body.password=await bcrypt.hash(req.body.password,10);
             req.body.ftoken="################";
         }
        const fclty=await Hod.findOneAndUpdate({_id:req.params.id},req.body,{
            new:true
        });
        if(!fclty)throw Error("Invalid credentials");
        res.status(200).send(`Update sucessFull: ${fclty.user}`);
    }catch(e){
        res.status(500).send(`something went wrong updateFailed..`);
    }
})
router.delete('/hod/user/:id',async(req,res)=>{
    try{
        await Hod.deleteOne({_id:req.params.id});
        res.send("Deleted sucessfully...!");
    }catch(e){
        res.status(500).send(`Delete failed..`)
    }
})

module.exports=router;