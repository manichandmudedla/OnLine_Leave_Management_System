// Import required packages
const express = require('express');
const router=new express.Router()
const nodemailer = require('nodemailer');

const jwt = require("jsonwebtoken");


router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const Student=require("../model/student")
const Faculty=require("../model/faculty")
const Hod=require("../model/hod")
const Director=require('../model/director')
const Admin=require('../model/admin')

const Model=new Map([
  ['student',Student],['faculty',Faculty],['director',Director],['admin',Admin],['hod',Hod]
])

const sendResetLink=async function(req,res,LType,Model){
  //code

  var data=await Model.findOne({user:req.body.user});
    if(!data)return res.send("Invalid credentials");
    //console.log(typeof(data));
    const token=jwt.sign({_id:data._id,LType:LType}, process.env.SECRET_KEY, { expiresIn: '1h' });
    //console.log(`token:${token} ${data._id}`);
    const data2=await Model.findOneAndUpdate({_id : data._id},{ftoken:token},{new:true});
    console.log(data2);
    if(!data2)return res.send("somthing went wrong");
    var link=`${req.get('host')}/resetPassword/${token}`;

  //code
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '20r01a0541@gmail.com',
      pass: process.env.PASS
    }
  });

  var mailOptions = {
    from: '20r01a0541@gmail.com',
    to: data.email,
    subject: `Password Reset Link of CMRIT Leave`,
    text: 'Resert your Password:',
    html:`<h4>Link:</h4>http://${link}`

  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      
      console.log(error);
      return res.send("<h2 style='color:green;'>Error in sending mail..</h2>");
    } else {
      console.log('Email sent: ' + info.response);
      return res.send("<h2 style='color:green;'>Rest Link sent to Email sucessfull..</h2>");
    }
  });

}

router.post('/forgotPassword',async(req,res)=>{
  try{
    sendResetLink(req,res,req.body.TLogin,Model.get(req.body.TLogin));
  }catch(e){
    res.send(`Error:${e}`);
  }
})

router.get('/resetPassword/:token',async(req,res)=>{
  try{
  
  const data=jwt.verify(req.params.token, process.env.SECRET_KEY );
  const verify=await Model.get(data.LType).findOne({_id:data._id,ftoken:req.params.token});
  if(!verify)return res.send("<h2 style='color:red;'>Link Expired...</h2>");
  res.render('resetPassword',data);
  }catch(e){
    res.status(500).send("<h2 style='color:red;'>Error Link Expired...</h2>");
  }
})

module.exports=router;


