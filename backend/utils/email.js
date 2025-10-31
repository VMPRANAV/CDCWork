const SibApiV3Sdk = require('@sendinblue/client');

// Get the API key and verified sender email from env variables
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.EMAIL_USER;

// Create a new API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Authenticate with your API key
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = BREVO_API_KEY;

const sendEmail = async (options) => {
  // 1) Create the email object
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.html;
  sendSmtpEmail.sender = { name: 'CDC - KPRIET', email: SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: options.email }];

  // 2) Actually send the email
  try {
    // The 'apiInstance.sendTransacEmail' function sends the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent to ${options.email}. Message ID: ${data.messageId}`);
  } catch (error) {
    console.error('Error sending email with Brevo (Sendinblue):', error);
    
    // Log more specific error details from Brevo if available
    if (error.response && error.response.body) {
      console.error(JSON.stringify(error.response.body));
    }
    // Re-throw the error to be caught by the controller
    throw new Error('Email sending failed.');
  }
};
module.exports = sendEmail;