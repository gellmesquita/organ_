import cron  from 'node-cron'
function   updateDate(){
 console.log("estou analizar o dia")
    
}

let c = cron.schedule('* * * * *', updateDate,{
scheduled:false
});

export default c;
