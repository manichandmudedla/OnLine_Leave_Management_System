const express=require('express')
const router=new express.Router()
const bodyParse=require('body-parser')
router.use(express.json())
router.use(bodyParse.urlencoded({extended:true}))
const Faculty=require('../model/faculty')
const bcrypt=require('bcrypt')
const methodOverride=require('method-override')

router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and send to (_method) it
      return req.body._method;
    }
  }))

router.get('/faculty/user',async(req,res)=>{
    try{
        const result=await Faculty.find(req.query);
        res.send(result);

    }catch(e){
        res.status(404).send("Some thing went wrong 404 not found");
    }
})

router.post('/faculty/home',async(req,res)=>{
    try{
        const fclty=await Faculty.findOne({user:req.body.user});
        const verifyPass=await bcrypt.compare(req.body.password,fclty.password);
        if(!verifyPass)throw Error("Invalid Credentials");
        res.render('stafHome',fclty);
    }catch(e){
        res.status(401).redirect('/');
    }
})

router.post('/faculty/user',async(req,res)=>{
    try{
        const fclty=await Faculty(req.body);
        const result=await fclty.save();
        res.status(200).send(fclty);
    }catch(e){
        res.status(208).send("Some thing went wrong Error in create");
    }
})

router.patch('/faculty/user/:id',async(req,res)=>{
    
    try{
         if(req.body.password !==undefined ){
             req.body.password=await bcrypt.hash(req.body.password,10);
             req.body.ftoken="################";
         }
        const fclty=await Faculty.findOneAndUpdate({_id:req.params.id},req.body,{
            new:true
        });
        if(!fclty)throw Error("Invalid credentials");
        res.status(200).send(`Update sucessFull: ${fclty.user}`);
    }catch(e){
        res.status(500).send(`Some thing went wrong..`);
    }
})
router.delete('/faculty/user/:id',async(req,res)=>{
    try{
        await Faculty.deleteOne({_id:req.params.id});
        res.send("Deleted sucessfully...!");
    }catch(e){
        res.status(500).send(`Somthing went wrong unable to Delete`);
    }
})

module.exports=router;