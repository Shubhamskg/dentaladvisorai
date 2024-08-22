import axios from 'axios';
const WA_PHONE_NUMBER_ID="378044418727950"

const CLOUD_API_ACCESS_TOKEN=process.env.CLOUD_API_ACCESS_TOKEN

const CLOUD_API_VERSION="v20.0"

const recipient_number = "+919534978141";

async function send_message(recipient_number)
{
        const data = {
            messaging_product: 'whatsapp',
            to: recipient_number,
            type: 'template',
           template: {
       name: "q1temp",
       language: {
           code: "en"
       },
   }
          };
          try {
            const response = await axios.post(
              `https://graph.facebook.com/v20.0/378044418727950/messages`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${CLOUD_API_ACCESS_TOKEN}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            console.log('Message sent successfully:', response.data);
          } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred while sending the message');
          }
        
}
export default send_message;