import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { CalendarIcon, UploadIcon, MailIcon, PhoneIcon } from 'lucide-react';
import axios from 'axios';
import "./feedback.scss"
import instance from '../config/instance';

const RequestTypeToggle = ({ requestType, setRequestType }) => (
  <div className="form-group request-type">
    <label>Request Type:</label>
    <div className="radio-group">
      {['individual', 'bulk'].map((type) => (
        <label key={type} className={requestType === type ? 'active' : ''}>
          <input
            type="radio"
            value={type}
            checked={requestType === type}
            onChange={() => setRequestType(type)}
          />
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      ))}
    </div>
  </div>
);

const FormField = ({ label, id, type, icon: Icon, ...props }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}:</label>
    <div className={`input-wrapper ${Icon ? 'with-icon' : ''}`}>
      <input type={type} id={id} name={id} required {...props} />
      {Icon && <Icon className="icon" />}
    </div>
  </div>
);

const FileUpload = ({ file, setFile }) => (
  <div className="form-group">
    <label htmlFor="file-upload">Upload Contacts File:</label>
    <div className="file-upload">
      <input
        type="file"
        id="file-upload"
        accept=".txt"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <div className="file-upload-content">
        <UploadIcon className="upload-icon" />
        <span>{file ? file.name : 'Choose a file'}</span>
      </div>
    </div>
    <p className="file-format-info">
      Please upload a .txt file with each line in the format:
      <br />
      name,dob,treatment,date,email/whatsapp
    </p>
  </div>
);

const FeedbackForm = ({ type }) => {
  const [requestType, setRequestType] = useState('individual');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    treatment: '',
    date: '',
    email: '',
    whatsapp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let dataToSend;
      if (requestType === 'individual') {
        dataToSend = {
          ...formData,
          requestType,
          feedbackType: type
        };
        const response = await instance.post('/api/handle_feedback/single', dataToSend, {
            headers: {
              'Content-Type': requestType === 'individual' ? 'application/json' : 'multipart/form-data'
            }
          });
          console.log('Server response:', response.data);
          setSuccess(true);
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('requestType', requestType);
        formData.append('feedbackType', type);
        dataToSend = formData;
        const response = await instance.post('/api/handle_feedback/bulk', dataToSend, {
            headers: {
              'Content-Type': requestType === 'individual' ? 'application/json' : 'multipart/form-data'
            }
          });
          console.log('Server response:', response.data);
          setSuccess(true);
      }

    
     
    } catch (err) {
      console.error('Error sending feedback request:', err);
      setError('An error occurred while sending the feedback request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <RequestTypeToggle requestType={requestType} setRequestType={setRequestType} />
      
      {requestType === 'individual' ? (
        <>
          <FormField label="Name" id="name" type="text" value={formData.name} onChange={handleInputChange} />
          <FormField label="Date of Birth" id="dob" type="date" icon={CalendarIcon} value={formData.dob} onChange={handleInputChange} />
          <div className="form-group">
            <label htmlFor="treatment">Treatment Type:</label>
            <div className="input-wrapper">
              <select id="treatment" name="treatment" required value={formData.treatment} onChange={handleInputChange}>
                <option value="">Select treatment</option>
                {['Cleaning', 'Filling', 'Extraction', 'Root Canal'].map((treatment) => (
                  <option key={treatment} value={treatment.toLowerCase().replace(' ', '-')}>
                    {treatment}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <FormField label="Treatment Date" id="date" type="date" icon={CalendarIcon} value={formData.date} onChange={handleInputChange} />
          {type === 'email' ? (
            <FormField label="Email" id="email" type="email" icon={MailIcon} value={formData.email} onChange={handleInputChange} />
          ) : (
            <FormField label="WhatsApp Number" id="whatsapp" type="tel" icon={PhoneIcon} value={formData.whatsapp} onChange={handleInputChange} />
          )}
        </>
      ) : (
        <FileUpload file={file} setFile={setFile} />
      )}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Feedback request sent successfully!</div>}
      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? 'Sending...' : `Send Feedback Request${requestType === 'bulk' ? 's' : ''}`}
      </button>
    </form>
  );
};

const FeedbackRequestPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="feedback-request-page">
      <h1>Feedback Request</h1>
      <div className="card">
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList>
            {[
              { icon: MailIcon, label: 'Email' },
              { icon: PhoneIcon, label: 'WhatsApp' },
            ].map(({ icon: Icon, label }, index) => (
              <Tab key={label}>
                <Icon size={18} />
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanel>
            <FeedbackForm type="email" />
          </TabPanel>
          <TabPanel>
            <FeedbackForm type="whatsapp" />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackRequestPage;