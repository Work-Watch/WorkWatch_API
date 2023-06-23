const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = async(msg) => {
    const fullMsg = {
        ...msg,
        from: process.env.SUPPORT_EMAIL, 
      }
    
    await sgMail.send(fullMsg)
}