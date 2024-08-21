import nodemailer from 'nodemailer'
const feedback_form=async(email)=>{
    const practice_name="Greenwall Dental Clinic"
    const dentist_name="Joseph Greenwall Cohen"
    const from='shubham@dentaladvisor.ai'
    const to=email
    try{
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
      user: from,
      pass: 'oqdi cnkh hday brcz',
      },
     });
        let html=`<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>[PRACTICE_NAME]</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 20px;
          }
          label {
              display: block;
              margin-bottom: 5px;
              font-weight: bold;
          }
          .rating {
              display: flex;
              align-items: center;
          }
          .rating input[type="radio"] {
              display: none;
          }
          .rating label {
              cursor: pointer;
              margin: 0 5px;
          }
          .rating:before {
              content: "Rating: ";
              font-weight: bold;
          }
          .feedback {
              width: 100%;
              padding: 10px;
              box-sizing: border-box;
              border: 1px solid #ccc;
              border-radius: 4px;
              resize: vertical;
          }
          .button {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
          }
          .none{
              display: none;
          }
          .btn{
              font-size: 16px;
              padding: 10px;
              color: white;
              background-color: blue;
              border-radius: 5px;
              border: 1px solid rgba(0, 0, 255, 0.783);
          }
      </style>
  </head>
  
  <body
      style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;padding: 2rem;height: auto;">
      <main style="background: #FFFFFF;">
  
  <p><h2>Treatment Session</h2>(10: highly satisfied, 1: not satisfied)</p>
  <form action="https://server.dentaladvisor.ai/submit/" method="post">
      <input class="none" type="text" id="u_email" name="u_email" value="[u_email]">
      <input class="none" type="text" id="p_email" name="p_email" value="[p_email]">
      <input class="none" type="text" id="session_id" name="session_id" value="[session_id]">
    <label for="dentist">How satisfied are you with Dr. [DENTIST_NAME]?</label>
    <div class="rating">
      <label for="dentist-10">10</label>
      <input type="radio" id="dentist-10" name="dentist_rating" value="10">
      <label for="dentist-9">9</label>
      <input type="radio" id="dentist-9" name="dentist_rating" value="9">
      <label for="dentist-8">8</label>
      <input type="radio" id="dentist-8" name="dentist_rating" value="8">
      <label for="dentist-7">7</label>
      <input type="radio" id="dentist-7" name="dentist_rating" value="7">
      <label for="dentist-6">6</label>
      <input type="radio" id="dentist-6" name="dentist_rating" value="6">
      <label for="dentist-5">5</label>
      <input type="radio" id="dentist-5" name="dentist_rating" value="5">
      <label for="dentist-4">4</label>
      <input type="radio" id="dentist-4" name="dentist_rating" value="4">
      <label for="dentist-3">3</label>
      <input type="radio" id="dentist-3" name="dentist_rating" value="3">
      <label for="dentist-2">2</label>
      <input type="radio" id="dentist-2" name="dentist_rating" value="2">
      <label for="dentist-1">1</label>
      <input type="radio" id="dentist-1" name="dentist_rating" value="1">
  </div>
  <br>
    <label for="reception">How satisfied were you with the reception team?</label>
    <div class="rating">
      <label for="reception-10">10</label>
      <input type="radio" id="reception-10" name="reception_rating" value="10">
      <label for="reception-9">9</label>
      <input type="radio" id="reception-9" name="reception_rating" value="9">
      <label for="reception-8">8</label>
      <input type="radio" id="reception-8" name="reception_rating" value="8">
      <label for="reception-7">7</label>
      <input type="radio" id="reception-7" name="reception_rating" value="7">
      <label for="reception-6">6</label>
      <input type="radio" id="reception-6" name="reception_rating" value="6">
      <label for="reception-5">5</label>
      <input type="radio" id="reception-5" name="reception_rating" value="5">
      <label for="reception-4">4</label>
      <input type="radio" id="reception-4" name="reception_rating" value="4">
      <label for="reception-3">3</label>
      <input type="radio" id="reception-3" name="reception_rating" value="3">
      <label for="reception-2">2</label>
      <input type="radio" id="reception-2" name="reception_rating" value="2">
      <label for="reception-1">1</label>
      <input type="radio" id="reception-1" name="reception_rating" value="1">
  </div>
    <br>
    <label for="waiting">How satisfied were you with the waiting time for the appointment?</label>
    <div class="rating">
      <label for="waiting-10">10</label>
      <input type="radio" id="waiting-10" name="waiting_rating" value="10">
      <label for="waiting-9">9</label>
      <input type="radio" id="waiting-9" name="waiting_rating" value="9">
      <label for="waiting-8">8</label>
      <input type="radio" id="waiting-8" name="waiting_rating" value="8">
      <label for="waiting-7">7</label>
      <input type="radio" id="waiting-7" name="waiting_rating" value="7">
      <label for="waiting-6">6</label>
      <input type="radio" id="waiting-6" name="waiting_rating" value="6">
      <label for="waiting-5">5</label>
      <input type="radio" id="waiting-5" name="waiting_rating" value="5">
      <label for="waiting-4">4</label>
      <input type="radio" id="waiting-4" name="waiting_rating" value="4">
      <label for="waiting-3">3</label>
      <input type="radio" id="waiting-3" name="waiting_rating" value="3">
      <label for="waiting-2">2</label>
      <input type="radio" id="waiting-2" name="waiting_rating" value="2">
      <label for="waiting-1">1</label>
      <input type="radio" id="waiting-1" name="waiting_rating" value="1">
  </div>
    <br>
    <label for="appointment">How satisfied were you with the appointment?</label>
    <div class="rating">
      <label for="appointment-10">10</label>
      <input type="radio" id="appointment-10" name="appointment_rating" value="10">
      <label for="appointment-9">9</label>
      <input type="radio" id="appointment-9" name="appointment_rating" value="9">
      <label for="appointment-8">8</label>
      <input type="radio" id="appointment-8" name="appointment_rating" value="8">
      <label for="appointment-7">7</label>
      <input type="radio" id="appointment-7" name="appointment_rating" value="7">
      <label for="appointment-6">6</label>
      <input type="radio" id="appointment-6" name="appointment_rating" value="6">
      <label for="appointment-5">5</label>
      <input type="radio" id="appointment-5" name="appointment_rating" value="5">
      <label for="appointment-4">4</label>
      <input type="radio" id="appointment-4" name="appointment_rating" value="4">
      <label for="appointment-3">3</label>
      <input type="radio" id="appointment-3" name="appointment_rating" value="3">
      <label for="appointment-2">2</label>
      <input type="radio" id="appointment-2" name="appointment_rating" value="2">
      <label for="appointment-1">1</label>
      <input type="radio" id="appointment-1" name="appointment_rating" value="1">
  </div>
    <br>
    <label for="results">How satisfied were you with the clinical results?</label>
    <div class="rating">
      <label for="results-10">10</label>
      <input type="radio" id="results-10" name="results_rating" value="10">
      <label for="results-9">9</label>
      <input type="radio" id="results-9" name="results_rating" value="9">
      <label for="results-8">8</label>
      <input type="radio" id="results-8" name="results_rating" value="8">
      <label for="results-7">7</label>
      <input type="radio" id="results-7" name="results_rating" value="7">
      <label for="results-6">6</label>
      <input type="radio" id="results-6" name="results_rating" value="6">
      <label for="results-5">5</label>
      <input type="radio" id="results-5" name="results_rating" value="5">
      <label for="results-4">4</label>
      <input type="radio" id="results-4" name="results_rating" value="4">
      <label for="results-3">3</label>
      <input type="radio" id="results-3" name="results_rating" value="3">
      <label for="results-2">2</label>
      <input type="radio" id="results-2" name="results_rating" value="2">
      <label for="results-1">1</label>
      <input type="radio" id="results-1" name="results_rating" value="1">
  </div>
    <br>
    <label for="recommend">How likely are you to recommend [PRACTICE_NAME2]?</label>
    <div class="rating">
      <label for="recommend-10">10</label>
      <input type="radio" id="dentist-10" name="recommend_rating" value="10">
      <label for="recommend-9">9</label>
      <input type="radio" id="dentist-9" name="recommend_rating" value="9">
      <label for="recommend-8">8</label>
      <input type="radio" id="dentist-8" name="recommend_rating" value="8">
      <label for="recommend-7">7</label>
      <input type="radio" id="dentist-7" name="recommend_rating" value="7">
      <label for="recommend-6">6</label>
      <input type="radio" id="dentist-6" name="recommend_rating" value="6">
      <label for="recommend-5">5</label>
      <input type="radio" id="dentist-5" name="recommend_rating" value="5">
      <label for="recommend-4">4</label>
      <input type="radio" id="dentist-4" name="recommend_rating" value="4">
      <label for="recommend-3">3</label>
      <input type="radio" id="dentist-3" name="recommend_rating" value="3">
      <label for="recommend-2">2</label>
      <input type="radio" id="dentist-2" name="recommend_rating" value="2">
      <label for="recommend-1">1</label>
      <input type="radio" id="dentist-1" name="recommend_rating" value="1">
  </div>
    <br>
    <label for="improvement">What could our team do better?</label><br>
    <textarea id="improvement" name="improvement" rows="4" cols="30"></textarea><br><br>
    <input class="btn" type="submit" value="Submit" onclick="this.form.submit()">
  </form>
  
      </main>
  </body>
  
  </html>`
          html = html.replace('[PRACTICE_NAME]', practice_name)
          html = html.replace('[PRACTICE_NAME2]', practice_name)
          html = html.replace('[u_email]', to)
          html = html.replace('[p_email]', from)
          html = html.replace('[session_id]', 0)
          html = html.replace('[DENTIST_NAME]', dentist_name)
          const mailOptions = {
            from: `${practice_name.toUpperCase()} <${from}>`, 
            to: to, 
            subject: `Welcome from ${practice_name}`, 
            html 
           };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              alert(error)
            console.error('Error sending email: ' + error);
            } else {
              alert("Feedback form sent")
            console.log('Email sent: ' + info.response);
            }
           });
  }catch(err){
    console.log("er",err)
  }
     
}

export default feedback_form;