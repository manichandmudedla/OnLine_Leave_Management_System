const mongoose=require('mongoose')
const date=require('date-and-time')
const facultyLeave=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    user:{
        type:String,
        required:true,
        unique:true
    },
    email:String,
    department:{
        type:String,
        enum:['CSE','CSM','CSD','ECE','CIVIL','MECH']
    },
    reason:String,
    date:{
        type:String,
        default:date.format(new Date(), 'DD-MM-YYYY hh:mm:ss A')
    },
    hodPermision:{
        type:String,
        enum:['Pending','Accepted','Rejected'],
        default:'Pending'
    },
    directorPermision:{
        type:String,
        enum:['Pending','Accepted','Rejected'],
        default:'Pending'
    }
})

const FacultyLeave=new mongoose.model('FacultyLeave',facultyLeave);
module.exports=FacultyLeave;