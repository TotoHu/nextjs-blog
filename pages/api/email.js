var nodemailer = require('nodemailer');

export default (req, res) => {
    let action = '';
    if(req.method=='POST'){
        action = req.body.params.action;
    }else{
        action = req.query.action;
    }

    if(action == 'send'){
        const params = req.body.params;
        if( (typeof(params.content) =='string' && '' != params.content)&&
             typeof(params.pwd) =='string' && 'gs2020' == params.pwd ) {
            sendMail(params);
            res.status(200).json({
                flag: true,
                result: 'Y'
            })
        }else{
            res.status(200).json({
                flag: true,
                result: 'N'
            })
        }
    }
}

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols

async function sendMail(params){
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'hutong7@163.com', // generated ethereal user
            pass: 'VNQUWRNSAGODXNSG', // generated ethereal password
        },
    });
    
    // send mail with defined transport object
    console.log("hutong7@163.com"+((params.addr&&params.addr!='')?(','+params.addr):'') );
    let info = await transporter.sendMail({
        from: '"Toto Hu" <hutong7@163.com>', // sender address '"Fred Foo 👻" <foo@example.com>'
        to: "hutong7@163.com"+((params.addr&&params.addr!='')?(','+params.addr):''), // list of receivers
        subject: "Hello", // Subject line
        //text: "Hello world?", // plain text body
        html: ""+params.content, // html body
    });

}
