const express=require('express')
const router=new express.Router()
const bodyParse=require('body-parser')
router.use(express.json())
router.use(bodyParse.urlencoded({extended:true}))
const Director=require('../model/director')
const bcrypt=require('bcrypt')
const methodOverride=require('method-override')

router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and send to (_method) it
      return req.body._method;
    }
  }))

router.get('/director/user',async(req,res)=>{
    try{
        const result=await Director.find(req.query);
        res.send(result);

    }catch(e){
        res.status(404).send(e);
    }
})

router.post('/director/home',async(req,res)=>{
    try{
        const fclty=await Director.findOne({user:req.body.user});
        const verifyPass=await bcrypt.compare(req.body.password,fclty.password);
        if(!verifyPass)throw Error("Invalid Credentials");
        
        res.render('directorHome',fclty);
    }catch(e){
        res.status(401).redirect('/');
    }
})

router.post('/director/user',async(req,res)=>{
    try{
        const fclty=await Director(req.body);
        const result=await fclty.save();
        res.status(200).send(fclty);
    }catch(e){
        res.status(208).send("Some thing went wrong Error in create");
    }
})

router.patch('/director/user/:id',async(req,res)=>{
    try{
         if(req.body.password !==undefined ){
             req.body.password=await bcrypt.hash(req.body.password,10);
             req.body.ftoken="################";
         }
        const fclty=await Director.findOneAndUpdate({_id:req.params.id},req.body,{
            new:true
        });
        if(!fclty)throw Error("Invalid credentials");
        res.status(200).send(`Update sucessFull: ${fclty.user}`);
    }catch(e){
        res.status(500).send(`UpdateFaild..`);
    }
})
router.delete('/director/user/:id',async(req,res)=>{
    try{
        await Director.deleteOne({_id:req.params.id});
        res.send("Deleted sucessfully...!");
    }catch(e){
        res.status(500).send(`Delete failed`);
    }
})

module.exports=router;