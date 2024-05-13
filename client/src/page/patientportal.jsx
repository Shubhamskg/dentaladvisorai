import React, { useEffect, useState } from "react";
import "./patientportal.scss";

const Patientportal = () => {
  

  return (
    <div className="main_container">
        <div className="header">
            <h1 className="title">Welcome to Dental Advisor</h1>
        </div>
        <div className="containers">
            <div className="treatment">
                <label>Select Treatment Name</label>
                <select type="text" placeholder="Select Treatment">
                <option value="Airflow">Airflow</option>
  <option value="">10</option>
  <option value="15">15</option>
  <option value="20">20</option>
  </select>
            <div className="treatmentdetail">
                <h1>Treatment Detail</h1>
                <div className="data">
                <p><b>Patient Name</b> : Mr. Avinash Gupta</p>
                <p><b>Dentist Name</b> : Mr. Rajesh Kharna</p>
                <p><b> Treatment</b>  : Airflow</p>
                <p><b> Date of Treatment</b>  : 25/04/2024</p>
                <p><b> Next Appointment </b> : 08/05/2024</p>
                </div>
            </div>
            </div>
            <div className="box">
                <div className="gpt">
                    <p>Hello welcome from Dental Advisor</p>
                </div>
                <div className="user">
                    <p>Please suggest me dental treatment for airflow</p>
                </div>
                <div className="gpt2">
                    <p>Here's why you might consider airflow treatment:

To remove stains: Airflow treatment is effective at removing stains caused by coffee, tea, red wine, tobacco, and some mouthwashes.
To remove plaque: Airflow treatment can help remove plaque, a sticky film of bacteria that forms on teeth. Plaque can lead to cavities and gum disease.
To improve gum health: Airflow treatment can help improve gum health by removing plaque and bacteria from the gum line.
For a whiter smile: Airflow treatment can help brighten your smile by removing stains. However, it is not a teeth whitening treatment.
For sensitive teeth: Airflow treatment is a gentle procedure that is often a good option for people with sensitive teeth.
For orthodontic patients: Airflow treatment can be used to clean around orthodontic brackets and wires.</p>
                </div>
            </div>
            <div className="contact">
                <h1>Contact Details</h1>
                <div className="data">
                <p><b> Name </b> : Mr. Rajesh Kharna</p>
                <p><b> Clinic Name </b> : Shivam Dental Clinic</p>
                <p><b> Phone</b>  : 4461487845</p>
                <p><b> Email </b> : rajeshkhana@gmail.com</p>
                <p><b> Address </b> : Street Park, London</p>
                </div>
            </div>

        </div>
        <div className="dentalgpt">
            <div className="inputbar">
                <input className="input" placeholder="Ask from Dental Advisor"/>
            </div>
            <div className="button">
                <button className="btn">Submit</button>
            </div>
        </div>
    </div>
  );
};


  

export default Patientportal;
