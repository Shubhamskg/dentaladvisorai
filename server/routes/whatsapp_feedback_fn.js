import axios from 'axios';
const WA_PHONE_NUMBER_ID="378044418727950"

const CLOUD_API_ACCESS_TOKEN="EAAGiviZBl4SUBOyQl2f0CNHjCFSn7LHtEZAgfpm9yGZCRCwuJZAGCACRv1fqIp1DZBck2KOtqFB8U20jOI0b2pwkVbrRcSftt61KtYkaI4rEoo1fAncGpFerYvKbR4LRLp956I8VSdjhd06vE2qkxwOtoPz15RQmy1JFfJ8c8RsAZAUITh2a9ZCckInFFFjXc9A6AZDZD"

const CLOUD_API_VERSION="v20.0"

const recipient_number = "+919534978141";

async function send_message(recipient_number)
{
        const data = {
            messaging_product: 'whatsapp',
            to: recipient_number,
            type: 'template',
           template: {
       name: "feedback_survey",
       language: {
           code: "en_US"
       },
       components: [
            {
                type:"header",
                parameters:[
                    {
                        type:"text",
                        text:"Linda Greenwall’s Dental Practice"
                    }
                ]
            },
            {
                type:"body",
                parameters:[
                    {
                        type:"text",
                        text:"Dental Treatment Session"
                    }
                ]
            },
          {
      type: "BUTTON",
      sub_type:"flow",
      index:0,
      parameters:[]
      
    }
       ]
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