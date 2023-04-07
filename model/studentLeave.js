const mongoose=require('mongoose')
const date=require('date-and-time')
const stdLeave=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    user:{
        type:String,
        required:true,
        unique:true
    },
    mentorId:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        enum:['CSE','CSM','CSD','ECE','CIVIL','MECH']
    },
    reason:String,
    date:{
        type:String,
        default:date.format(new Date(), 'DD-MM-YYYY hh:mm:ss A')
    },
    mentorPermision:{
        type:String,
        enum:['Pending','Accepted','Rejected'],
        default:'Pending'
    },
    hodPermision:{
        type:String,
        enum:['Pending','Accepted','Rejected'],
        default:'Pending'
    }
})

const StudentLeave=new mongoose.model('StudentLeave',stdLeave);
module.exports=StudentLeave;