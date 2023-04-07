const mongoose=require('mongoose')
mongoose.connect(process.env.DB_URL,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("connected......mani.!")).catch((e)=>console.log(`Error connecting to database ${e}`));


