const mongoose=require('mongoose')
const date=require('date-and-time')
const facultyLeave=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    department:{
        type:String,
        enum:['CSE','CSM','CSD','ECE','CIVIL','MECH']
    },
    reason:String,
    dateTime:{
        type:String,
        default:date.format(new Date(), 'DD-MM-YYYY hh:mm:ss A')
    },
    from_date:{
        type:String
    },
    to_date :{
        type:String
    },
    permision1:{
        type:String,
        enum:['Pending','Accepted','Rejected'],
        default:'Pending'
    },
    permision2:{
        type:String,
        enum:['Pending','Accepted','Rejected'],
        default:'Pending'
    }
})

const FacultyLeave=new mongoose.model('FacultyLeave',facultyLeave);
module.exports=FacultyLeave;