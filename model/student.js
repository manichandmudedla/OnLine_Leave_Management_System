const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')

const student=new mongoose.Schema({
    name:String,
    user:{
        type:String,
        unique:[true,"userid should be unique"],
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:[true,"email should be unique"],
        validate:{
            validator:function(){
                return validator.isEmail(this.email);
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        enum:['CSE','ECE','CSD','CSM','CIVIL','MECH']
    },
    mentorId:String
})


student.pre("save",async function(next){
    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10);
    }
    next();
})


const Student=new mongoose.model("Student",student);
module.exports=Student;