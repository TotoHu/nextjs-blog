var nodemailer = require('nodemailer');

export default (req, res) => {
    const {
        query: {content, action},
    } = req;

    if(action == 'send'){
        if( typeof(content) =='string' && '' != content) {
            sendMail(content);
            res.status(200).json({
                flag: true,
                data: {
                    result: 'success',
                }
            })
        }
    }
}

/* var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: '163',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: 'hutong7@163.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'VNQUWRNSAGODXNSG'
    }
}); */

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols

async function sendMail(content){
    
    /* var mailOptions = {
        from: 'hutong7@163.com', // 发件地址
        to: 'hutong7@163.com', // 收件列表
        subject: 'Test Email', // 标题
        //text和html两者只支持一种
        //text: 'Hello world ?', // 标题
        html: '<b>Hello world ?</b>' // html 内容
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    }); */


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
    console.log('sdfsssssssssssssssssssssssssss---------', content);
    // send mail with defined transport object
    let info = await transporter.sendMail({
       // from: '"Fred Foo 👻" <foo@example.com>', // sender address
        from: 'hutong7@163.com', // sender address
        to: "hutong7@163.com,totohu@globalsources.com", // list of receivers
        subject: "Hello", // Subject line
        //text: "Hello world?", // plain text body
        html: ""+content, // html body
    });

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}
