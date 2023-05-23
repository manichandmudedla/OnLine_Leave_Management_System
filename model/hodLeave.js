const mongoose=require('mongoose')
const date=require('date-and-time')
const hodLeave=new mongoose.Schema({
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
    }
})

const HodLeave=new mongoose.model('HodLeave',hodLeave);
module.exports=HodLeave;