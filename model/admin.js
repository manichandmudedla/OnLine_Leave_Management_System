const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')

const admin=new mongoose.Schema({
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
    password:{
        type:String,
        required:true
    }
})
admin.pre('save',async function(next){
    console.log(`save Function ${this}`);
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})

const Admin=new mongoose.model('Admin',admin);
module.exports=Admin;