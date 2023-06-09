require('dotenv').config()
const express=require('express')
const app = express();
const hbs=require('hbs')
process.env.TZ='Asia/Calcutta';

require("./db/conn");

const port =process.env.PORT || 3000
const path=require('path');
const { EventEmitter } = require('stream');

app.set('view engine', 'hbs');
app.set('views', './views');
hbs.registerPartials('./views/partials',()=>console.log("partials connected"));


app.use(express.static(path.join(__dirname,'public')))
app.use('/static',express.static(path.join(__dirname,'public')))

app.use(require('./router/studentRouter'))
app.use(require('./router/facultyRouter'))
app.use(require('./router/hodRouter'))
app.use(require('./router/stdLeaveRouter'))
app.use(require('./router/facultyLeaveRouter'))
app.use(require('./router/directorRouter'))
app.use(require('./router/hodLeaveRouter'))
app.use(require('./router/adminRouter'))
app.use(require('./router/resetPassword'))


app.get('/',(req,res)=>{
    res.render('login');
})

app.get('/forgotPassword',(req,res)=>{
  res.render('forgotPassword');
})
// app.get('/logOut',(req,res)=>{
//   res.status(440).render('login');
// })
app.listen(port,()=>{
    console.log(`The server is running in http://localhost:${port}`)
});

//Report genetation of Leave and sending mail..

const date=require('date-and-time')
const events=require('events');
const eventEmitor=new events.EventEmitter();
const nodemailer=require('nodemailer')

// Student , Hod and faulty Report

const sendLeaveReport=async function(reportOf,LeaveModel,toEmail){
  console.log(`${reportOf} report is sended at `+date.format(new Date(), 'hh:mm:ss A'));

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '20r01a0541@gmail.com',
        pass: process.env.PASS
      }
    });
    try{

    var LeaveReport;
    if(reportOf=='Student') LeaveReport=await LeaveModel.find({});
    else LeaveReport=await LeaveModel.find({to_date:{ $lte: date.format(new Date(), 'YYYY-MM-DD')}});
    
    var report="";

    if(reportOf=='Student'){
      LeaveReport=await LeaveModel.find({});
      report=`<h2>${reportOf} Leave Report</h2><br/><table><thead><th>ROll No</th><th>Name</th><th>MentorId</th><th>Branch</th><th>Mentor Permision</th><th>Hod Permision</th></thead><tbody>`;
    for(obj of LeaveReport)
      report+=`<tr><td>${obj.user}</td><td>${obj.name}</td><td>${obj.mentorId}</td><td>${obj.branch}</td><td>${obj.mentorPermision}</td><td>${obj.hodPermision}</td></tr>`;
    }else if(reportOf=='Faculty'){
      report=`<h2>${reportOf} Leave Report</h2><br/><table><thead><th>Employ Id</th><th>Name</th><th>Department</th><th>Request D/T</th><th>From</th><th>To</th><th>HOD Permision</th><th>Director Permision</th></thead><tbody>`;
      for(obj of LeaveReport)
      report+=`<tr><td>${obj.user}</td><td>${obj.name}</td><td>${obj.department}</td><td>${obj.dateTime}</td><td>${obj.from_date}</td><td>${obj.to_date}</td><td>${obj.permision1}</td><td>${obj.permision2}</td></tr>`;
    }else{
      report=`<h2>${reportOf} Leave Report</h2><br/><table><thead><th>Employ Id</th><th>Name</th><th>Department</th><th>Request D/T</th><th>From</th><th>To</th><th>Director Permision</th></thead><tbody>`;
      for(obj of LeaveReport)
      report+=`<tr><td>${obj.user}</td><td>${obj.name}</td><td>${obj.department}</td><td>${obj.dateTime}</td><td>${obj.from_date}</td><td>${obj.to_date}</td><td>${obj.permision1}</td></tr>`;
    }
    report+=`</tbody></table>`;

    var mailOptions = {
      from: '20r01a0541@gmail.com',
      to: toEmail,
      subject: `Todays ${reportOf} Leave Report of CMRIT `,
      text: '${reportOf} Leave Report',
      html:report

    };

    transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        if(reportOf=='Student'){
          await LeaveModel.deleteMany({});
        }else{
          await LeaveModel.deleteMany({to_date:{ $lte: date.format(new Date(), 'YYYY-MM-DD')}})
        }
          console.log(`Deletion of ${reportOf} Leave Sucessfull..`);
      }
    });

    }catch(e){
      console.log('Error in Sending Student Report :'+e);
      setTimeout(()=>eventEmitor.emit("sendStudentReport"), 1800000);
    }
}

eventEmitor.on("sendLeaveReport",sendLeaveReport);

setInterval(function () {
   console.log(date.format(new Date(), 'hh:mm:ss A'));
   if( date.format(new Date(), 'hh:mm A')=="06:38 PM"){ eventEmitor.emit("sendLeaveReport",'Student',require('./model/studentLeave'),'20r01a0541@cmritonline.ac.in');}
   if( date.format(new Date(), 'hh:mm A')=="06:39 PM"){ eventEmitor.emit("sendLeaveReport",'Faculty',require('./model/stafLeave'),'20r01a0541@cmritonline.ac.in');}
   if( date.format(new Date(), 'hh:mm A')=="06:40 PM"){ eventEmitor.emit("sendLeaveReport",'HOD',require('./model/hodLeave'),'20r01a0541@cmritonline.ac.in');}
  }, 60000);
