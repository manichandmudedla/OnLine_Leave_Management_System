const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')

const faculty=new mongoose.Schema({
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


faculty.pre('save',async function(next){
    console.log(`save Function ${this}`);
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})

const Faculty=new mongoose.model('Faculty',faculty);
module.exports=Faculty;