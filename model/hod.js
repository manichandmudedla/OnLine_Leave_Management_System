const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')

const hod=new mongoose.Schema({
    user:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        validate:{
            validator:function(){
                return validator.isEmail(this.email);
            }
        }
    },
    department:{
        type:String,
        enum:['CSE','ECE','CSD','CSM','CIVIL','MECH']
    },
    password:{
        type:String,
        required:true
    },
    ftoken:String
})
hod.pre('save',async function(next){
    console.log(`save Function ${this}`);
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})

const Hod=new mongoose.model('Hod',hod);
module.exports=Hod;